// src/components/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { app } from "../firebase/config";

const auth = getAuth(app);

function PrivateRoute({ children }) {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <p>Loading...</p>;

  return user ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
