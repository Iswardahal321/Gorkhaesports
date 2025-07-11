// src/components/AdminLayout.jsx
import React from "react";
import AdminBottomNav from "./AdminBottomNav";
import AdminProfileMenu from "./AdminProfileMenu";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/config";

function AdminLayout({ children }) {
  const [user] = useAuthState(auth);

  
  return (
    <div className="min-h-screen relative pb-16 bg-gray-50">
      {/* ✅ Top-right admin profile circle */}
      <AdminProfileMenu user={user} />

      {/* Main content */}
      <div className="pt-4 px-4">{children}</div>

      {/* Bottom nav */}
      <AdminBottomNav />
    </div>
  );
}

export default AdminLayout;
