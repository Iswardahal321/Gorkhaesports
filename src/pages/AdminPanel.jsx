import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/config";
import { useNavigate } from "react-router-dom";

function AdminPanel() {
  const navigate = useNavigate();

  const [teamUsers, setTeamUsers] = useState(new Set());
  const [totalFees, setTotalFees] = useState(0);
  const [dailyFees, setDailyFees] = useState(0);
  const [weeklyFees, setWeeklyFees] = useState(0);
  const [joinedPlayers, setJoinedPlayers] = useState(0);
  const [paymentData, setPaymentData] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      const teamSnap = await getDocs(collection(db, "teams"));
      const usersSet = new Set();
      let total = 0;
      let daily = 0;
      let weekly = 0;
      let joined = 0;
      const payments = [];

      teamSnap.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.userId) usersSet.add(data.userId);
        if (data.registrationFee && data.paymentStatus === "paid") {
          joined += 1;
          total += Number(data.registrationFee);
          if (data.tournamentType === "Daily Scrim") {
            daily += Number(data.registrationFee);
          } else if (data.tournamentType === "Weekly War") {
            weekly += Number(data.registrationFee);
          }

          payments.push({
            id: docSnap.id,
            userId: data.userId,
            tournamentType: data.tournamentType,
            teamName: data.teamName,
            registrationFee: data.registrationFee,
          });
        }
      });

      setTeamUsers(usersSet);
      setTotalFees(total);
      setDailyFees(daily);
      setWeeklyFees(weekly);
      setJoinedPlayers(joined);
      setPaymentData(payments);
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      await deleteDoc(doc(db, "teams", id));
      setPaymentData((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const filteredPayments = filter === "All"
    ? paymentData
    : paymentData.filter((item) => item.tournamentType === filter);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h2 className="text-3xl font-bold mb-6 text-center">📊 Admin Dashboard</h2>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="text-lg font-semibold mb-1">👤 Registered Users</h3>
          <p className="text-2xl font-bold text-blue-600">{teamUsers.size}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="text-lg font-semibold mb-1">🎮 Joined Players</h3>
          <p className="text-xl font-bold text-green-600">
            🟡 Daily: {paymentData.filter((p) => p.tournamentType === "Daily Scrim").length}
          </p>
          <p className="text-xl font-bold text-purple-600">
            🔵 Weekly: {paymentData.filter((p) => p.tournamentType === "Weekly War").length}
          </p>
          <p className="text-sm text-gray-600 mt-1">Total: {joinedPlayers}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="text-lg font-semibold mb-1">💸 Total Fees Collected</h3>
          <p className="text-xl font-bold text-red-600">
            🟡 Daily: ₹{dailyFees}
          </p>
          <p className="text-xl font-bold text-purple-600">
            🔵 Weekly: ₹{weeklyFees}
          </p>
          <p className="text-sm text-gray-600 mt-1">Total: ₹{totalFees}</p>
        </div>
      </div>

      {/* Filter & Payment Table */}
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">💳 Payment Details</h3>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="mb-4 p-2 rounded border border-gray-400"
        >
          <option value="All">All</option>
          <option value="Daily Scrim">Daily Scrim</option>
          <option value="Weekly War">Weekly War</option>
        </select>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4 border">Team Name</th>
                <th className="py-2 px-4 border">User ID</th>
                <th className="py-2 px-4 border">Type</th>
                <th className="py-2 px-4 border">Fee</th>
                <th className="py-2 px-4 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((item) => (
                <tr key={item.id}>
                  <td className="py-2 px-4 border">{item.teamName || "N/A"}</td>
                  <td className="py-2 px-4 border">{item.userId}</td>
                  <td className="py-2 px-4 border">{item.tournamentType}</td>
                  <td className="py-2 px-4 border">₹{item.registrationFee}</td>
                  <td className="py-2 px-4 border">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredPayments.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    No payment records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
