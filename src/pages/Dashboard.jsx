// 📁 src/pages/Dashboard.jsx

import React, { useEffect, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  getDocs
} from "firebase/firestore";
import { db } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";

const Dashboard = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dailyActive, setDailyActive] = useState(false);
  const [weeklyActive, setWeeklyActive] = useState(false);
  const navigate = useNavigate();

  // ✅ Fetch Game Status Live
  useEffect(() => {
    const unsubDaily = onSnapshot(doc(db, "tournament_status", "daily_status"), (snap) => {
      if (snap.exists()) setDailyActive(snap.data().status === "active");
    });

    const unsubWeekly = onSnapshot(doc(db, "tournament_status", "weekly_status"), (snap) => {
      if (snap.exists()) setWeeklyActive(snap.data().status === "active");
    });

    return () => {
      unsubDaily();
      unsubWeekly();
    };
  }, []);

  // ✅ Live Fetch Game Data
  useEffect(() => {
    const unsubDaily = onSnapshot(collection(db, "games_daily"), (snap) => {
      const dailyData = snap.docs.map((doc) => ({
        id: doc.id,
        type: "Daily Scrim",
        ...doc.data(),
      }));

      setTournaments((prev) => {
        const others = prev.filter((g) => g.type !== "Daily Scrim");
        return [...others, ...dailyData];
      });
    });

    const unsubWeekly = onSnapshot(collection(db, "games_weekly"), (snap) => {
      const weeklyData = snap.docs.map((doc) => ({
        id: doc.id,
        type: "Weekly War",
        ...doc.data(),
      }));

      setTournaments((prev) => {
        const others = prev.filter((g) => g.type !== "Weekly War");
        return [...others, ...weeklyData];
      });
    });

    setLoading(false);

    return () => {
      unsubDaily();
      unsubWeekly();
    };
  }, []);

  const handleJoin = (type, id) => {
    const normalizedType = type.toLowerCase().replace(/\s/g, "");
    navigate(`/join-tournament/${normalizedType}/${id}`);
  };

  const toggleCard = (index) => {
    const card = document.getElementById(`card-${index}`);
    if (card) card.classList.toggle("active");
  };

  const isGameActive = (type) =>
    (type === "Daily Scrim" && dailyActive) ||
    (type === "Weekly War" && weeklyActive);

  return (
    <div className="p-4 w-full bg-gray-100 min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">🔥 Live Tournaments</h1>

      {loading ? (
        <p className="text-gray-600 animate-pulse text-lg">⏳ Loading tournament details...</p>
      ) : tournaments.length === 0 ? (
        <p className="text-gray-600 text-lg">No live tournaments found.</p>
      ) : (
        <div className="flex flex-wrap justify-center gap-6">
          {tournaments.map((game, index) => {
            const active = isGameActive(game.type);

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
                      {!active && (
                        <p className="text-red-600 font-medium mt-1">
                          🚫 Not Active Yet
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
                          disabled={!active}
                          className={`${
                            active
                              ? "bg-yellow-500 hover:bg-yellow-600"
                              : "bg-gray-400 cursor-not-allowed"
                          } text-white font-bold py-2 px-6 rounded transition duration-300`}
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
