import React, { useEffect, useState } from "react"; import { collection, getDocs, query, where, deleteDoc, doc, } from "firebase/firestore"; import { db } from "../firebase/config"; import { saveAs } from "file-saver";

function Payments() { const [selectedType, setSelectedType] = useState("Daily Scrim"); const [payments, setPayments] = useState([]); const [filteredPayments, setFilteredPayments] = useState([]); const [loading, setLoading] = useState(true); const [searchTerm, setSearchTerm] = useState("");

useEffect(() => { const fetchPayments = async () => { setLoading(true); try { const q = query( collection(db, "tournament_joins"), where("type", "==", selectedType) ); const snap = await getDocs(q); const data = snap.docs.map((doc) => { const d = doc.data(); return { id: doc.id, userId: d.userId || "N/A", email: d.email || "N/A", paymentId: d.paymentId || "N/A", fee: d.fee || 0, type: d.type || "N/A", joinedAt: d.joinedAt?.toDate().toLocaleString() || "N/A", tournamentId: d.tournamentId || "N/A", }; }); setPayments(data); setFilteredPayments(data); } catch (err) { console.error("❌ Failed to fetch payments:", err); } setLoading(false); };

fetchPayments();

}, [selectedType]);

useEffect(() => { if (!searchTerm) { setFilteredPayments(payments); } else { setFilteredPayments( payments.filter((p) => p.paymentId.toLowerCase().includes(searchTerm.toLowerCase()) ) ); } }, [searchTerm, payments]);

const handleDelete = async (id) => { if (!window.confirm("Are you sure you want to delete this record?")) return; try { await deleteDoc(doc(db, "tournament_joins", id)); setPayments((prev) => prev.filter((p) => p.id !== id)); setFilteredPayments((prev) => prev.filter((p) => p.id !== id)); } catch (error) { console.error("❌ Delete failed:", error); } };

const exportToCSV = () => { const csvContent = [ ["User ID", "Email", "Payment ID", "Fee", "Type", "Tournament ID", "Joined At"], ...filteredPayments.map((p) => [ p.userId, p.email, p.paymentId, p.fee, p.type, p.tournamentId, p.joinedAt, ]), ] .map((row) => row.join(",")) .join("\n");

const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
saveAs(blob, `${selectedType}_Payments.csv`);

};

return ( <div className="min-h-screen p-6 bg-gray-100"> <h2 className="text-3xl font-bold mb-6 text-center">💳 Payment Records</h2>

<div className="flex flex-col sm:flex-row items-center justify-between mb-4">
    <select
      value={selectedType}
      onChange={(e) => setSelectedType(e.target.value)}
      className="px-4 py-2 rounded border border-gray-300 mb-2 sm:mb-0"
    >
      <option value="Daily Scrim">Daily Scrim</option>
      <option value="Weekly War">Weekly War</option>
    </select>

    
    <div className="flex gap-2">
      <input
        type="text"
        placeholder="Search by Payment ID"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="px-4 py-2 rounded border border-gray-300"
      />
      <button
        onClick={exportToCSV}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Export CSV
      </button>
    </div>
  </div>

  {loading ? (
    <p className="text-center text-gray-600">⏳ Loading payment records...</p>
  ) : filteredPayments.length === 0 ? (
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
            <th className="py-2 px-4 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredPayments.map((p) => (
            <tr key={p.id} className="text-center text-sm hover:bg-gray-50">
              <td className="py-2 px-4 border">{p.userId}</td>
              <td className="py-2 px-4 border">{p.email}</td>
              <td className="py-2 px-4 border">{p.paymentId}</td>
              <td className="py-2 px-4 border">₹{p.fee}</td>
              <td className="py-2 px-4 border">{p.type}</td>
              <td className="py-2 px-4 border">{p.tournamentId}</td>
              <td className="py-2 px-4 border">{p.joinedAt}</td>
              <td className="py-2 px-4 border">
                <button
                  onClick={() => handleDelete(p.id)}
                  className="text-red-600 hover:underline"
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

); }

export default Payments;

