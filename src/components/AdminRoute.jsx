// src/components/AdminRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { app } from "../firebase/config";

const auth = getAuth(app);

function AdminRoute({ children }) {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // Check if current user is admin based on email or custom claim
      if (currentUser && currentUser.email === "admin@gmail.com") {
        setUser(currentUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <p>Loading...</p>;

  return user ? children : <Navigate to="/login" />;
}

export default AdminRoute;
