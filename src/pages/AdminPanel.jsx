import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { useNavigate } from "react-router-dom";

function AdminPanel() {
  const navigate = useNavigate();

  const [userCount, setUserCount] = useState(0);
  const [weeklyPlayers, setWeeklyPlayers] = useState(0);
  const [dailyPlayers, setDailyPlayers] = useState(0);
  const [totalFees, setTotalFees] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ Registered Users = teams
        const teamSnap = await getDocs(collection(db, "teams"));
        setUserCount(teamSnap.size);

        // ✅ Tournament Joined Users + Fees
        const joinSnap = await getDocs(collection(db, "tournament_joins"));

        let weeklyCount = 0;
        let dailyCount = 0;
        let feesTotal = 0;

        joinSnap.forEach((doc) => {
          const data = doc.data();
          const fee = parseFloat(data.fee || 0);

          if (data.type === "Weekly War") {
            weeklyCount += 1;
            feesTotal += fee;
          } else if (data.type === "Daily Scrim") {
            dailyCount += 1;
            feesTotal += fee;
          }
        });

        setWeeklyPlayers(weeklyCount);
        setDailyPlayers(dailyCount);
        setTotalFees(feesTotal);
      } catch (err) {
        console.error("❌ Failed to fetch data:", err);
      }
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
          <h3 className="text-lg font-semibold mb-1">🎮 Weekly War Players</h3>
          <p className="text-2xl font-bold text-green-600">{weeklyPlayers}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="text-lg font-semibold mb-1">🕹️ Daily Scrim Players</h3>
          <p className="text-2xl font-bold text-indigo-600">{dailyPlayers}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center col-span-1 sm:col-span-3">
          <h3 className="text-lg font-semibold mb-1">💸 Total Fees Collected</h3>
          <p className="text-3xl font-bold text-red-600">₹{totalFees}</p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="space-y-4 text-center">
        <button
          onClick={() => navigate("/admin/payments")}
          className="bg-blue-600 text-white px-6 py-3 rounded w-full sm:w-auto"
        >
          📁 View Payment Details
        </button>
      </div>
    </div>
  );
}

export default AdminPanel;
