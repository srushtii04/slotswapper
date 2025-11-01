import express from "express";
import Event from "../models/event.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const events = await Event.find({ ownerId: req.user.id }).sort("startTime");
  res.json(events);
});

router.post("/", async (req, res) => {
  const { title, startTime, endTime } = req.body;
  const event = await Event.create({ title, startTime, endTime, ownerId: req.user.id });
  res.status(201).json(event);
});

router.patch("/:id", async (req, res) => {
  const ev = await Event.findOne({ _id: req.params.id, ownerId: req.user.id });
  if (!ev) return res.status(404).json({ error: "Not found" });
  Object.assign(ev, req.body);
  await ev.save();
  res.json(ev);
});

router.put("/:id", async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true }
        );
        res.json(event);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



export default router;
