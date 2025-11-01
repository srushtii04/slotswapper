import React, { useEffect, useState } from "react";
import API from "../api";

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: "", startTime: "", endTime: "" });

  const fetchEvents = async () => {
    try {
      const res = await API.get("/events");
      setEvents(res.data);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const addEvent = async (e) => {
    e.preventDefault();
    try {
      await API.post("/events", newEvent);
      setNewEvent({ title: "", startTime: "", endTime: "" });
      fetchEvents();
    } catch (err) {
      console.error("Error adding event:", err);
    }
  };

  // 🔹 New function: update status (BUSY → SWAPPABLE)
  const updateStatus = async (id, newStatus) => {
    try {
      await API.put(`/events/${id}`, { status: newStatus });
      fetchEvents(); // refresh the list
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Calendar</h1>

      {/* Add New Event */}
      <form onSubmit={addEvent} className="flex flex-wrap gap-2 mb-4">
        <input
          placeholder="Title"
          value={newEvent.title}
          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="datetime-local"
          value={newEvent.startTime}
          onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="datetime-local"
          value={newEvent.endTime}
          onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
          className="border p-2 rounded"
        />
        <button className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
          Add
        </button>
      </form>

      {/* Event List */}
      <ul className="space-y-2">
        {events.map((ev) => (
          <li
            key={ev._id}
            className="bg-white border rounded p-3 shadow flex justify-between items-center"
          >
            <div>
              <strong>{ev.title}</strong>
              <p className="text-sm text-gray-500">
                {new Date(ev.startTime).toLocaleString()} -{" "}
                {new Date(ev.endTime).toLocaleString()}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Colored Status Badge */}
              <span
                className={`text-sm font-semibold px-2 py-1 rounded ${
                  ev.status === "BUSY"
                    ? "bg-red-100 text-red-700"
                    : ev.status === "SWAPPABLE"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {ev.status || "BUSY"}
              </span>

              {/* Make Swappable Button */}
              {ev.status === "BUSY" && (
                <button
                  onClick={() => updateStatus(ev._id, "SWAPPABLE")}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  Make Swappable
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
