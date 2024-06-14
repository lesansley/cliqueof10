import express from "express";
const router = express.Router();
import db from "../server.js";

// Endpoint to update profile
router.post("/update", (req, res) => {
  const { username, bio, email, firstName, lastName, country, city, hobbies } =
    req.body;
  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  const updates = {
    bio,
    email,
    firstName,
    lastName,
    country,
    city,
    hobbies,
  };

  db.ref("users/" + username + "/profile").update(updates, (error) => {
    if (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ error: "Error updating profile" });
    } else {
      res.status(200).json({ message: "Profile updated successfully" });
    }
  });
});

// Endpoint to get profile details
router.get("/", (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  db.ref("users/" + username + "/profile").once("value", (snapshot) => {
    const profileData = snapshot.val();
    if (profileData) {
      res.status(200).json(profileData);
    } else {
      res.status(404).json({ error: "Profile not found" });
    }
  });
});

export default router;
