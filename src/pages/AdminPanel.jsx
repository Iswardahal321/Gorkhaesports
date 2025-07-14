import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/config";
import { useNavigate } from "react-router-dom";

function AdminPanel() {
  const navigate = useNavigate();

  const [userCount, setUserCount] = useState(0);
  const [dailyJoined, setDailyJoined] = useState(0);
  const [weeklyJoined, setWeeklyJoined] = useState(0);
  const [totalFees, setTotalFees] = useState(0);
  const [selectedType, setSelectedType] = useState("Weekly War");
  const [paymentData, setPaymentData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const usersSnap = await getDocs(collection(db, "users"));
      const teamsSnap = await getDocs(collection(db, "teams"));

      const createdUsers = new Set();
      let daily = 0;
      let weekly = 0;
      let fees = 0;

      teamsSnap.forEach((doc) => {
        const data = doc.data();

        if (data.createdBy) {
          createdUsers.add(data.createdBy);
        }

        if (data.gameType === "Daily Scrim") {
          daily++;
        } else if (data.gameType === "Weekly War") {
          weekly++;
        }

        if (data.registrationFee) {
          fees += Number(data.registrationFee);
        }
      });

      setUserCount(createdUsers.size);
      setDailyJoined(daily);
      setWeeklyJoined(weekly);
      setTotalFees(fees);
    };

    fetchData();
  }, []);

  const fetchPaymentData = async () => {
    const teamsSnap = await getDocs(collection(db, "teams"));
    const filtered = [];

    teamsSnap.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.gameType === selectedType) {
        filtered.push({ id: docSnap.id, ...data });
      }
    });

    setPaymentData(filtered);
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "teams", id));
    fetchPaymentData(); // refresh after delete
  };

  useEffect(() => {
    fetchPaymentData();
  }, [selectedType]);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h2 className="text-3xl font-bold mb-6 text-center">📊 Admin Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="text-lg font-semibold mb-1">👤 Registered Users</h3>
          <p className="text-2xl font-bold text-blue-600">{userCount}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="text-lg font-semibold mb-1">🎮 Daily Scrim Players</h3>
          <p className="text-2xl font-bold text-green-600">{dailyJoined}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="text-lg font-semibold mb-1">🔥 Weekly War Players</h3>
          <p className="text-2xl font-bold text-purple-600">{weeklyJoined}</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow text-center mb-8">
        <h3 className="text-lg font-semibold mb-2">💰 Total Fees Collected</h3>
        <p className="text-2xl font-bold text-red-600">₹{totalFees}</p>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">💳 Payment Details</h3>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="border p-2 rounded mt-2 sm:mt-0"
          >
            <option>Weekly War</option>
            <option>Daily Scrim</option>
          </select>
        </div>

        {paymentData.length === 0 ? (
          <p className="text-gray-500 text-center">No teams found for {selectedType}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2">Team Name</th>
                  <th className="border p-2">Game Type</th>
                  <th className="border p-2">Fee</th>
                  <th className="border p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {paymentData.map((team) => (
                  <tr key={team.id}>
                    <td className="border p-2">{team.teamName || "N/A"}</td>
                    <td className="border p-2">{team.gameType}</td>
                    <td className="border p-2">₹{team.registrationFee || 0}</td>
                    <td className="border p-2">
                      <button
                        onClick={() => handleDelete(team.id)}
                        className="text-white bg-red-600 px-3 py-1 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;
