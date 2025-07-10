// src/pages/Dashboard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Welcome to the Dashboard</h1>
      <div className="space-x-4">
        <button
          onClick={() => navigate("/add-team")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Team
        </button>
        <button
          onClick={() => navigate("/join-tournament")}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Join Tournament
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
