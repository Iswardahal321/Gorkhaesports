import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";

const IDPass = () => {
  const [daily, setDaily] = useState(null);
  const [weekly, setWeekly] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copyMessage, setCopyMessage] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [dailySnap, weeklySnap] = await Promise.all([
        getDoc(doc(db, "daily_idp", "current")),
        getDoc(doc(db, "weekly_idp", "current")),
      ]);

      if (dailySnap.exists() && dailySnap.data().status === "active") {
        setDaily(dailySnap.data());
      }

      if (weeklySnap.exists() && weeklySnap.data().status === "active") {
        setWeekly(weeklySnap.data());
      }
    } catch (error) {
      console.error("❌ Error fetching IDP data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopyMessage(`✅ Copied: ${text}`);
    setTimeout(() => setCopyMessage(""), 3000);
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4 text-center">🎮 Room ID & Password</h2>

      {copyMessage && (
        <p className="text-green-600 font-medium text-center mb-4">{copyMessage}</p>
      )}

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : !daily && !weekly ? (
        <p className="text-center text-yellow-600">⚠️ No active Room ID found.</p>
      ) : (
        <div className="space-y-8">
          {/* ✅ Daily Scrim Section */}
          {daily && (
            <div className="bg-gray-50 p-4 rounded border">
              <h3 className="text-lg font-semibold mb-3 text-blue-700">📅 Daily Scrim</h3>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Room ID:</span>
                <span
                  className="text-blue-700 cursor-pointer"
                  onClick={() => handleCopy(daily.roomId)}
                >
                  {daily.roomId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Password:</span>
                <span
                  className="text-blue-700 cursor-pointer"
                  onClick={() => handleCopy(daily.password)}
                >
                  {daily.password}
                </span>
              </div>
            </div>
          )}

          {/* ✅ Weekly War Section */}
          {weekly && (
            <div className="bg-gray-50 p-4 rounded border">
              <h3 className="text-lg font-semibold mb-3 text-purple-700">🛡️ Weekly War</h3>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Room ID:</span>
                <span
                  className="text-blue-700 cursor-pointer"
                  onClick={() => handleCopy(weekly.roomId)}
                >
                  {weekly.roomId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Password:</span>
                <span
                  className="text-blue-700 cursor-pointer"
                  onClick={() => handleCopy(weekly.password)}
                >
                  {weekly.password}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default IDPass;
