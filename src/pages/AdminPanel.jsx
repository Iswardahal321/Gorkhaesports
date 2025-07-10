// src/pages/AdminPanel.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

function AdminPanel() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-6">Admin Panel</h1>
      <div className="flex gap-4">
        <button
          onClick={() => navigate("/admin/teams")}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          View All Teams
        </button>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-gray-700 text-white px-6 py-2 rounded hover:bg-gray-800"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default AdminPanel;
