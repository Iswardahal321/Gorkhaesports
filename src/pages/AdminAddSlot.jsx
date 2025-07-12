import React, { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, getDocs, addDoc, Timestamp } from "firebase/firestore";

const AdminAddSlot = () => {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [slotNumber, setSlotNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchTeams = async () => {
      const snap = await getDocs(collection(db, "teams"));
      const list = snap.docs.map((doc) => ({
        id: doc.id,
        teamName: doc.data().teamName,
        userId: doc.data().userId, // ✅ Correct field name
      }));
      setTeams(list);
    };

    fetchTeams();
  }, []);

  const handleAddSlot = async (e) => {
    e.preventDefault();
    if (!selectedTeam || !slotNumber) {
      alert("❌ Please select a team and slot number.");
      return;
    }

    try {
      setLoading(true);
      await addDoc(collection(db, "slots"), {
        slotNumber: parseInt(slotNumber),
        teamName: selectedTeam.teamName,
        userId: selectedTeam.userId, // ✅ Correct field used
        createdAt: Timestamp.now(),
      });

      setSlotNumber("");
      setSelectedTeam(null);
      setSuccess("✅ Slot added successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Error adding slot:", error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow p-6 rounded">
      <h2 className="text-2xl font-bold mb-4">➕ Assign Slot to Team</h2>

      <form onSubmit={handleAddSlot} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Select Team</label>
          <select
            className="w-full border p-2 rounded"
            value={selectedTeam?.id || ""}
            onChange={(e) => {
              const team = teams.find((t) => t.id === e.target.value);
              setSelectedTeam(team || null);
            }}
          >
            <option value="">-- Select Team --</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.teamName}
              </option>
            ))}
          </select>
        </div>

        {selectedTeam && (
          <p className="text-sm text-gray-600">
            <strong>Team User ID:</strong> {selectedTeam.userId}
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
          {loading ? "Adding..." : "Add Slot"}
        </button>

        {success && <p className="text-green-600 mt-2">{success}</p>}
      </form>
    </div>
  );
};

export default AdminAddSlot;
