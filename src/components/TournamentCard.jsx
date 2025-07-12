// 📁 src/components/TournamentCard.jsx

import React from "react";
import { useNavigate } from "react-router-dom";

const TournamentCard = ({ tournament }) => {
  const navigate = useNavigate();

  return (
    <div className="flip-card">
      <div className="flip-card-inner">
        {/* Front */}
        <div className="flip-card-front p-4 bg-white shadow rounded">
          <h2 className="text-lg font-bold">{tournament.name}</h2>
          <p>Type: {tournament.type}</p>
          <p>Entry Fee: ₹{tournament.entryFee}</p>
        </div>

        {/* Back */}
        <div className="flip-card-back p-4 bg-gray-100 shadow rounded flex flex-col justify-center items-center">
          <p className="mb-2">Ready to Join?</p>
          <button
            onClick={() => navigate(`/join-tournament/${tournament.id}`)}
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
          >
            Join Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default TournamentCard;
