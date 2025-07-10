// src/pages/AdminTeams.jsx
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

function AdminTeams() {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchTeams = async () => {
      const querySnapshot = await getDocs(collection(db, "teams"));
      const teamList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTeams(teamList);
    };

    fetchTeams();
  }, []);

  return (
    <div className="min-h-screen bg-white p-6">
      <h2 className="text-2xl font-semibold mb-4">All Registered Teams</h2>
      {teams.length === 0 ? (
        <p>No teams found.</p>
      ) : (
        <ul className="space-y-4">
          {teams.map((team) => (
            <li key={team.id} className="border p-4 rounded shadow">
              <h3 className="font-bold text-lg">{team.teamName}</h3>
              <p><strong>Leader:</strong> {team.leaderName}</p>
              <p><strong>Email:</strong> {team.leaderEmail}</p>
              <p><strong>Players:</strong> {team.players?.join(", ")}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AdminTeams;
