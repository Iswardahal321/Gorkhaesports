import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase/config";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [selectedType, setSelectedType] = useState("daily_scrim");
  const [loading, setLoading] = useState(true);

  const fetchPayments = async (type) => {
    setLoading(true);
    try {
      const q = query(collection(db, "teams"), where("type", "==", type));
      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPayments(data);
    } catch (error) {
      console.error("❌ Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this payment record?")) {
      try {
        await deleteDoc(doc(db, "teams", id));
        setPayments((prev) => prev.filter((p) => p.id !== id));
      } catch (err) {
        console.error("❌ Error deleting:", err);
      }
    }
  };

  useEffect(() => {
    fetchPayments(selectedType);
  }, [selectedType]);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h2 className="text-3xl font-bold mb-6 text-center">💳 Payment Details</h2>

      <div className="mb-6 flex justify-center">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="daily_scrim">Daily Scrim</option>
          <option value="weekly_war">Weekly War</option>
        </select>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">⏳ Loading payments...</p>
      ) : payments.length === 0 ? (
        <p className="text-center text-gray-500">No payment records found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-3">#</th>
                <th className="p-3">User ID</th>
                <th className="p-3">Payment ID</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Type</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment, idx) => (
                <tr key={payment.id} className="border-b hover:bg-gray-100">
                  <td className="p-3">{idx + 1}</td>
                  <td className="p-3">{payment.userId || "N/A"}</td>
                  <td className="p-3">{payment.paymentId || "N/A"}</td>
                  <td className="p-3">₹{payment.registrationFee || 0}</td>
                  <td className="p-3">{payment.type}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleDelete(payment.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      🗑 Delete
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
};

export default Payments;
