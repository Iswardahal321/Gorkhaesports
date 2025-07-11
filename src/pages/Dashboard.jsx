import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [tournaments, setTournaments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const snapshot = await getDocs(collection(db, "games"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTournaments(data);
      } catch (err) {
        console.error("Error fetching tournaments:", err);
      }
    };

    fetchTournaments();
  }, []);

  const handleJoin = (type, id) => {
    navigate(`/payment/${type}/${id}`);
  };

  return (
    <div className="p-4 w-full bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">🎮 Live Tournaments</h1>

      {tournaments.length === 0 ? (
        <p className="text-gray-600">No tournaments found.</p>
      ) : (
        <div className="flex flex-wrap justify-center gap-6">
          {tournaments.map((tourney, idx) => (
            <div
              key={idx}
              className="cardContainer relative w-[300px] h-[400px] perspective"
              onClick={(e) =>
                e.currentTarget
                  .querySelector(".card")
                  .classList.toggle("active")
              }
            >
              <div className="card w-full h-full transition-transform duration-500 transform-style preserve-3d">
                {/* Front Side */}
                <div className="side front absolute w-full h-full backface-hidden bg-white rounded shadow-md">
                  <div className="h-[250px] bg-gray-300 rounded-t" />
                  <div className="p-4">
                    <h2 className="text-xl font-bold text-gray-800 uppercase">
                      {tourney.type}
                    </h2>
                    <p className="text-gray-700 mt-2">💰 Entry Fee: ₹{tourney.fee}</p>
                  </div>
                </div>

                {/* Back Side */}
                <div className="side back absolute w-full h-full backface-hidden rotate-y-180 bg-white rounded shadow-md flex flex-col justify-between p-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2 uppercase">
                      {tourney.type}
                    </h2>
                    <p className="text-gray-700">{tourney.description}</p>
                  </div>
                  <div className="btn-wrapper flex justify-center mt-4">
                    <button
                      onClick={() => handleJoin(tourney.type, tourney.id)}
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
