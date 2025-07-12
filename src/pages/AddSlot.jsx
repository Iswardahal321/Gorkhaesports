import React, { useEffect, useState } from "react";
import { db } from "../firebase/config";
import {
  collection,
  getDocs,
  addDoc,
  Timestamp,
} from "firebase/firestore";

const AdminAddSlot = () => {
  const [scrimType, setScrimType] = useState(""); // daily or weekly
  const [paidUsers, setPaidUsers] = useState([]); // from tournament_joins
  const [teams, setTeams] = useState([]); // from teams
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [slotNumber, setSlotNumber] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  // ✅ Fetch paid users from tournament_joins
  useEffect(() => {
    const fetchPaidUsers = async () => {
      const snapshot = await getDocs(collection(db, "tournament_joins"));
      const filtered = snapshot.docs
        .map((doc) => doc.data())
        .filter((data) =>
          scrimType === "daily"
            ? data.type === "Daily Scrim"
            : data.type === "Weekly War"
        );
      setPaidUsers(filtered);
    };

    if (scrimType) {
      fetchPaidUsers();
    }
  }, [scrimType]);

  // ✅ Fetch teams (to map with userId)
  useEffect(() => {
    const fetchTeams = async () => {
      const snapshot = await getDocs(collection(db, "teams"));
      const data = snapshot.docs.map((doc) => ({
        ...doc.data(),
        teamName: doc.data().teamName.trim(),
      }));
      setTeams(data);
    };

    fetchTeams();
  }, []);

  // ✅ Auto-assign slot number
  useEffect(() => {
    const fetchNextSlotNumber = async () => {
      if (!scrimType) return;
      const collectionName = scrimType === "daily" ? "daily_slots" : "weekly_slots";
      const snap = await getDocs(collection(db, collectionName));
      const numbers = snap.docs.map((doc) => doc.data().slotNumber || 0);
      const max = numbers.length > 0 ? Math.max(...numbers) : 0;
      setSlotNumber(max + 1);
    };

    fetchNextSlotNumber();
  }, [scrimType]);

  const handleTeamSelect = (e) => {
    const uid = e.target.value;
    const joinUser = paidUsers.find((u) => u.userId === uid);
    const team = teams.find((t) => t.userId === uid);
    if (team) {
      setSelectedTeam({ teamName: team.teamName, userId: uid });
    } else {
      setSelectedTeam(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!scrimType || !selectedTeam || !slotNumber) {
      alert("❌ Please select scrim type and team.");
      return;
    }

    try {
      setLoading(true);
      const collectionName = scrimType === "daily" ? "daily_slots" : "weekly_slots";
      await addDoc(collection(db, collectionName), {
        teamName: selectedTeam.teamName,
        userId: selectedTeam.userId,
        slotNumber,
        createdAt: Timestamp.now(),
      });

      setSelectedTeam(null);
      setSuccess("✅ Slot assigned successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error adding slot:", err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow p-6 rounded">
      <h2 className="text-2xl font-bold mb-4">🎮 Assign Slot</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ✅ Scrim Type */}
        <div>
          <label className="block mb-1 font-medium">Select Scrim Type</label>
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

        {/* ✅ Team Dropdown */}
        {scrimType && (
          <div>
            <label className="block mb-1 font-medium">Select Team</label>
            <select
              onChange={handleTeamSelect}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">-- Select a Team --</option>
              {paidUsers.map((user, idx) => {
                const team = teams.find((t) => t.userId === user.userId);
                return (
                  team && (
                    <option key={idx} value={user.userId}>
                      {team.teamName}
                    </option>
                  )
                );
              })}
            </select>
          </div>
        )}

        {/* ✅ Show UID */}
        {selectedTeam?.userId && (
          <div className="text-sm text-gray-500">
            <strong>UID:</strong> {selectedTeam.userId}
          </div>
        )}

        {/* ✅ Auto Assigned Slot Number */}
        {scrimType && (
          <div>
            <label className="block mb-1 font-medium">Slot Number (Auto)</label>
            <input
              type="number"
              className="w-full border p-2 rounded bg-gray-100"
              value={slotNumber}
              readOnly
            />
          </div>
        )}

        {/* ✅ Submit */}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        >
          {loading ? "Assigning..." : "Assign Slot"}
        </button>

        {success && <p className="text-green-600 mt-2">{success}</p>}
      </form>
    </div>
  );
};

export default AdminAddSlot;
