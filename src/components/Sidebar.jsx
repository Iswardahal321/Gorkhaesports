// components/Sidebar.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";

const Sidebar = () => {
  const [hasTeam, setHasTeam] = useState(false);

  useEffect(() => {
    const checkTeam = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "teams", user.uid);
        const docSnap = await getDoc(docRef);
        setHasTeam(docSnap.exists());
      }
    };
    checkTeam();
  }, []);

  return (
    <div className="w-60 h-screen bg-gray-900 text-white p-5 fixed left-0 top-0">
      <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
      <ul className="space-y-4">
        <li>
          {hasTeam ? (
            <Link to="/my-team">📁 My Team</Link>
          ) : (
            <Link to="/add-team">➕ Add Team</Link>
          )}
        </li>
        <li><Link to="/dashboard">📊 Dashboard</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
