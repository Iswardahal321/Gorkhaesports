import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [filter, setFilter] = useState("Weekly War");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "tournament_joins"));
        const paymentData = querySnapshot.docs.map((doc) => doc.data());
        setPayments(paymentData);
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    };

    fetchPayments();
  }, []);

  const filteredPayments = payments.filter((p) => p?.type === filter);

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold mb-4">Payment Details</h2>

      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="border p-2 rounded mb-4"
      >
        <option value="Weekly War">Weekly War</option>
        <option value="Daily War">Daily War</option>
        <option value="Daily IDP">Daily IDP</option>
        <option value="Weekly IDP">Weekly IDP</option>
      </select>

      <div className="overflow-auto">
        <table className="min-w-full border text-sm bg-white">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">User ID</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Payment ID</th>
              <th className="p-2 border">Fee</th>
              <th className="p-2 border">Type</th>
              <th className="p-2 border">Joined At</th>
              <th className="p-2 border">Tournament ID</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.length > 0 ? (
              filteredPayments.map((p, i) => (
                <tr key={i} className="text-center">
                  <td className="p-2 border">{p?.userId || "N/A"}</td>
                  <td className="p-2 border">{p?.email || "N/A"}</td>
                  <td className="p-2 border">{p?.paymentId || "N/A"}</td>
                  <td className="p-2 border">₹{p?.fee || "0"}</td>
                  <td className="p-2 border">{p?.type || "N/A"}</td>
                  <td className="p-2 border">{p?.joinedAt || "N/A"}</td>
                  <td className="p-2 border">{p?.tournamentId || "N/A"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">
                  No payments found for selected type.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payments;
