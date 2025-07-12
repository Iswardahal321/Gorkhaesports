import React, { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, getDocs, addDoc, Timestamp } from "firebase/firestore";

const AdminAddSlot = () => {
  const [slotNumber, setSlotNumber] = useState("");
  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔁 Fetch teams with name and uid
  useEffect(() => {
    const fetchTeams = async () => {
      const snap = await getDocs(collection(db, "teams"));
      const list = snap.docs.map((doc) => ({
        id: doc.id,
        teamName: doc.data().teamName,
        userId: doc.data().userId,
      }));
      setTeams(list);
    };
    fetchTeams();
  }, []);

  // ✅ Handle Submit
  const handleAddSlot = async (e) => {
    e.preventDefault();
    if (!slotNumber || !selectedTeamId) return alert("❌ Fill all fields");

    const team = teams.find((t) => t.id === selectedTeamId);
    if (!team) return alert("❌ Invalid team selected");

    try {
      setLoading(true);
      await addDoc(collection(db, "slots"), {
        teamName: team.teamName,
        userId: team.userId,
        slotNumber: parseInt(slotNumber),
        createdAt: Timestamp.now(),
      });
      setSlotNumber("");
      setSelectedTeamId("");
      setSuccess("✅ Slot assigned successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      alert("❌ Error assigning slot");
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
            value={selectedTeamId}
            onChange={(e) => setSelectedTeamId(e.target.value)}
          >
            <option value="">-- Select Team --</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.teamName}
              </option>
            ))}
          </select>
        </div>

        {/* ✅ Show UID below dropdown */}
        {selectedTeamId && (
          <div className="text-xs text-gray-600">
            UID:{" "}
            <span className="font-mono">
              {teams.find((t) => t.id === selectedTeamId)?.userId?.slice(0, 8)}...
            </span>
          </div>
        )}

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
          {loading ? "Adding..." : "Assign Slot"}
        </button>

        {success && <p className="text-green-600 mt-2">{success}</p>}
      </form>
    </div>
  );
};

export default AdminAddSlot;
