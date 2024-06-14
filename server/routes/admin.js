import express from "express";
import db from "../server.js";

const router = express.Router();

// Middleware to check if the user is an admin
const checkAdmin = (req, res, next) => {
  // const { isAdmin } = req.query; // Simplified check, in a real app you should use proper authentication and authorization
  // if (isAdmin === "true") {
  //   next();
  // } else {
  //   res.status(403).json({ error: "Unauthorized" });
  // }
  next();
};

// Endpoint to fetch all users
router.get("/users", checkAdmin, async (req, res) => {
  try {
    const usersRef = db.ref("users");
    const snapshot = await usersRef.once("value");
    const users = snapshot.val() || {};
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Error fetching users" });
  }
});

// Endpoint to delete a user
router.delete("/users/:username", checkAdmin, async (req, res) => {
  const { username } = req.params;

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  try {
    const userRef = db.ref(`users/${username}`);
    await userRef.remove();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Error deleting user" });
  }
});

export default router;
