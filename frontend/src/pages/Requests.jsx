import React, { useEffect, useState } from "react";
import axios from "axios";

const Requests = () => {
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const token = localStorage.getItem("token");

  const API = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: { Authorization: `Bearer ${token}` },
  });

  // Fetch swap requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await API.get("/swap-requests");
        setIncoming(res.data.incoming);
        setOutgoing(res.data.outgoing);
      } catch (err) {
        console.error("Error fetching requests:", err);
      }
    };
    fetchRequests();
  }, []);

  // Handle accept/reject
  const handleResponse = async (id, accept) => {
    try {
      await API.post(`/swap-response/${id}`, { accept });
      alert(`Request ${accept ? "accepted" : "rejected"} successfully.`);
      // Refresh lists
      const res = await API.get("/swap-requests");
      setIncoming(res.data.incoming);
      setOutgoing(res.data.outgoing);
    } catch (err) {
      console.error("Error responding to request:", err);
      alert("Failed to respond to request.");
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">🔄 Swap Requests</h2>

      {/* Incoming Requests */}
      {incoming.length === 0 ? (
        <p className="text-gray-500">No incoming requests.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {incoming.map((req) => (
            <div key={req._id} className="border p-4 rounded-xl shadow-md">
              <p className="font-semibold">{req.requesterId?.name} wants to swap:</p>
              <p className="text-gray-700 mt-2">
                <strong>Their slot:</strong> {req.requesterEventId?.title} <br />
                <strong>Your slot:</strong> {req.responderEventId?.title}
              </p>
              <div className="mt-4 flex space-x-3">
                <button
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                  onClick={() => handleResponse(req._id, true)}
                >
                  Accept
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                  onClick={() => handleResponse(req._id, false)}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Outgoing Requests */}
      {outgoing.length === 0 ? (
        <p className="text-gray-500">No outgoing requests.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {outgoing.map((req) => (
            <div key={req._id} className="border p-4 rounded-xl shadow-md">
              <p className="font-semibold">
                You requested a swap with {req.responderId?.name}
              </p>
              <p className="text-gray-700 mt-2">
                <strong>Your slot:</strong> {req.requesterEventId?.title} <br />
                <strong>Their slot:</strong> {req.responderEventId?.title}
              </p>
              <p
                className={`mt-3 font-semibold ${
                  req.status === "PENDING"
                    ? "text-yellow-600"
                    : req.status === "ACCEPTED"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                Status: {req.status}
              </p>
            </div>
          ))}
        </div>
      )}


    </div>
  );
};

export default Requests;
