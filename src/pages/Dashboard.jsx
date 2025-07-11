// 📁 src/pages/Dashboard.jsx

import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";

const Dashboard = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const dailyRef = collection(db, "games-daily");
        const weeklyRef = collection(db, "games-weekly");

        const [dailySnap, weeklySnap] = await Promise.all([
          getDocs(dailyRef),
          getDocs(weeklyRef),
        ]);

        const dailyData = dailySnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          type: "Daily Scrim",
        }));

        const weeklyData = weeklySnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          type: "Weekly War",
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
    navigate(`/payment/${type.toLowerCase().replace(" ", "")}/${id}`);
  };

  const toggleCard = (index) => {
    const card = document.getElementById(`card-${index}`);
    if (card) card.classList.toggle("active");
  };

  return (
    <div className="p-4 w-full bg-gray-100 min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">🎯 Live Tournaments</h1>

      {loading ? (
        <p className="text-gray-600 animate-pulse">⏳ Loading tournament details...</p>
      ) : tournaments.length === 0 ? (
        <p className="text-gray-600">No tournaments found.</p>
      ) : (
        <div className="flex flex-wrap gap-6 justify-center">
          {tournaments.map((tourney, index) => (
            <div
              key={tourney.id}
              className="cardContainer"
              onClick={() => toggleCard(index)}
            >
              <div className="card" id={`card-${index}`}>
                <div className="side front">
                  <div className={`img img${(index % 3) + 1}`}></div>
                  <div className="info p-4">
                    <h2>{tourney.type}</h2>
                    <p>💰 Entry Fee: ₹{tourney.fee}</p>
                  </div>
                </div>

                <div className="side back">
                  <div className="info">
                    <h2>{tourney.type}</h2>
                    <p className="mb-4 text-gray-800">{tourney.description}</p>
                    <div className="btn-wrapper flex justify-center mt-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // prevent flip
                          handleJoin(tourney.type, tourney.id);
                        }}
                        className="bg-yellow-500 text-white font-bold py-2 px-6 rounded hover:bg-yellow-600 transition duration-300"
                      >
                        Join Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
