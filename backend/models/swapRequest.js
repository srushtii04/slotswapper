import mongoose from "mongoose";

const swapRequestSchema = new mongoose.Schema({
  requesterId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  responderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  requesterEventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  responderEventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  status: { type: String, enum: ["PENDING", "ACCEPTED", "REJECTED"], default: "PENDING" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("SwapRequest", swapRequestSchema);
