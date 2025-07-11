// src/pages/AdminPanel.jsx
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { useNavigate } from "react-router-dom";

function AdminPanel() {
  const navigate = useNavigate();

  const [userCount, setUserCount] = useState(0);
  const [teamCount, setTeamCount] = useState(0);
  const [totalFees, setTotalFees] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      // Users count
      const userSnap = await getDocs(collection(db, "users"));
      setUserCount(userSnap.size);

      // Teams count & registration fee total
      const teamSnap = await getDocs(collection(db, "teams"));
      setTeamCount(teamSnap.size);

      let total = 0;
      teamSnap.forEach((doc) => {
        const data = doc.data();
        if (data.registrationFee) {
          total += Number(data.registrationFee);
        }
      });
      setTotalFees(total);
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h2 className="text-3xl font-bold mb-6 text-center">📊 Admin Dashboard</h2>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="text-lg font-semibold mb-1">👤 Registered Users</h3>
          <p className="text-2xl font-bold text-blue-600">{userCount}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="text-lg font-semibold mb-1">🎮 Joined Players</h3>
          <p className="text-2xl font-bold text-green-600">{teamCount}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="text-lg font-semibold mb-1">💸 Total Fees Collected</h3>
          <p className="text-2xl font-bold text-red-600">₹{totalFees}</p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="space-y-4">
        <button
          onClick={() => navigate("/admin/teams")}
          className="bg-blue-600 text-white px-6 py-3 rounded w-full sm:w-auto"
        >
          📁 View All Teams
        </button>
      </div>
    </div>
  );
}

export default AdminPanel;
