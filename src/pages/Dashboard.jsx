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
      const tournamentRef = collection(db, "tournaments");
      const snapshot = await getDocs(tournamentRef);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTournaments(data);
    };

    fetchTournaments();
  }, []);

  const handleJoin = (type, id) => {
    navigate(`/payment/${type}/${id}`);
  };

  return (
    <div className="p-4 w-full bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">🎯 Available Tournaments</h1>

      {tournaments.length === 0 ? (
        <p className="text-gray-600">No tournaments found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tournaments.map((tourney) => (
            <div
              key={tourney.id}
              className="bg-white shadow-md p-6 rounded-lg border border-gray-200"
            >
              <h2 className="text-xl font-bold mb-2">{tourney.name}</h2>
              <p className="text-gray-700 mb-2">💰 Entry Fee: ₹{tourney.fee}</p>
              <p className="text-gray-600 mb-4">{tourney.description}</p>
              <div className="flex gap-4">
                <button
                  onClick={() => handleJoin("daily", tourney.id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Join Daily Scrim
                </button>
                <button
                  onClick={() => handleJoin("weekly", tourney.id)}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Join Weekly War
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
