// 📁 src/pages/Dashboard.jsx

import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [tournamentsByType, setTournamentsByType] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTournaments = async () => {
      const snapshot = await getDocs(collection(db, "tournaments"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      // Group by type
      const grouped = {};
      data.forEach((item) => {
        const type = item.type || "others";
        if (!grouped[type]) grouped[type] = [];
        grouped[type].push(item);
      });

      setTournamentsByType(grouped);
    };

    fetchTournaments();
  }, []);

  const handleJoin = (type, id) => {
    navigate(`/payment/${type}/${id}`);
  };

  return (
    <div className="p-4 w-full bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">🔥 Live Tournaments</h1>

      {Object.keys(tournamentsByType).length === 0 ? (
        <p className="text-gray-600 text-center">No tournaments found.</p>
      ) : (
        Object.keys(tournamentsByType).map((typeKey) => (
          <div key={typeKey} className="mb-10">
            <h2 className="text-2xl font-bold mb-4 capitalize">{typeKey.replace(/([A-Z])/g, ' $1')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tournamentsByType[typeKey].map((tourney) => (
                <div
                  key={tourney.id}
                  className="bg-white shadow-md p-6 rounded-lg border border-gray-200"
                >
                  <h3 className="text-xl font-semibold mb-2">{tourney.name}</h3>
                  <p className="text-gray-700 mb-1">💰 Entry Fee: ₹{tourney.fee}</p>
                  <p className="text-gray-700 mb-1">🎮 Type: {tourney.type}</p>
                  <p className="text-gray-700 mb-3">📅 Date: {tourney.date || "Coming Soon"}</p>
                  <p className="text-gray-600 mb-4">{tourney.description}</p>
                  <button
                    onClick={() => handleJoin(typeKey, tourney.id)}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
                  >
                    Join Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Dashboard;
