import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function NavBar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center shadow-md">
      <div className="space-x-6 font-semibold">
        <Link to="/dashboard" className="hover:text-gray-200">Dashboard</Link>
        <Link to="/marketplace" className="hover:text-gray-200">Marketplace</Link>
        <Link to="/requests" className="hover:text-gray-200">Requests</Link>
      </div>
      <button
        onClick={logout}
        className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </nav>
  );
}
