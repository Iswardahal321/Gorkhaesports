// 📁 src/components/Sidebar.jsx

import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { auth, db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";

const Sidebar = () => {
  const [hasTeam, setHasTeam] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkTeam = async () => {
      const user = auth.currentUser;
      if (user) {
        const teamDocRef = doc(db, "teams", user.uid);
        const teamSnap = await getDoc(teamDocRef);
        setHasTeam(teamSnap.exists());
      }
    };
    checkTeam();
  }, [location.pathname]); // 🔄 triggers check when route changes

  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-6 fixed left-0 top-0 shadow-md">
      <h1 className="text-2xl font-bold mb-8">🏆 Gorkha Esports</h1>

      <nav className="flex flex-col gap-4">
        <Link to="/dashboard" className="hover:text-yellow-400 transition">
          📊 Dashboard
        </Link>

        {hasTeam ? (
          <Link to="/my-team" className="hover:text-yellow-400 transition">
            📁 My Team
          </Link>
        ) : (
          <Link to="/add-team" className="hover:text-yellow-400 transition">
            ➕ Add Team
          </Link>
        )}

        <Link to="/logout" className="text-red-400 hover:text-red-500 transition mt-10">
          🚪 Logout
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
