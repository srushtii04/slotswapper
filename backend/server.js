import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import jwt from "jsonwebtoken";
import { PORT, MONGO_URI, JWT_SECRET } from "./config.js";
import authRoutes from "./routes/auth.js";
import eventRoutes from "./routes/events.js";
import swapRoutes from "./routes/swap.js";

const app = express();
app.use(cors());
app.use(express.json());

// auth middleware
function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return res.status(401).json({ error: "No token" });
  try {
    const token = header.split(" ")[1];
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

app.use("/api/auth", authRoutes);
app.use("/api/events", auth, eventRoutes);
app.use("/api", auth, swapRoutes);

mongoose.connect(MONGO_URI).then(() => {
  console.log("✅ MongoDB connected");
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});
