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
import AddSlot from "./pages/AddSlot.jsx";
import AddGame from "./pages/AddGame.jsx";
import AdminUsers from "./pages/AdminUsers.jsx";
import UploadResult from "./pages/UploadResult.jsx";
// ❌ Removed: import UserProfile from "./pages/UserProfile.jsx";

// Components
import PrivateRoute from "./components/PrivateRoute.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import Layout from "./components/Layout.jsx";
import AdminLayout from "./components/AdminLayout.jsx";

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

        {/* ✅ User Protected Routes */}
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

        {/* ✅ Admin Protected Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout>
                <AdminPanel />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/teams"
          element={
            <AdminRoute>
              <AdminLayout>
                <AdminTeams />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/add-slot"
          element={
            <AdminRoute>
              <AdminLayout>
                <AddSlot />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/add-game"
          element={
            <AdminRoute>
              <AdminLayout>
                <AddGame />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminLayout>
                <AdminUsers />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/upload-result"
          element={
            <AdminRoute>
              <AdminLayout>
                <UploadResult />
              </AdminLayout>
            </AdminRoute>
          }
        />

        {/* Redirect any unknown route to login */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
