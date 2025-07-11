// 📁 src/components/AdminRoute.jsx

import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { app } from "../firebase/config";
import { ADMIN_EMAILS } from "../constants/admins"; // ✅ Import admin emails list

const auth = getAuth(app);

function AdminRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && ADMIN_EMAILS.includes(currentUser.email)) {
        setUser(currentUser); // ✅ Allow if in ADMIN_EMAILS list
      } else {
        setUser(null); // ❌ Not allowed
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <p className="text-center mt-10">Checking Admin Access...</p>;

  return user ? children : <Navigate to="/login" replace />;
}

export default AdminRoute;
