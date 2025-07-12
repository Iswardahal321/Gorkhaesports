import React, { useEffect, useState } from "react";
import { db } from "../firebase/config";
import {
  collection,
  addDoc,
  getDocs,
  Timestamp,
} from "firebase/firestore";

const AdminAddSlot = () => {
  const [scrimType, setScrimType] = useState(""); // daily or weekly
  const [teams, setTeams] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [slotNumber, setSlotNumber] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  // 🔁 Fetch teams based on scrimType
  useEffect(() => {
    const fetchEligibleTeams = async () => {
      if (!scrimType) return;

      const collectionName =
        scrimType === "daily" ? "games_daily" : "games_weekly";

      try {
        const gameSnap = await getDocs(collection(db, collectionName));
        const userIdSet = new Set();

        gameSnap.forEach((doc) => {
          const data = doc.data();
          if (data.userId) userIdSet.add(data.userId);
        });

        const allUserIds = Array.from(userIdSet);
        const teamsSnap = await getDocs(collection(db, "teams"));

        const matchedTeams = [];

        teamsSnap.forEach((doc) => {
          const data = doc.data();
          if (allUserIds.includes(data.userId)) {
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
        console.error("❌ Error fetching teams:", err);
      }
    };

    fetchEligibleTeams();
  }, [scrimType]);

  // 🔘 Team select logic
  const handleTeamSelect = (e) => {
    const selectedName = e.target.value;
    setTeamName(selectedName);
    const found = teams.find((t) => t.teamName.trim() === selectedName.trim());
    setUserId(found?.userId || "");
  };

  // ✅ Save to correct slot collection
  const handleAddSlot = async (e) => {
    e.preventDefault();
    if (!teamName || !slotNumber || !userId || !scrimType) {
      alert("❌ Fill all fields");
      return;
    }

    const saveCollection =
      scrimType === "daily" ? "daily_slots" : "weekly_slots";

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

        {/* 🧠 Team Dropdown */}
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

        {/* 👁️ Show UID */}
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

        {/* ✅ Submit */}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Assigning..." : "Assign Slot"}
        </button>

        {/* ✅ Success Msg */}
        {success && <p className="text-green-600 mt-2">{success}</p>}
      </form>
    </div>
  );
};

export default AdminAddSlot;
