import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Weekly War");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const snap = await getDocs(collection(db, "tournament_joins"));
        const data = snap.docs.map((doc) => doc.data());
        setPayments(data);
      } catch (error) {
        console.error("Error fetching payments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const filteredPayments = payments.filter((p) => p?.type === filter);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">💳 Payment Details</h2>

      {/* Filter Dropdown */}
      <div className="mb-4 flex justify-center">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 border rounded bg-white"
        >
          <option value="Weekly War">Weekly War</option>
          <option value="Daily Scrim">Daily Scrim</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <p className="text-center text-gray-600">🔄 Loading payments...</p>
        ) : filteredPayments.length > 0 ? (
          <table className="w-full bg-white rounded shadow text-sm">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-3 text-left">User ID</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Payment ID</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Joined At</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-3">{payment?.userId || "N/A"}</td>
                  <td className="p-3">{payment?.email || "N/A"}</td>
                  <td className="p-3">{payment?.paymentId || "N/A"}</td>
                  <td className="p-3">₹{payment?.fee || "0"}</td>
                  <td className="p-3">{payment?.type || "Unknown"}</td>
                  <td className="p-3">{payment?.joinedAt || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500">No payments found for this type.</p>
        )}
      </div>
    </div>
  );
}

export default Payments;
