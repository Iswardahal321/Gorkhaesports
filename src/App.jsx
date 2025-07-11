import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/config";


// Pages
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AddTeam from "./pages/AddTeam.jsx";
import JoinTournament from "./pages/JoinTournament.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";
import AdminTeams from "./pages/AdminTeams.jsx";
import SlotList from "./pages/SlotList.jsx";
import AddSlot from "./pages/AddSlot.jsx"; // ✅ NEW IMPORT

// Components
import PrivateRoute from "./components/PrivateRoute.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import Layout from "./components/Layout.jsx";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/add-team"
          element={
            <PrivateRoute>
              <Layout>
                <AddTeam />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/join-tournament"
          element={
            <PrivateRoute>
              <Layout>
                <JoinTournament />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/slot-list"
          element={
            <PrivateRoute>
              <Layout>
                <SlotList />
              </Layout>
            </PrivateRoute>
          }
        />

        {/* Admin Protected Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Layout>
                <AdminPanel />
              </Layout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/teams"
          element={
            <AdminRoute>
              <Layout>
                <AdminTeams />
              </Layout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/add-slot"
          element={
            <AdminRoute>
              <Layout>
                <AddSlot />
              </Layout>
            </AdminRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
