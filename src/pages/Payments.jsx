import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase/config";

function Payments() {
  const [selectedType, setSelectedType] = useState("daily_scrim");
  const [paymentData, setPaymentData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, "tournament_joins"),
        where("type", "==", selectedType)
      );
      const snap = await getDocs(q);
      const payments = snap.docs.map((doc) => {
        const data = doc.data();
        return {
          userId: data.userId || "N/A",
          email: data.email || "N/A",
          paymentId: data.paymentId || "N/A",
          fee: data.fee || "0",
          type: data.type || "unknown",
          tournamentId: data.tournamentId || "N/A",
          joinedAt: data.joinedAt?.toDate().toLocaleString() || "N/A",
        };
      });
      setPaymentData(payments);
    } catch (error) {
      console.error("❌ Failed to fetch payment data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [selectedType]);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h2 className="text-3xl font-bold mb-6 text-center">💳 Payment Details</h2>

      <div className="mb-4">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-4 py-2 rounded border border-gray-300"
        >
          <option value="daily_scrim">Daily Scrim</option>
          <option value="weekly_war">Weekly War</option>
        </select>
      </div>

      {loading ? (
        <p className="text-gray-600 animate-pulse">⏳ Loading payment data...</p>
      ) : paymentData.length === 0 ? (
        <p className="text-gray-500">No payment records found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4 border">User ID</th>
                <th className="py-2 px-4 border">Email</th>
                <th className="py-2 px-4 border">Payment ID</th>
                <th className="py-2 px-4 border">Fee</th>
                <th className="py-2 px-4 border">Type</th>
                <th className="py-2 px-4 border">Tournament ID</th>
                <th className="py-2 px-4 border">Joined At</th>
              </tr>
            </thead>
            <tbody>
              {paymentData.map((data, index) => (
                <tr key={index} className="text-center">
                  <td className="py-2 px-4 border">{data.userId}</td>
                  <td className="py-2 px-4 border">{data.email}</td>
                  <td className="py-2 px-4 border">{data.paymentId}</td>
                  <td className="py-2 px-4 border">₹{data.fee}</td>
                  <td className="py-2 px-4 border">{data.type}</td>
                  <td className="py-2 px-4 border">{data.tournamentId}</td>
                  <td className="py-2 px-4 border">{data.joinedAt}</td>
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
