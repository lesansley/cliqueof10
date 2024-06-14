import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import admin from "firebase-admin";
import cors from "cors";
import serviceAccount from "./firebase-config.js";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

const db = admin.database();
const app = express();

app.use(cors());
app.use(bodyParser.json());

const validateInput = (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }
  next();
};

app.post("/register", validateInput, (req, res) => {
  const { username, password } = req.body;
  db.ref("users/" + username).once("value", (snapshot) => {
    if (snapshot.exists()) {
      return res.status(400).json({ error: "User already exists" });
    }
    db.ref("users/" + username).set(
      {
        password,
        profile: { username, bio: "", chat: [] },
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

app.post("/login", validateInput, (req, res) => {
  const { username, password } = req.body;
  db.ref("users/" + username)
    .once("value", (snapshot) => {
      const userData = snapshot.val();
      if (userData && userData.password === password) {
        res.status(200).json(userData.profile);
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
    })
    .catch((error) => {
      console.error("Error logging in:", error);
      res.status(500).json({ error: "Error logging in" });
    });
});

app.post("/update-profile", (req, res) => {
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

app.post("/send-message", (req, res) => {
  const { username, message } = req.body;
  if (!username || !message) {
    return res.status(400).json({ error: "Username and message are required" });
  }
  db.ref("users/" + username + "/profile/chat").push(message, (error) => {
    if (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ error: "Error sending message" });
    } else {
      res.status(200).json({ message: "Message sent successfully" });
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
