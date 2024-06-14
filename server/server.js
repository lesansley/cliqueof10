import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import admin from "firebase-admin";
import serviceAccount from "./firebase-config.js";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

const db = admin.database();
const app = express();
app.use(bodyParser.json());

app.post("/register", (req, res) => {
  const { username, password } = req.body;
  db.ref("users/" + username).set(
    {
      password,
      profile: { username, bio: "", chat: [] },
    },
    (error) => {
      if (error) {
        res.status(500).send("Error registering user");
      } else {
        res.status(200).send("User registered successfully");
      }
    }
  );
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  db.ref("users/" + username).once("value", (snapshot) => {
    const userData = snapshot.val();
    if (userData && userData.password === password) {
      res.status(200).send(userData.profile);
    } else {
      res.status(401).send("Invalid credentials");
    }
  });
});

app.post("/update-profile", (req, res) => {
  const { username, bio } = req.body;
  db.ref("users/" + username + "/profile").update({ bio }, (error) => {
    if (error) {
      res.status(500).send("Error updating profile");
    } else {
      res.status(200).send("Profile updated successfully");
    }
  });
});

app.post("/send-message", (req, res) => {
  const { username, message } = req.body;
  db.ref("users/" + username + "/profile/chat").push(message, (error) => {
    if (error) {
      res.status(500).send("Error sending message");
    } else {
      res.status(200).send("Message sent successfully");
    }
  });
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
