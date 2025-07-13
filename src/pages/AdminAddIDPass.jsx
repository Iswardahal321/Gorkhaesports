import React, { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase/config";

const AdminAddIDPass = () => {
  const [roomId, setRoomId] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("Weekly War");
  const [showTime, setShowTime] = useState("");
  const [activeDocId, setActiveDocId] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  // 🔁 Fetch latest active data on type change
  useEffect(() => {
    const fetchData = async () => {
      const q = query(
        collection(db, "id_pass"),
        where("type", "==", type),
        where("active", "==", true)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const docData = snapshot.docs[0];
        const data = docData.data();
        setRoomId(data.roomId);
        setPassword(data.password);
        setShowTime(
          data.showTime.toDate().toISOString().slice(0, 16) // format for datetime-local
        );
        setActiveDocId(docData.id);
        setIsActive(true);
      } else {
        setRoomId("");
        setPassword("");
        setShowTime("");
        setActiveDocId(null);
        setIsActive(false);
      }
    };

    fetchData();
  }, [type]);

  // ✅ Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roomId || !password || !showTime) {
      alert("❌ Fill all fields.");
      return;
    }

    try {
      setLoading(true);

      // 🔁 Deactivate old active of same type
      const q = query(
        collection(db, "id_pass"),
        where("type", "==", type),
        where("active", "==", true)
      );
      const snapshot = await getDocs(q);
      snapshot.forEach(async (d) => {
        await updateDoc(doc(db, "id_pass", d.id), { active: false });
      });

      // ➕ Add new doc
      const docRef = await addDoc(collection(db, "id_pass"), {
        roomId,
        password,
        type,
        showTime: Timestamp.fromDate(new Date(showTime)),
        active: true,
        createdAt: Timestamp.now(),
      });

      setSuccess("✅ ID & Password added & set active!");
      setTimeout(() => setSuccess(""), 3000);
      setActiveDocId(docRef.id);
      setIsActive(true);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to add.");
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Toggle activation
  const toggleActive = async () => {
    if (!activeDocId) return;
    try {
      await updateDoc(doc(db, "id_pass", activeDocId), {
        active: !isActive,
      });
      setIsActive(!isActive);
      setSuccess(`✅ ID ${!isActive ? "activated" : "deactivated"}!`);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update status.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">➕ Add Room ID & Password</h2>

      {/* 🟢 Toggle */}
      {activeDocId && (
        <div className="flex items-center justify-between mb-4">
          <span className="font-medium">Status: {isActive ? "✅ Active" : "⛔ Inactive"}</span>
          <button
            onClick={toggleActive}
            className={`px-3 py-1 rounded ${
              isActive ? "bg-red-600" : "bg-green-600"
            } text-white`}
          >
            {isActive ? "Deactivate" : "Activate"}
          </button>
        </div>
      )}

      {/* 📝 Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
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
