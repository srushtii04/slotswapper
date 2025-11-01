import React, { useEffect, useState } from "react";
import axios from "axios";

const Marketplace = () => {
  const [swappableSlots, setSwappableSlots] = useState([]);
  const [mySlots, setMySlots] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const token = localStorage.getItem("token");
  const API = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: { Authorization: `Bearer ${token}` },
  });

  // Fetch all other users' swappable slots
  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const res = await API.get("/swappable-slots");
        setSwappableSlots(res.data);
      } catch (err) {
        console.error("Error fetching swappable slots:", err);
      }
    };
    fetchSlots();
  }, []);

  // Fetch my own swappable slots for offering
  const fetchMySlots = async () => {
    try {
      const res = await API.get("/events");
      const swappables = res.data.filter((e) => e.status === "SWAPPABLE");
      setMySlots(swappables);
    } catch (err) {
      console.error("Error fetching my slots:", err);
    }
  };

  // Open swap modal
  const openModal = (targetSlot) => {
    setSelectedTarget(targetSlot);
    fetchMySlots();
    setShowModal(true);
  };

  // Send swap request
  const handleSwapRequest = async () => {
    if (!selectedOffer || !selectedTarget) return alert("Select a slot to offer!");

    try {
      await API.post("/swap-request", {
        mySlotId: selectedOffer._id,
        theirSlotId: selectedTarget._id,
      });
      alert("Swap request sent!");
      setShowModal(false);
    } catch (err) {
      console.error("Error sending swap request:", err);
      alert("Failed to send swap request.");
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">🕒 Marketplace — Available Swappable Slots</h2>

      {swappableSlots.length === 0 ? (
        <p className="text-gray-500">No swappable slots available right now.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {swappableSlots.map((slot) => (
            <div
              key={slot._id}
              className="border p-4 rounded-xl shadow-md hover:shadow-lg transition"
            >
              <h3 className="font-semibold text-lg">{slot.title}</h3>
              <p className="text-sm text-gray-600 mt-1">
                {new Date(slot.startTime).toLocaleString()} —{" "}
                {new Date(slot.endTime).toLocaleString()}
              </p>
              <button
                onClick={() => openModal(slot)}
                className="mt-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Request Swap
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal for selecting my slot */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-96">
            <h3 className="text-xl font-semibold mb-4">Offer One of Your Swappable Slots</h3>

            {mySlots.length === 0 ? (
              <p className="text-gray-500 mb-4">You don’t have any swappable slots yet.</p>
            ) : (
              <select
                className="w-full border p-2 rounded-md mb-4"
                onChange={(e) =>
                  setSelectedOffer(mySlots.find((s) => s._id === e.target.value))
                }
              >
                <option value="">Select one of your slots</option>
                {mySlots.map((slot) => (
                  <option key={slot._id} value={slot._id}>
                    {slot.title} — {new Date(slot.startTime).toLocaleString()}
                  </option>
                ))}
              </select>
            )}

            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded-md"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-md"
                onClick={handleSwapRequest}
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
