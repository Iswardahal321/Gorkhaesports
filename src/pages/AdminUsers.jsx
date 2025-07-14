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
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Fetch users from Firestore
  const fetchUsers = async () => {
    const usersSnapshot = await getDocs(collection(db, "users"));
    const userList = usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setUsers(userList);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Delete user and associated data
  const handleDelete = async (uid, email) => {
    if (email === "junmain8@gmail.com") return; // Prevent deleting the owner account
    if (!window.confirm(`Are you sure to delete ${email} and all related data?`)) return;

    try {
      const teamQuery = query(collection(db, "teams"), where("leaderEmail", "==", email));
      const teamSnap = await getDocs(teamQuery);
      teamSnap.forEach(async (docu) => await deleteDoc(doc(db, "teams", docu.id)));

      const joinQuery = query(collection(db, "tournament_joins"), where("userId", "==", uid));
      const joinSnap = await getDocs(joinQuery);
      joinSnap.forEach(async (docu) => await deleteDoc(doc(db, "tournament_joins", docu.id)));

      await deleteDoc(doc(db, "users", uid));

      alert("✅ User deleted successfully.");
      fetchUsers();
    } catch (err) {
      alert("❌ Failed to delete user.");
    }
  };

  // Open modal to view/edit user details
  const openModal = (user) => {
    setSelectedUser({ ...user });
    setModalOpen(true);
  };

  // Save updated user details
  const handleModalSave = async () => {
    if (selectedUser.email === "junmain8@gmail.com") {
      alert("❌ Cannot update owner account.");
      return; // Prevent updating the owner account
    }

    try {
      await updateDoc(doc(db, "users", selectedUser.id), {
        role: selectedUser.role,
        disabled: selectedUser.disabled,
      });
      setModalOpen(false);
      fetchUsers();
    } catch (err) {
      alert("❌ Failed to update user.");
    }
  };

  // Filter users by UID search
  const filteredUsers = users.filter((user) =>
    user.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">All Users</h2>

      <input
        type="text"
        placeholder="Search by UID"
        className="border px-3 py-2 mb-4 w-full max-w-sm"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-auto max-h-[500px]">
          <table className="min-w-[600px] w-full border text-sm">
            <thead className="bg-gray-200 text-xs">
              <tr>
                <th className="p-2 border">UID (short)</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id} className="text-center">
                  <td className="p-2 border">{u.id.slice(0, 8)}...</td>
                  <td className="p-2 border">{u.email || "N/A"}</td>
                  <td className="p-2 border flex justify-center gap-3">
                    <button
                      onClick={() => openModal(u)}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-xs"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(u.id, u.email)}
                      className={`${
                        u.email === "junmain8@gmail.com"
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-red-500"
                      } text-white px-3 py-1 rounded text-xs`}
                      disabled={u.email === "junmain8@gmail.com"}
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

      {/* Modal to edit user */}
      {modalOpen && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4 text-center">Edit User</h3>
            <div className="space-y-3 text-sm">
              <div>
                <label className="block font-medium">UID:</label>
                <input
                  type="text"
                  value={selectedUser.id}
                  readOnly
                  className="w-full border bg-gray-100 px-2 py-1 rounded text-xs"
                />
              </div>

              <div>
                <label className="block font-medium">Email:</label>
                <input
                  type="text"
                  value={selectedUser.email || "N/A"}
                  readOnly
                  className="w-full border bg-gray-100 px-2 py-1 rounded text-xs"
                />
              </div>

              <div>
                <label className="block font-medium">Role:</label>
                <select
                  value={selectedUser.role}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, role: e.target.value })
                  }
                  className="w-full border rounded px-2 py-1"
                  disabled={selectedUser.email === "junmain8@gmail.com"} // Disable for owner account
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block font-medium">Account Status:</label>
                <select
                  value={selectedUser.disabled ? "disabled" : "enabled"}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      disabled: e.target.value === "disabled",
                    })
                  }
                  className="w-full border rounded px-2 py-1"
                  disabled={selectedUser.email === "junmain8@gmail.com"} // Disable for owner account
                >
                  <option value="enabled">Enabled</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>

              <div className="flex justify-between mt-4">
                <button
                  onClick={() => setModalOpen(false)}
                  className="bg-gray-400 text-white px-4 py-1 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleModalSave}
                  className={`${
                    selectedUser.email === "junmain8@gmail.com"
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-green-600"
                  } text-white px-4 py-1 rounded`}
                  disabled={selectedUser.email === "junmain8@gmail.com"} // Disable save for owner account
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;
