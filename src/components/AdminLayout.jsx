// 📁 src/components/AdminLayout.jsx

import React from "react";
import AdminBottomNav from "./AdminBottomNav";
import AdminProfileMenu from "./AdminProfileMenu";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/config";
import AdminSidebar from "./AdminSidebar";

function AdminLayout({ children }) {
  const [user] = useAuthState(auth);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* ✅ Left Sidebar */}
      <AdminSidebar />

      {/* ✅ Main content with top profile and bottom nav */}
      <div className="flex-1 relative pb-16">
        {/* ✅ Top-right profile menu */}
        <AdminProfileMenu user={user} />

        {/* ✅ Main Page Content */}
        <div className="pt-4 px-4">{children}</div>

        {/* ✅ Bottom Navigation (optional) */}
        <AdminBottomNav />
      </div>
    </div>
  );
}

export default AdminLayout;
