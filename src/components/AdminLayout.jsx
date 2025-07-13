import React, { useState } from "react";
import AdminBottomNav from "./AdminBottomNav";
import AdminProfileMenu from "./AdminProfileMenu";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/config";
import AdminSidebar from "./AdminSidebar";
import { FiMenu } from "react-icons/fi";

function AdminLayout({ children }) {
  const [user, loading] = useAuthState(auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="min-h-screen relative pb-16 bg-gray-50">
      {/* ✅ Top Bar */}
      <div className="flex items-center justify-between p-4 bg-white shadow-md sticky top-0 z-30">
        <button onClick={toggleSidebar} className="text-2xl">
          <FiMenu />
        </button>
        <AdminProfileMenu user={user} />
      </div>

      {/* ✅ Sidebar */}
      <AdminSidebar open={sidebarOpen} onClose={toggleSidebar} />

      {/* ✅ Main Content */}
      <div className="pt-2 px-4">{children}</div>

      {/* ✅ Bottom Navigation */}
      <AdminBottomNav />
    </div>
  );
}

export default AdminLayout;
