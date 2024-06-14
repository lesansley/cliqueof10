import express from "express";
const router = express.Router();
import db from "../server.js";

// Endpoint to register a new user
router.post("/register", (req, res) => {
  const { username, password } = req.body;
  db.ref("users/" + username).once("value", (snapshot) => {
    if (snapshot.exists()) {
      return res.status(400).json({ error: "User already exists" });
    }
    db.ref("users/" + username).set(
      {
        password,
        profile: {
          username,
          bio: "",
          email: "",
          firstName: "",
          lastName: "",
          country: "",
          city: "",
          hobbies: [],
          friends: [],
          friendRequests: [],
          invitesSent: [],
        },
      },
      (error) => {
        if (error) {
          console.error("Error registering user:", error);
          res.status(500).json({ error: "Error registering user" });
        } else {
          res.status(200).json({ message: "User registered successfully" });
        }
      }
    );
  });
});

// Endpoint to login
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  db.ref("users/" + username).once("value", (snapshot) => {
    const userData = snapshot.val();
    if (userData && userData.password === password) {
      res.status(200).json(userData.profile);
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });
});

export default router;
