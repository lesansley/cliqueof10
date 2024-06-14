// databaseURL: process.env.FIREBASE_DATABASE_URL,
import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import admin from "firebase-admin";
import cors from "cors";
import serviceAccount from "./firebase-config.js";

import friendsRoutes from "./routes/friends.js";
import profileRoutes from "./routes/profile.js";
import authRoutes from "./routes/auth.js";
import chatRoutes from "./routes/chat.js";
import adminRoutes from "./routes/admin.js";

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

const db = admin.database();
const app = express();

app.use(cors());
app.use(bodyParser.json());

// Import Routes

// Use Routes
app.use("/friends", friendsRoutes);
app.use("/profile", profileRoutes);
app.use("/auth", authRoutes);
app.use("/chat", chatRoutes);
app.use("/admin", adminRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default db;
