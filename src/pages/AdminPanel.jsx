// 📁 src/pages/AdminPanel.jsx

import React, { useEffect, useState } from "react"; import { collection, getDocs, query, where } from "firebase/firestore"; import { db } from "../firebase/config"; import { useNavigate } from "react-router-dom";

function AdminPanel() { const navigate = useNavigate();

const [userCount, setUserCount] = useState(0); const [weeklyPlayers, setWeeklyPlayers] = useState(0); const [dailyPlayers, setDailyPlayers] = useState(0); const [totalFees, setTotalFees] = useState(0); const [loading, setLoading] = useState(true);

useEffect(() => { const fetchData = async () => { try { // Users count (those who created a team) const teamSnap = await getDocs(collection(db, "teams")); setUserCount(teamSnap.size);

// Weekly War Players
    const weeklyQuery = query(
      collection(db, "tournament_joins"),
      where("type", "==", "Weekly War")
    );
    const weeklySnap = await getDocs(weeklyQuery);
    setWeeklyPlayers(weeklySnap.size);

    // Daily Scrim Players
    const dailyQuery = query(
      collection(db, "tournament_joins"),
      where("type", "==", "Daily Scrim")
    );
    const dailySnap = await getDocs(dailyQuery);
    setDailyPlayers(dailySnap.size);

    // Calculate total fees from all joins
    let total = 0;
    [...weeklySnap.docs, ...dailySnap.docs].forEach((doc) => {
      const data = doc.data();
      if (data.fee) total += Number(data.fee);
    });
    setTotalFees(total);
  } catch (error) {
    console.error("Error fetching admin stats:", error);
  } finally {
    setLoading(false);
  }
};

fetchData();

}, []);

return ( <div className="min-h-screen p-6 bg-gray-100"> <h2 className="text-3xl font-bold mb-6 text-center">📊 Admin Dashboard</h2>

{loading ? (
    <p className="text-lg text-center text-gray-500 animate-pulse">
      ⏳ Loading stats...
    </p>
  ) : (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-10">
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
          <p className="text-2xl font-bold text-yellow-600">{dailyPlayers}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="text-lg font-semibold mb-1">💸 Total Fees Collected</h3>
          <p className="text-2xl font-bold text-red-600">₹{totalFees}</p>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={() => navigate("/admin/payments")}
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
        >
          📁 View Payment Details
        </button>
      </div>
    </>
  )}
</div>

); }

export default AdminPanel;

