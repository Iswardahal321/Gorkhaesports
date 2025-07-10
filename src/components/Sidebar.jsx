// 📁 src/components/Sidebar.jsx

import React from "react";
import { Link } from "react-router-dom";


const Sidebar = ({ isOpen }) => {
  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white z-50 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out`}
    >
      <div className="p-4 font-bold text-lg border-b border-gray-700">
        Gorkha Esports
      </div>
      <ul className="p-4 space-y-4">
        <li>
          <Link to="/dashboard" className="hover:text-yellow-400">
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/add-team" className="hover:text-yellow-400">
            Add Team
          </Link>
        </li>
        <li>
          <Link to="/my-team" className="hover:text-yellow-400">
            My Team
          </Link>
        </li>
        <li>
          <Link to="/logout" className="hover:text-red-400">
            Logout
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
