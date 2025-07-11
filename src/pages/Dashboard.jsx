import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import "./dashboard.css"; // Make sure this exists

const Dashboard = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const snapshot = await getDocs(collection(db, "tournaments"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTournaments(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching tournaments:", err);
        setLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  const handleJoin = (type, id) => {
    navigate(`/payment/${type}/${id}`);
  };

  const toggleCard = (index) => {
    setTournaments((prev) =>
      prev.map((t, i) =>
        i === index ? { ...t, active: !t.active } : { ...t, active: false }
      )
    );
  };

  
  return (
    <div className="p-4 w-full bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">🎯 Live Tournaments</h1>

      {loading ? (
        <div className="flex flex-col items-center justify-center mt-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-yellow-500 border-solid mb-4"></div>
          <p className="text-gray-600 font-medium text-lg">Loading tournament details...</p>
        </div>
      ) : tournaments.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No tournaments found.</p>
      ) : (
        <div className="flex flex-wrap justify-center gap-6">
          {tournaments.map((tourney, index) => (
            <div
              key={tourney.id}
              className={`cardContainer ${tourney.active ? "active" : ""}`}
              onClick={() => toggleCard(index)}
            >
              <div className={`card ${tourney.active ? "active" : ""}`}>
                <div className="side front">
                  <div className={`img img${(index % 3) + 1}`}></div>
                  <div className="info p-4">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                      {tourney.type === "daily" ? "Daily Scrim" : "Weekly War"}
                    </h2>
                    <p className="text-gray-600">💰 Entry Fee: ₹{tourney.fee}</p>
                  </div>
                </div>

                <div className="side back">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Tournament Details</h2>
                    <p className="text-gray-700 mb-4">{tourney.description}</p>
                  </div>
                  <div className="btn-wrapper flex justify-center mt-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
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
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
