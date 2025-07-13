import React, { useState, useEffect } from "react";
import {
  doc,
  setDoc,
  getDoc,
  Timestamp,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase/config";

const AdminAddIDPass = () => {
  const [roomId, setRoomId] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("Weekly War");
  const [showTime, setShowTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const collectionMap = {
    "Weekly War": "weekly_idp",
    "Daily Scrim": "daily_idp",
  };

  const docId = "current"; // Always update/fetch this doc

  // ✅ Fetch existing values on type change
  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, collectionMap[type], docId),
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setRoomId(data.roomId || "");
          setPassword(data.password || "");
          setShowTime(
            data.showTime
              ? data.showTime.toDate().toISOString().slice(0, 16)
              : ""
          );
        } else {
          setRoomId("");
          setPassword("");
          setShowTime("");
        }
      }
    );
    return () => unsubscribe();
  }, [type]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roomId || !password || !showTime) {
      alert("❌ Fill all fields.");
      return;
    }

    try {
      setLoading(true);

      await setDoc(doc(db, collectionMap[type], docId), {
        roomId,
        password,
        type,
        showTime: Timestamp.fromDate(new Date(showTime)),
        updatedAt: Timestamp.now(),
        status: "inactive", // ✅ Default status
      });

      setSuccess("✅ ID & Password saved!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to save.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">➕ Add/Update ID & Password</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ✅ Type First */}
        <div>
          <label className="block mb-1">Match Type</label>
          <select
            className="w-full border p-2 rounded"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="Daily Scrim">Daily Scrim</option>
            <option value="Weekly War">Weekly War</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Room ID</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1">Password</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1">Show Time</label>
          <input
            type="datetime-local"
            className="w-full border p-2 rounded"
            value={showTime}
            onChange={(e) => setShowTime(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>

        {success && <p className="text-green-600 mt-2">{success}</p>}
      </form>
    </div>
  );
};

export default AdminAddIDPass;
