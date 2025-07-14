// 📁 src/pages/Dashboard.jsx

import React, { useEffect, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";

const Dashboard = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMap, setStatusMap] = useState({
    daily: "inactive",
    weekly: "inactive",
  });
  const navigate = useNavigate();

  // ✅ Fetch Live Tournament Status
  useEffect(() => {
    const unsubDaily = onSnapshot(doc(db, "tournament_status", "daily_status"), (snap) => {
      if (snap.exists()) {
        setStatusMap((prev) => ({ ...prev, daily: snap.data().status }));
      }
    });

    const unsubWeekly = onSnapshot(doc(db, "tournament_status", "weekly_status"), (snap) => {
      if (snap.exists()) {
        setStatusMap((prev) => ({ ...prev, weekly: snap.data().status }));
      }
    });

    return () => {
      unsubDaily();
      unsubWeekly();
    };
  }, []);

  // ✅ Fetch Tournament Details
  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const dailySnap = await getDocs(collection(db, "games_daily"));
        const weeklySnap = await getDocs(collection(db, "games_weekly"));

        const dailyData = dailySnap.docs.map((doc) => ({
          id: doc.id,
          type: "Daily Scrim",
          collectionType: "daily",
          ...doc.data(),
        }));

        const weeklyData = weeklySnap.docs.map((doc) => ({
          id: doc.id,
          type: "Weekly War",
          collectionType: "weekly",
          ...doc.data(),
        }));

        setTournaments([...dailyData, ...weeklyData]);
      } catch (error) {
        console.error("❌ Error fetching tournaments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  const handleJoin = (type, id) => {
    const normalizedType = type.toLowerCase().replace(/\s/g, "");
    navigate(`/join-tournament/${normalizedType}/${id}`);
  };

  const toggleCard = (index) => {
    const card = document.getElementById(`card-${index}`);
    if (card) card.classList.toggle("active");
  };

  return (
    <div className="p-4 w-full bg-gray-100 min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">🔥 Live Tournaments</h1>

      {loading ? (
        <p className="text-gray-600 animate-pulse text-lg">
          ⏳ Loading tournament details...
        </p>
      ) : tournaments.length === 0 ? (
        <p className="text-gray-600 text-lg">No live tournaments found.</p>
      ) : (
        <div className="flex flex-wrap justify-center gap-6">
          {tournaments.map((game, index) => {
            const isActive = statusMap[game.collectionType] === "active";

            return (
              <div
                key={game.id}
                className="cardContainer"
                onClick={() => toggleCard(index)}
              >
                <div className="card" id={`card-${index}`}>
                  <div className="side front">
                    <div className={`img img${(index % 3) + 1}`}></div>
                    <div className="info p-4">
                      <h2>{game.type}</h2>
                      <p>💰 Entry Fee: ₹{game.fee || 0}</p>
                      {!isActive && (
                        <p className="text-red-600 text-sm font-medium mt-1">
                          ❌ Not Active Yet
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="side back">
                    <div className="info">
                      <h2>{game.name || game.type}</h2>
                      <p className="mb-4 text-gray-800">
                        {game.description || "No description provided."}
                      </p>
                      <div className="btn-wrapper flex justify-center mt-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleJoin(game.type, game.id);
                          }}
                          className={`${
                            isActive
                              ? "bg-yellow-500 hover:bg-yellow-600"
                              : "bg-gray-400 cursor-not-allowed"
                          } text-white font-bold py-2 px-6 rounded transition duration-300`}
                          disabled={!isActive}
                        >
                          Join Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
