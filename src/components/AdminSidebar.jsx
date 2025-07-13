import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

const AdminSidebar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ☰ Hamburger */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 left-4 z-50 text-3xl md:hidden"
      >
        <FiMenu />
      </button>

      {/* Sidebar Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:block`}
      >
        {/* ❌ Close Button (Mobile Only) */}
        <div className="flex justify-between items-center p-4 border-b md:hidden">
          <h2 className="text-lg font-bold">Admin Menu</h2>
          <button onClick={() => setOpen(false)} className="text-2xl">
            <FiX />
          </button>
        </div>

        <nav className="p-4 space-y-4 text-gray-800 font-medium">
          <Link to="/admin" className="block hover:underline">🏠 Dashboard</Link>
          <Link to="/admin/teams" className="block hover:underline">👥 Teams</Link>
          <Link to="/admin/add-slot" className="block hover:underline">🎯 Add Slot</Link>
          <Link to="/admin/add-id-pass" className="block hover:underline">🔐 Add ID & Password</Link>
          <Link to="/admin/add-game" className="block hover:underline">🎮 Add Game</Link>
          <Link to="/admin/users" className="block hover:underline">🧑‍💼 All Users</Link>
          <Link to="/admin/upload-result" className="block hover:underline">📤 Upload Result</Link>
        </nav>
      </div>
    </>
  );
};

export default AdminSidebar;
