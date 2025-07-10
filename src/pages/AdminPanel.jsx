// src/pages/AdminPanel.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

function AdminPanel() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h2 className="text-3xl font-bold mb-6">Admin Panel</h2>
      <div className="space-y-4">
        <button
          onClick={() => navigate("/admin/teams")}
          className="bg-blue-600 text-white px-6 py-3 rounded"
        >
          View All Teams
        </button>
        {/* Add more admin actions here if needed */}
      </div>
    </div>
  );
}

export default AdminPanel;
