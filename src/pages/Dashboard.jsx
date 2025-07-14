// 📁 src/pages/Dashboard.jsx

import React, { useEffect, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  query,
  where,
  getDocs,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db, auth } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";

const Dashboard = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMap, setStatusMap] = useState({ daily: "inactive", weekly: "inactive" });
  const [teamExists, setTeamExists] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupImage, setPopupImage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkTeam = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const q = query(collection(db, "teams"), where("leaderEmail", "==", currentUser.email));
      const snap = await getDocs(q);
      setTeamExists(!snap.empty);
    };
    checkTeam();
  }, []);

  useEffect(() => {
    const checkPopup = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(collection(db, "users"), where("email", "==", user.email));
      const snap = await getDocs(q);
      if (snap.empty) return;

      const userDoc = snap.docs[0];
      const userRef = userDoc.ref;
      const userData = userDoc.data();

      if (!userData.popupShown) {
        const configRef = doc(db, "popup_config", "global");
        const configSnap = await getDoc(configRef);

        if (configSnap.exists()) {
          const data = configSnap.data();
          if (data.active && data.imageUrl) {
            setPopupImage(data.imageUrl);
            setShowPopup(true);
            await updateDoc(userRef, { popupShown: true });
          }
        }
      }
    };
    checkPopup();
  }, []);

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

  useEffect(() => {
    const dailyRef = collection(db, "games_daily");
    const weeklyRef = collection(db, "games_weekly");

    const unsubDaily = onSnapshot(dailyRef, (snap) => {
      const dailyData = snap.docs.map((doc) => ({
        id: doc.id,
        type: "Daily Scrim",
        collectionType: "daily",
        ...doc.data(),
      }));
      setTournaments((prev) => {
        const filtered = prev.filter((g) => g.collectionType !== "daily");
        return [...filtered, ...dailyData];
      });
      setLoading(false);
    });

    const unsubWeekly = onSnapshot(weeklyRef, (snap) => {
      const weeklyData = snap.docs.map((doc) => ({
        id: doc.id,
        type: "Weekly War",
        collectionType: "weekly",
        ...doc.data(),
      }));
      setTournaments((prev) => {
        const filtered = prev.filter((g) => g.collectionType !== "weekly");
        return [...filtered, ...weeklyData];
      });
      setLoading(false);
    });

    return () => {
      unsubDaily();
      unsubWeekly();
    };
  }, []);

  const handleJoin = async (type, id, fee) => {
    const res = await fetch("/api/razorpay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: fee || 100 }),
    });

    const data = await res.json();

    const options = {
      key: data.key,
      amount: data.amount,
      currency: data.currency,
      name: "Tournament Payment",
      description: "Entry Fee",
      order_id: data.order_id,
      handler: function (response) {
        alert("✅ Payment Successful!");
        const normalizedType = type.toLowerCase().replace(/\s/g, "");
        navigate(`/join-tournament/${normalizedType}/${id}`);
      },
      prefill: {
        name: "Player",
        email: auth.currentUser?.email || "",
      },
      theme: { color: "#1e3a8a" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const toggleCard = (index) => {
    const card = document.getElementById(`card-${index}`);
    if (card) card.classList.toggle("active");
  };

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
            const isActive = statusMap[game.collectionType] === "active";

            return (
              <div key={game.id} className="cardContainer" onClick={() => toggleCard(index)}>
                <div className="card" id={`card-${index}`}>
                  <div className="side front">
                    <div className={`img img${(index % 3) + 1}`}></div>
                    <div className="info p-4">
                      <h2>{game.type}</h2>
                      <p>💰 Entry Fee: ₹{game.fee || 0}</p>
                      {!isActive && (
                        <p className="text-red-600 text-sm font-medium mt-1">❌ Not Active Yet</p>
                      )}
                    </div>
                  </div>
                  <div className="side back">
                    <div className="info">
                      <h2>{game.name || game.type}</h2>
                      <p className="mb-4 text-gray-800">
                        {game.description || "No description provided."}
                      </p>

                      <div className="btn-wrapper flex flex-col justify-center items-center mt-4 gap-2">
                        {!teamExists ? (
                          <>
                            <p className="text-sm text-red-600 font-medium">
                              ⚠️ Please add your team first.
                            </p>
                            <button
                              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded"
                              onClick={() => navigate("/add-team")}
                            >
                              Add Team
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleJoin(game.type, game.id, game.fee);
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
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 🔥 Popup Modal */}
      {showPopup && popupImage && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-4 max-w-xs w-full relative">
            <img src={popupImage} alt="Popup" className="w-full h-auto rounded" />
            <button
              onClick={() => setShowPopup(false)}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
