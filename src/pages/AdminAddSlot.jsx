import React, { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, addDoc, getDocs, Timestamp } from "firebase/firestore";

const AdminAddSlot = () => {
  const [teams, setTeams] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [slotNumber, setSlotNumber] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchTeams = async () => {
      const snapshot = await getDocs(collection(db, "teams"));
      const data = snapshot.docs.map((doc) => ({
        teamName: doc.data().teamName,
        userId: doc.data().userId,
      }));
      setTeams(data);
    };
    fetchTeams();
  }, []);

  const handleTeamSelect = (e) => {
    const name = e.target.value;
    setTeamName(name);
    const team = teams.find((t) => t.teamName.trim() === name.trim());
    setUserId(team?.userId || "");
  };

  const handleAddSlot = async (e) => {
    e.preventDefault();

    if (!teamName || !slotNumber || !userId) {
      alert("❌ Please fill all fields properly.");
      return;
    }

    try {
      setLoading(true);
      await addDoc(collection(db, "slots"), {
        teamName: teamName.trim(),
        slotNumber: parseInt(slotNumber),
        userId,
        createdAt: Timestamp.now(),
      });

      setTeamName("");
      setSlotNumber("");
      setUserId("");
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
      <h2 className="text-2xl font-bold mb-4">➕ Add Slot</h2>

      <form onSubmit={handleAddSlot} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Select Team</label>
          <select
            value={teamName}
            onChange={handleTeamSelect}
            className="w-full border border-gray-300 p-2 rounded"
            required
          >
            <option value="">-- Select a Team --</option>
            {teams.map((team, idx) => (
              <option key={idx} value={team.teamName}>
                {team.teamName}
              </option>
            ))}
          </select>
        </div>

        {userId && (
          <div className="text-sm text-gray-500">
            <strong>UID:</strong> {userId}
          </div>
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
