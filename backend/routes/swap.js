import express from "express";
import Event from "../models/event.js";
import SwapRequest from "../models/swapRequest.js";

const router = express.Router();

// swappable slots (other users)
router.get("/swappable-slots", async (req, res) => {
  const slots = await Event.find({
    status: "SWAPPABLE",
    ownerId: { $ne: req.user.id },
  }).populate("ownerId", "name email");
  res.json(slots);
});

// create swap request
router.post("/swap-request", async (req, res) => {
  const { mySlotId, theirSlotId } = req.body;
  const myEv = await Event.findById(mySlotId);
  const theirEv = await Event.findById(theirSlotId);

  if (!myEv || !theirEv) return res.status(404).json({ error: "Slot not found" });
  if (myEv.ownerId.toString() !== req.user.id)
    return res.status(403).json({ error: "Not your slot" });

  if (myEv.status !== "SWAPPABLE" || theirEv.status !== "SWAPPABLE")
    return res.status(400).json({ error: "Not swappable" });

  const reqDoc = await SwapRequest.create({
    requesterId: req.user.id,
    responderId: theirEv.ownerId,
    requesterEventId: mySlotId,
    responderEventId: theirSlotId,
  });

  // set pending
  await Promise.all([
    Event.findByIdAndUpdate(mySlotId, { status: "SWAP_PENDING" }),
    Event.findByIdAndUpdate(theirSlotId, { status: "SWAP_PENDING" }),
  ]);

  res.json(reqDoc);
});

// respond to swap
router.post("/swap-response/:id", async (req, res) => {
  const { accepted } = req.body;
  const swapReq = await SwapRequest.findById(req.params.id);
  if (!swapReq) return res.status(404).json({ error: "Request not found" });

  if (swapReq.responderId.toString() !== req.user.id)
    return res.status(403).json({ error: "Not your request" });

  const [reqEv, resEv] = await Promise.all([
    Event.findById(swapReq.requesterEventId),
    Event.findById(swapReq.responderEventId),
  ]);

  if (accepted) {
    // swap ownership
    const reqOwner = reqEv.ownerId;
    reqEv.ownerId = resEv.ownerId;
    resEv.ownerId = reqOwner;
    reqEv.status = "BUSY";
    resEv.status = "BUSY";
    swapReq.status = "ACCEPTED";
    await Promise.all([reqEv.save(), resEv.save(), swapReq.save()]);
    res.json({ message: "Swap accepted" });
  } else {
    swapReq.status = "REJECTED";
    await swapReq.save();
    await Promise.all([
      Event.findByIdAndUpdate(reqEv._id, { status: "SWAPPABLE" }),
      Event.findByIdAndUpdate(resEv._id, { status: "SWAPPABLE" }),
    ]);
    res.json({ message: "Swap rejected" });
  }
});

// Get all swap requests (incoming + outgoing)
router.get("/swap-requests", async (req, res) => {
  try {
    const incoming = await SwapRequest.find({ responderId: req.user.id })
      .populate("requesterId", "name email")
      .populate("requesterEventId", "title startTime endTime")
      .populate("responderEventId", "title startTime endTime");

    const outgoing = await SwapRequest.find({ requesterId: req.user.id })
      .populate("responderId", "name email")
      .populate("requesterEventId", "title startTime endTime")
      .populate("responderEventId", "title startTime endTime");

    res.json({ incoming, outgoing });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


export default router;
