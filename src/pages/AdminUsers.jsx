import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase/config";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    const usersSnapshot = await getDocs(collection(db, "users"));
    const userList = usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setUsers(userList);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (uid, newRole) => {
    try {
      await updateDoc(doc(db, "users", uid), { role: newRole });
      fetchUsers();
    } catch (error) {
      alert("Failed to update role.");
    }
  };

  const handleStatusChange = async (uid, newStatus) => {
    try {
      await updateDoc(doc(db, "users", uid), { disabled: newStatus === "disabled" });
      fetchUsers();
    } catch (error) {
      alert("Failed to update account status.");
    }
  };

  const handleDelete = async (uid, email) => {
    if (!window.confirm(`Are you sure you want to delete ${email}? This will remove all related data.`)) return;

    try {
      // 1. Delete team(s) created by user
      const teamQuery = query(collection(db, "teams"), where("leaderEmail", "==", email));
      const teamSnap = await getDocs(teamQuery);
      teamSnap.forEach(async (docu) => await deleteDoc(doc(db, "teams", docu.id)));

      // 2. Delete tournament joins
      const joinQuery = query(collection(db, "tournament_joins"), where("userId", "==", uid));
      const joinSnap = await getDocs(joinQuery);
      joinSnap.forEach(async (docu) => await deleteDoc(doc(db, "tournament_joins", docu.id)));

      // 3. Delete user document
      await deleteDoc(doc(db, "users", uid));

      // ⚠️ Note: Firebase Auth account cannot be deleted from Firestore — needs backend function or Admin SDK
      alert("User and related data deleted.");
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to delete user.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">All Registered Users</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Role</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="text-center">
                <td className="p-2 border">{u.email}</td>
                <td className="p-2 border">
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u.id, e.target.value)}
                    className="border rounded p-1 text-sm"
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td className="p-2 border">
                  <select
                    value={u.disabled ? "disabled" : "enabled"}
                    onChange={(e) => handleStatusChange(u.id, e.target.value)}
                    className="border rounded p-1 text-sm"
                  >
                    <option value="enabled">Enabled</option>
                    <option value="disabled">Disabled</option>
                  </select>
                </td>
                <td className="p-2 border">
                  <button
                    onClick={() => handleDelete(u.id, u.email)}
                    className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminUsers;
