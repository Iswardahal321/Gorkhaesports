import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/config";

// ✅ Pages
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AddTeam from "./pages/AddTeam.jsx";
import JoinTournament from "./pages/JoinTournament.jsx";
import SlotList from "./pages/SlotList.jsx";
import IDPass from "./pages/IDPass.jsx";

// ✅ Admin Pages
import AdminPanel from "./pages/AdminPanel.jsx";
import AdminTeams from "./pages/AdminTeams.jsx";
import AddSlot from "./pages/AddSlot.jsx";
import AddGame from "./pages/AddGame.jsx";
import AdminUsers from "./pages/AdminUsers.jsx";
import UploadResult from "./pages/UploadResult.jsx";
import AdminAddIDPass from "./pages/AdminAddIDPass.jsx";
import Payments from "./pages/Payments.jsx";

// ✅ Components
import PrivateRoute from "./components/PrivateRoute.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import Layout from "./components/Layout.jsx";
import AdminLayout from "./components/AdminLayout.jsx";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  // ❌ Show message if opened on Desktop
  if (isDesktop) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white text-center px-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">⚠️ Please use your phone</h1>
          <p className="text-sm">This website is optimized for mobile devices only.</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* ✅ Public Routes */}
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
          path="/join-tournament/:type/:id"
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
        <Route
          path="/id-pass"
          element={
            <PrivateRoute>
              <Layout>
                <IDPass />
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
        <Route
          path="/admin/add-id-pass"
          element={
            <AdminRoute>
              <AdminLayout>
                <AdminAddIDPass />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/payments"
          element={
            <AdminRoute>
              <AdminLayout>
                <Payments />
              </AdminLayout>
            </AdminRoute>
          }
        />

        {/* ✅ Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
