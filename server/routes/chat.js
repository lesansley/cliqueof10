import express from "express";
import db from "../server.js";

const router = express.Router();

// Helper function to generate a unique chat ID based on both usernames
const generateChatId = (user1, user2) => {
  return [user1, user2].sort().join("_");
};

// Endpoint to fetch chat history
router.get("/history", async (req, res) => {
  const { user1, user2 } = req.query;

  if (!user1 || !user2) {
    return res.status(400).json({ error: "Both usernames are required" });
  }

  try {
    const chatId = generateChatId(user1, user2);
    const chatRef = db.ref(`chats/${chatId}`);
    const snapshot = await chatRef.once("value");
    const chatHistory = snapshot.val() || [];

    res.status(200).json(chatHistory);
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(500).json({ error: "Error fetching chat history" });
  }
});

// Endpoint to send a message
router.post("/send", async (req, res) => {
  const { sender, recipient, message } = req.body;

  if (!sender || !recipient || !message) {
    return res
      .status(400)
      .json({ error: "Sender, recipient, and message are required" });
  }

  try {
    const chatId = generateChatId(sender, recipient);
    const chatRef = db.ref(`chats/${chatId}`);
    const newMessageRef = chatRef.push();
    await newMessageRef.set({
      sender,
      recipient,
      message,
      timestamp: Date.now(),
    });

    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Error sending message" });
  }
});

export default router;
