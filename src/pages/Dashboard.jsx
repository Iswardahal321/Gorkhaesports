// 📁 src/pages/Dashboard.jsx

import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [tournaments, setTournaments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTournaments = async () => {
      const dailySnap = await getDocs(collection(db, "games_daily"));
      const weeklySnap = await getDocs(collection(db, "games_weekly"));

      const dailyData = dailySnap.docs.map((doc) => ({
        id: doc.id,
        type: "Daily Scrim",
        ...doc.data(),
      }));

      const weeklyData = weeklySnap.docs.map((doc) => ({
        id: doc.id,
        type: "Weekly War",
        ...doc.data(),
      }));

      setTournaments([...dailyData, ...weeklyData]);
    };

    fetchTournaments();
  }, []);

  const handleJoin = (type, id) => {
    navigate(`/payment/${type.toLowerCase().replace(" ", "")}/${id}`);
  };

  return (
    <div className="p-4 w-full bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">🔥 Live Tournaments</h1>

      {tournaments.length === 0 ? (
        <p className="text-gray-600">No live tournaments found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tournaments.map((game) => (
            <div
              key={game.id}
              className="bg-white shadow-md p-6 rounded-lg border border-gray-200"
            >
              <h2 className="text-xl font-bold mb-2">{game.name || "Untitled Tournament"}</h2>
              <p className="text-sm text-gray-600 mb-1">🏷 Type: {game.type}</p>
              <p className="text-sm text-gray-600 mb-1">💰 Entry Fee: ₹{game.fee || 0}</p>
              <p className="text-sm text-gray-700 mb-4">{game.description || "No description provided."}</p>
              <button
                onClick={() => handleJoin(game.type, game.id)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Join Now
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
