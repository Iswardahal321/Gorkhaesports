import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import "./dashboard.css"; // ✅Custom flip card stylessss

const Dashboard = () => {
  const [games, setGames] = useState([]);
  const navigate = useNavigate();

  
  useEffect(() => {
    const fetchGames = async () => {
      const dailySnap = await getDocs(collection(db, "games_daily"));
      const weeklySnap = await getDocs(collection(db, "games_weekly"));

      const dailyGames = dailySnap.docs.map((doc) => ({
        id: doc.id,
        type: "Daily Scrim",
        ...doc.data(),
      }));

      
      const weeklyGames = weeklySnap.docs.map((doc) => ({
        id: doc.id,
        type: "Weekly War",
        ...doc.data(),
      }));

      setGames([...dailyGames, ...weeklyGames]);
    };

    fetchGames();
  }, []);

  const handleJoin = (type, id) => {
    navigate(`/payment/${type === "Daily Scrim" ? "daily" : "weekly"}/${id}`);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">🎮 Live Tournaments</h2>
      <div className="flex flex-wrap justify-center gap-6">
        {games.length === 0 ? (
          <p className="text-gray-600">No tournaments found.</p>
        ) : (
          games.map((game, index) => (
            <div
              key={game.id}
              className="cardContainer"
              onClick={(e) => {
                e.currentTarget.querySelector(".card").classList.toggle("active");
              }}
            >
              <div className="card">
                <div className="side front">
                  <div className={`img img${(index % 3) + 1}`}></div>
                  <div className="info text-center">
                    <h2 className="text-xl font-bold">{game.type}</h2>
                    <p className="mt-2 text-gray-700">💰 ₹{game.fee}</p>
                  </div>
                </div>
                <div className="side back">
                  <div className="info">
                    <h2 className="text-lg font-bold">{game.name || game.type}</h2>
                    <p className="text-gray-600 mb-4">
                      {game.description || "No description provided."}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleJoin(game.type, game.id);
                      }}
                      className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                    >
                      Join Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
