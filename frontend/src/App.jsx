import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "./components/Navbar";

export default function App() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token]);

  return (
    <div>
      {token && <NavBar />}
      <div className="p-4 max-w-4xl mx-auto">
        <Outlet />
      </div>
    </div>
  );
}
