import React, { useEffect, useState } from "react";
import { db } from "../firebase/config";
import {
  collection,
  addDoc,
  getDocs,
  Timestamp,
  query,
  where,
} from "firebase/firestore";

const AdminAddSlot = () => {
  const [scrimType, setScrimType] = useState("");
  const [teams, setTeams] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [slotNumber, setSlotNumber] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchTeams = async () => {
      if (!scrimType) return;

      try {
        // 1️⃣ Get all tournament_joins for selected type
        const joinsQuery = query(
          collection(db, "tournament_joins"),
          where("type", "==", scrimType === "daily" ? "Daily Scrim" : "Weekly War")
        );
        const joinSnap = await getDocs(joinsQuery);

        const paidUserIds = joinSnap.docs.map((doc) => doc.data().userId);

        // 2️⃣ Fetch matching teams by userId
        const teamSnap = await getDocs(collection(db, "teams"));
        const matchedTeams = [];

        teamSnap.forEach((doc) => {
          const data = doc.data();
          if (paidUserIds.includes(data.userId)) {
            matchedTeams.push({
              teamName: data.teamName,
              userId: data.userId,
            });
          }
        });

        setTeams(matchedTeams);
        setTeamName("");
        setUserId("");
      } catch (err) {
        console.error("❌ Error fetching paid teams:", err);
      }
    };

    fetchTeams();
  }, [scrimType]);

  const handleTeamSelect = (e) => {
    const selected = e.target.value;
    setTeamName(selected);
    const found = teams.find((t) => t.teamName.trim() === selected.trim());
    setUserId(found?.userId || "");
  };

  const handleAddSlot = async (e) => {
    e.preventDefault();

    if (!teamName || !slotNumber || !userId || !scrimType) {
      alert("❌ Please fill all fields properly.");
      return;
    }

    const saveCollection = scrimType === "daily" ? "daily_slots" : "weekly_slots";

    try {
      setLoading(true);
      await addDoc(collection(db, saveCollection), {
        teamName: teamName.trim(),
        slotNumber: parseInt(slotNumber),
        userId,
        createdAt: Timestamp.now(),
      });

      setTeamName("");
      setSlotNumber("");
      setUserId("");
      setSuccess("✅ Slot assigned successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("❌ Error adding slot:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow p-6 rounded">
      <h2 className="text-2xl font-bold mb-4">➕ Assign Slot</h2>

      <form onSubmit={handleAddSlot} className="space-y-4">

        {/* 🔽 Scrim Type Selector */}
        <div>
          <label className="block mb-1 font-medium">Scrim Type</label>
          <select
            value={scrimType}
            onChange={(e) => setScrimType(e.target.value)}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">-- Select Type --</option>
            <option value="daily">Daily Scrim</option>
            <option value="weekly">Weekly War</option>
          </select>
        </div>

        {/* 🔽 Team Selector */}
        <div>
          <label className="block mb-1 font-medium">Select Team</label>
          <select
            value={teamName}
            onChange={handleTeamSelect}
            className="w-full border p-2 rounded"
            required
            disabled={!scrimType}
          >
            <option value="">-- Select a Team --</option>
            {teams.map((team, idx) => (
              <option key={idx} value={team.teamName}>
                {team.teamName}
              </option>
            ))}
          </select>
        </div>

        {/* 🧾 UID Display */}
        {userId && (
          <p className="text-sm text-gray-600">
            <strong>UID:</strong> {userId}
          </p>
        )}

        {/* 🔢 Slot Number */}
        <div>
          <label className="block mb-1 font-medium">Slot Number</label>
          <input
            type="number"
            className="w-full border p-2 rounded"
            value={slotNumber}
            onChange={(e) => setSlotNumber(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Assigning..." : "Assign Slot"}
        </button>

        {success && <p className="text-green-600 mt-2">{success}</p>}
      </form>
    </div>
  );
};

export default AdminAddSlot;
