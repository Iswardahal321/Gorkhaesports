// 📁 src/pages/Payments.jsx
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("Daily Scrim");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const snapshot = await getDocs(collection(db, "tournament_joins"));
        const allPayments = snapshot.docs.map((doc) => doc.data());
        setPayments(allPayments);
      } catch (error) {
        console.error("❌ Error fetching payments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const filteredPayments = payments.filter(
    (p) => p?.type === selectedType
  );

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h2 className="text-3xl font-bold mb-6 text-center">💰 Payment Details</h2>

      <div className="mb-6 flex justify-center">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="border p-2 rounded shadow bg-white"
        >
          <option value="Daily Scrim">Daily Scrim</option>
          <option value="Weekly War">Weekly War</option>
        </select>
      </div>

      {loading ? (
        <p className="text-center text-gray-600">⏳ Loading payment details...</p>
      ) : filteredPayments.length === 0 ? (
        <p className="text-center text-gray-500">No payments found for this type.</p>
      ) : (
        <div className="overflow-x-auto">
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
                <tr
                  key={index}
                  className="border-b hover:bg-gray-50 transition-all"
                >
                  <td className="p-3">{payment?.userId ?? "N/A"}</td>
                  <td className="p-3">{payment?.email ?? "N/A"}</td>
                  <td className="p-3">{payment?.paymentId ?? "N/A"}</td>
                  <td className="p-3">₹{payment?.fee ?? "0"}</td>
                  <td className="p-3">{payment?.type ?? "Unknown"}</td>
                  <td className="p-3">{payment?.joinedAt ?? "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Payments;
