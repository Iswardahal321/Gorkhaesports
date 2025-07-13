import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";

const IDPass = () => {
  const [daily, setDaily] = useState(null);
  const [weekly, setWeekly] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [dailySnap, weeklySnap] = await Promise.all([
        getDoc(doc(db, "daily_idp", "current")),  // ✅ Fixed docId
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
    alert("✅ Copied: " + text);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-6 text-center">🎮 Room ID & Password</h2>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : !daily && !weekly ? (
        <p className="text-center text-yellow-600">⚠️ No active Room ID found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border">Match Type</th>
                <th className="p-3 border">Room ID</th>
                <th className="p-3 border">Password</th>
              </tr>
            </thead>
            <tbody>
              {daily && (
                <tr>
                  <td className="p-3 border font-semibold">Daily Scrim</td>
                  <td
                    className="p-3 border text-blue-700 cursor-pointer"
                    onClick={() => handleCopy(daily.roomId)}
                  >
                    {daily.roomId}
                  </td>
                  <td
                    className="p-3 border text-blue-700 cursor-pointer"
                    onClick={() => handleCopy(daily.password)}
                  >
                    {daily.password}
                  </td>
                </tr>
              )}
              {weekly && (
                <tr>
                  <td className="p-3 border font-semibold">Weekly War</td>
                  <td
                    className="p-3 border text-blue-700 cursor-pointer"
                    onClick={() => handleCopy(weekly.roomId)}
                  >
                    {weekly.roomId}
                  </td>
                  <td
                    className="p-3 border text-blue-700 cursor-pointer"
                    onClick={() => handleCopy(weekly.password)}
                  >
                    {weekly.password}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default IDPass;
