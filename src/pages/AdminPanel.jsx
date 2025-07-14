// 📁 src/pages/AdminPanel.jsx

import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { useNavigate } from "react-router-dom";

function AdminPanel() {
  const navigate = useNavigate();

  const [userCount, setUserCount] = useState(0);
  const [joinedDailyCount, setJoinedDailyCount] = useState(0);
  const [joinedWeeklyCount, setJoinedWeeklyCount] = useState(0);
  const [totalFees, setTotalFees] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // ✅ Registered Users - Users who created a team
        const teamSnap = await getDocs(collection(db, "teams"));
        const uniqueUserIds = new Set();
        teamSnap.forEach((doc) => {
          const data = doc.data();
          if (data.userId) uniqueUserIds.add(data.userId);
        });
        setUserCount(uniqueUserIds.size);

        // ✅ Joined Players (from tournament_joins)
        const joinSnap = await getDocs(collection(db, "tournament_joins"));
        let dailyCount = 0;
        let weeklyCount = 0;
        let feeTotal = 0;

        joinSnap.forEach((doc) => {
          const data = doc.data();
          if (data.type === "Daily Scrim") dailyCount++;
          if (data.type === "Weekly War") weeklyCount++;
          if (data.fee) feeTotal += Number(data.fee);
        });

        setJoinedDailyCount(dailyCount);
        setJoinedWeeklyCount(weeklyCount);
        setTotalFees(feeTotal);
      } catch (err) {
        console.error("❌ Failed to fetch admin dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h2 className="text-3xl font-bold mb-6 text-center">📊 Admin Dashboard</h2>

      {loading ? (
        <p className="text-center text-gray-600 animate-pulse">⏳ Loading data...</p>
      ) : (
        <>
          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            <div className="bg-white p-4 rounded shadow text-center">
              <h3 className="text-lg font-semibold mb-1">👤 Registered Users</h3>
              <p className="text-2xl font-bold text-blue-600">{userCount}</p>
            </div>
            <div className="bg-white p-4 rounded shadow text-center">
              <h3 className="text-lg font-semibold mb-1">🎮 Joined Players</h3>
              <p className="text-sm text-gray-600">Daily: {joinedDailyCount}</p>
              <p className="text-sm text-gray-600">Weekly: {joinedWeeklyCount}</p>
              <p className="text-xl font-bold text-green-600">
                Total: {joinedDailyCount + joinedWeeklyCount}
              </p>
            </div>
            <div className="bg-white p-4 rounded shadow text-center">
              <h3 className="text-lg font-semibold mb-1">💸 Total Fees Collected</h3>
              <p className="text-2xl font-bold text-red-600">₹{totalFees}</p>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="space-y-4">
            <button
              onClick={() => navigate("/admin/payments")}
              className="bg-blue-600 text-white px-6 py-3 rounded w-full sm:w-auto"
            >
              📁 View Payment Details
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminPanel;
