import React, { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";

const IDPass = () => {
  const [daily, setDaily] = useState(null);
  const [weekly, setWeekly] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copyMessage, setCopyMessage] = useState("");
  const [now, setNow] = useState(Date.now());

  // 🕒 Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // 🔄 Live Fetch via onSnapshot
  useEffect(() => {
    setLoading(true);
    const unsubDaily = onSnapshot(doc(db, "daily_idp", "current"), (snap) => {
      if (snap.exists() && snap.data().status === "active") {
        setDaily(snap.data());
      } else {
        setDaily(null);
      }
      setLoading(false);
    });

    const unsubWeekly = onSnapshot(doc(db, "weekly_idp", "current"), (snap) => {
      if (snap.exists() && snap.data().status === "active") {
        setWeekly(snap.data());
      } else {
        setWeekly(null);
      }
      setLoading(false);
    });

    return () => {
      unsubDaily();
      unsubWeekly();
    };
  }, []);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopyMessage(`✅ Copied: ${text}`);
    setTimeout(() => setCopyMessage(""), 3000);
  };

  // ⏱️ Format countdown
  const formatCountdown = (time) => {
    const diff = Math.floor((time - now) / 1000);
    if (diff <= 0) return null;
    const mins = Math.floor(diff / 60);
    const secs = diff % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // ✅ Render logic
  const renderSection = (title, data) => {
    const showTime = data?.showTime?.toDate?.().getTime?.();
    const countdown = showTime ? formatCountdown(showTime) : null;

    return (
      <div>
        <h3 className="text-lg font-semibold text-blue-700 mb-2">{title}</h3>
        {countdown ? (
          <p className="text-orange-600 font-medium mb-3">
            ⏳ Unlocking in: {countdown}
          </p>
        ) : (
          <table className="w-full border-collapse border border-gray-300 mx-auto mb-6">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Room ID</th>
                <th className="p-2 border">Password</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-50">
                <td
                  className="p-2 border text-blue-700 cursor-pointer"
                  onClick={() => handleCopy(data.roomId)}
                >
                  {data.roomId}
                </td>
                <td
                  className="p-2 border text-blue-700 cursor-pointer"
                  onClick={() => handleCopy(data.password)}
                >
                  {data.password}
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded text-center">
      <h2 className="text-2xl font-bold mb-4">🎮 Room ID & Password</h2>

      {copyMessage && (
        <p className="text-green-600 font-medium mb-4">{copyMessage}</p>
      )}

      {loading ? (
        <p className="text-blue-600 font-medium animate-pulse">
          🔄 Fetching IDP...
        </p>
      ) : !daily && !weekly ? (
        <p className="text-yellow-600">⚠️ No active Room ID found.</p>
      ) : (
        <div className="space-y-8">
          {daily && renderSection("📅 Daily Scrim", daily)}
          {weekly && renderSection("🛡️ Weekly War", weekly)}
        </div>
      )}
    </div>
  );
};

export default IDPass;
