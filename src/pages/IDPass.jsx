import React, { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";

const IDPass = () => {
  const [daily, setDaily] = useState(null);
  const [weekly, setWeekly] = useState(null);
  const [copyMessage, setCopyMessage] = useState("");

  useEffect(() => {
    const unsubDaily = onSnapshot(doc(db, "daily_idp", "current"), (snap) => {
      if (snap.exists() && snap.data().status === "active") {
        setDaily(snap.data());
      } else {
        setDaily(null);
      }
    });

    const unsubWeekly = onSnapshot(doc(db, "weekly_idp", "current"), (snap) => {
      if (snap.exists() && snap.data().status === "active") {
        setWeekly(snap.data());
      } else {
        setWeekly(null);
      }
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

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded text-center">
      <h2 className="text-2xl font-bold mb-4">🎮 Room ID & Password</h2>

      {copyMessage && (
        <p className="text-green-600 font-medium mb-4">{copyMessage}</p>
      )}

      {!daily && !weekly ? (
        <p className="text-yellow-600">⚠️ No active Room ID found.</p>
      ) : (
        <div className="space-y-8">
          {daily && (
            <>
              <h3 className="text-lg font-semibold text-blue-700">📅 Daily Scrim</h3>
              <table className="w-full border-collapse border border-gray-300 mx-auto">
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
                      onClick={() => handleCopy(daily.roomId)}
                    >
                      {daily.roomId}
                    </td>
                    <td
                      className="p-2 border text-blue-700 cursor-pointer"
                      onClick={() => handleCopy(daily.password)}
                    >
                      {daily.password}
                    </td>
                  </tr>
                </tbody>
              </table>
            </>
          )}

          {weekly && (
            <>
              <h3 className="text-lg font-semibold text-purple-700">🛡️ Weekly War</h3>
              <table className="w-full border-collapse border border-gray-300 mx-auto">
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
                      onClick={() => handleCopy(weekly.roomId)}
                    >
                      {weekly.roomId}
                    </td>
                    <td
                      className="p-2 border text-blue-700 cursor-pointer"
                      onClick={() => handleCopy(weekly.password)}
                    >
                      {weekly.password}
                    </td>
                  </tr>
                </tbody>
              </table>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default IDPass;
