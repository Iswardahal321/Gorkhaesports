import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";

const AdminAddSlot = () => {
  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [selectedTeamName, setSelectedTeamName] = useState("");
  const [slotNumber, setSlotNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // 🔄 Fetch all teams on mount
  useEffect(() => {
    const fetchTeams = async () => {
      const snap = await getDocs(collection(db, "teams"));
      const teamList = snap.docs.map((doc) => ({
        id: doc.id,
        teamName: doc.data().teamName,
        userId: doc.data().userId || doc.id, // fallback to doc id
      }));
      setTeams(teamList);
    };

    fetchTeams();
  }, []);

  const handleAddSlot = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    if (!selectedTeamId || !selectedTeamName || !slotNumber) {
      setError("❌ Please fill all fields.");
      return;
    }

    try {
      setLoading(true);

      await addDoc(collection(db, "slots"), {
        teamName: selectedTeamName,
        slotNumber: parseInt(slotNumber),
        userId: selectedTeamId,
        createdAt: Timestamp.now(),
      });

      setSuccess("✅ Slot added successfully!");
      setSlotNumber("");
      setSelectedTeamId("");
      setSelectedTeamName("");
      setTimeout(() => setSuccess(""), 4000);
    } catch (error) {
      console.error("Error adding slot:", error);
      setError("❌ Failed to add slot.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow p-6 rounded">
      <h2 className="text-2xl font-bold mb-4">🎯 Assign Slot</h2>

      <form onSubmit={handleAddSlot} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Select Team</label>
          <select
            value={selectedTeamId}
            onChange={(e) => {
              const id = e.target.value;
              const team = teams.find((t) => t.id === id);
              setSelectedTeamId(id);
              setSelectedTeamName(team?.teamName || "");
            }}
            className="w-full border border-gray-300 p-2 rounded"
            required
          >
            <option value="">-- Select Team --</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.teamName}
              </option>
            ))}
          </select>
        </div>

        {selectedTeamId && (
          <p className="text-sm text-gray-600">
            🆔 UID:{" "}
            <code className="bg-gray-100 px-2 py-1 rounded text-xs">
              {selectedTeamId}
            </code>
          </p>
        )}

        <div>
          <label className="block mb-1 font-medium">Slot Number</label>
          <input
            type="number"
            className="w-full border border-gray-300 p-2 rounded"
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

        {success && <p className="text-green-600">{success}</p>}
        {error && <p className="text-red-600">{error}</p>}
      </form>
    </div>
  );
};

export default AdminAddSlot;
