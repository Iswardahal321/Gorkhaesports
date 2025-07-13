import React, { useState, useEffect } from "react";
import {
  addDoc,
  collection,
  Timestamp,
  query,
  where,
  orderBy,
  limit,
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

  // ✅ Fetch latest roomId/password on type change
  useEffect(() => {
    const q = query(
      collection(db, "id_pass"),
      where("type", "==", type),
      orderBy("createdAt", "desc"),
      limit(1)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
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
    });

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
      await addDoc(collection(db, "id_pass"), {
        roomId,
        password,
        type,
        showTime: Timestamp.fromDate(new Date(showTime)),
        createdAt: Timestamp.now(),
      });
      setSuccess("✅ ID & Password added!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to add.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">➕ Add Room ID & Password</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ✅ Match Type at the top */}
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
          {loading ? "Adding..." : "Add ID & Password"}
        </button>

        {success && <p className="text-green-600 mt-2">{success}</p>}
      </form>
    </div>
  );
};

export default AdminAddIDPass;
