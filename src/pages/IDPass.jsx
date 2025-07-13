// 📁 src/pages/IDPass.jsx

import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";

const IDPass = () => {
  const [type, setType] = useState("Weekly War");
  const [roomId, setRoomId] = useState("");
  const [password, setPassword] = useState("");
  const [showTime, setShowTime] = useState("");
  const [status, setStatus] = useState("inactive");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const collectionName = type === "Daily Scrim" ? "daily_idp" : "weekly_idp";
      const docRef = doc(db, collectionName, "idpass");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setRoomId(data.roomId);
        setPassword(data.password);
        setShowTime(
          data.showTime?.toDate()?.toLocaleString() || "Not set"
        );
        setStatus(data.status || "inactive");
      } else {
        setRoomId("");
        setPassword("");
        setShowTime("");
        setStatus("inactive");
      }
    } catch (error) {
      console.error("❌ Error fetching ID Pass:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [type]);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4 text-center">🎮 Room ID & Password</h2>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Match Type</label>
        <select
          className="w-full border p-2 rounded"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="Daily Scrim">Daily Scrim</option>
          <option value="Weekly War">Weekly War</option>
        </select>
      </div>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : status === "active" ? (
        <>
          <div className="mb-3">
            <label className="block font-medium">🆔 Room ID</label>
            <input
              type="text"
              readOnly
              value={roomId}
              className="w-full border p-2 rounded bg-gray-100"
            />
          </div>
          <div className="mb-3">
            <label className="block font-medium">🔐 Password</label>
            <input
              type="text"
              readOnly
              value={password}
              className="w-full border p-2 rounded bg-gray-100"
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            🕒 Match Time: <strong>{showTime}</strong>
          </p>
        </>
      ) : (
        <p className="text-center text-yellow-600 font-semibold">
          ⚠️ ID & Password inactive or not available.
        </p>
      )}
    </div>
  );
};

export default IDPass;
