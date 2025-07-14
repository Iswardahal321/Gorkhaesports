import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/config";

function Payments() {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [selectedType, setSelectedType] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  useEffect(() => {
    filterPayments();
  }, [selectedType, payments]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const snap = await getDocs(collection(db, "tournament_joins"));
      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPayments(data);
    } catch (err) {
      console.error("❌ Failed to fetch payments:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterPayments = () => {
    if (selectedType === "All") {
      setFilteredPayments(payments);
    } else {
      setFilteredPayments(
        payments.filter((p) => p.type === selectedType)
      );
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this entry?");
    if (!confirm) return;
    try {
      await deleteDoc(doc(db, "tournament_joins", id));
      setPayments((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("❌ Delete failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold text-center mb-6">💰 Payment Details</h2>

      <div className="mb-4 flex flex-col sm:flex-row justify-between items-center">
        <label className="font-medium mb-2 sm:mb-0">Filter by Tournament:</label>
        <select
          className="p-2 border rounded w-64"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Daily Scrim">Daily Scrim</option>
          <option value="Weekly War">Weekly War</option>
        </select>
      </div>

      {loading ? (
        <p className="text-gray-600 animate-pulse text-center">⏳ Loading payment records...</p>
      ) : filteredPayments.length === 0 ? (
        <p className="text-gray-600 text-center">No payments found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-3">Team Name</th>
                <th className="p-3">User Email</th>
                <th className="p-3">Tournament</th>
                <th className="p-3">Fee</th>
                <th className="p-3">Date</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="p-3">{item.teamName || "N/A"}</td>
                  <td className="p-3">{item.userEmail || "N/A"}</td>
                  <td className="p-3">{item.type}</td>
                  <td className="p-3 text-green-700 font-semibold">₹{item.fee}</td>
                  <td className="p-3 text-sm text-gray-500">
                    {item.timestamp
                      ? new Date(item.timestamp.seconds * 1000).toLocaleString()
                      : "N/A"}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
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
  );
}

export default Payments;
