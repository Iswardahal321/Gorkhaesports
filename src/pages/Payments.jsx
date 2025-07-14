import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";

function Payments() {
  const [selectedType, setSelectedType] = useState("Daily Scrim");
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, "tournament_joins"),
          where("type", "==", selectedType)
        );
        const snap = await getDocs(q);
        const data = snap.docs.map((doc) => {
          const d = doc.data();
          return {
            id: doc.id,
            userId: d.userId || "N/A",
            email: d.email || "N/A",
            paymentId: d.paymentId || "N/A",
            fee: d.fee || 0,
            type: d.type || "N/A",
            joinedAt: d.joinedAt?.toDate().toLocaleString() || "N/A",
            tournamentId: d.tournamentId || "N/A",
          };
        });
        setPayments(data);
      } catch (err) {
        console.error("❌ Failed to fetch payments:", err);
      }
      setLoading(false);
    };

    fetchPayments();
  }, [selectedType]);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h2 className="text-3xl font-bold mb-6 text-center">💳 Payment Records</h2>

      <div className="mb-4 flex justify-center">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-4 py-2 rounded border border-gray-300"
        >
          <option value="Daily Scrim">Daily Scrim</option>
          <option value="Weekly War">Weekly War</option>
        </select>
      </div>

      {loading ? (
        <p className="text-center text-gray-600">⏳ Loading payment records...</p>
      ) : payments.length === 0 ? (
        <p className="text-center text-gray-500">No payment records found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-gray-200 text-sm">
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
              {payments.map((p) => (
                <tr key={p.id} className="text-center text-sm hover:bg-gray-50">
                  <td className="py-2 px-4 border">{p.userId}</td>
                  <td className="py-2 px-4 border">{p.email}</td>
                  <td className="py-2 px-4 border">{p.paymentId}</td>
                  <td className="py-2 px-4 border">₹{p.fee}</td>
                  <td className="py-2 px-4 border">{p.type}</td>
                  <td className="py-2 px-4 border">{p.tournamentId}</td>
                  <td className="py-2 px-4 border">{p.joinedAt}</td>
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
