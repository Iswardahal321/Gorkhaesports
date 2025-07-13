// 🧠 Already imported modules remain unchanged
import React, { useEffect, useState } from "react";
import {
  Menu, MenuItem, Dialog, DialogTitle, DialogContent,
  TextField, DialogActions, Button, Switch,
  Typography, Box,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { useNavigate } from "react-router-dom";
import {
  signOut, updatePassword, EmailAuthProvider, reauthenticateWithCredential,
} from "firebase/auth";
import { auth, db } from "../firebase/config";
import { doc, setDoc, onSnapshot } from "firebase/firestore";

const AdminProfileMenu = ({ user }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const [dailyStatus, setDailyStatus] = useState(false);
  const [weeklyStatus, setWeeklyStatus] = useState(false);

  const [dailyGameStatus, setDailyGameStatus] = useState(false);
  const [weeklyGameStatus, setWeeklyGameStatus] = useState(false);

  const navigate = useNavigate();

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const handlePasswordChange = async () => {
    setMessage("");
    const userAuth = auth.currentUser;
    const credential = EmailAuthProvider.credential(userAuth.email, currentPassword);
    try {
      await reauthenticateWithCredential(userAuth, credential);
      await updatePassword(userAuth, newPassword);
      setMessage("✅ Password updated successfully.");
      setOpenDialog(false);
      setCurrentPassword("");
      setNewPassword("");
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to update password. Check current password.");
    }
  };

  // 🟢 LIVE FETCH for all 4 toggles
  useEffect(() => {
    if (!user) return;

    const unsubDailyIDP = onSnapshot(doc(db, "daily_idp", "current"), (snap) => {
      setDailyStatus(snap.exists() && snap.data().status === "active");
    });

    const unsubWeeklyIDP = onSnapshot(doc(db, "weekly_idp", "current"), (snap) => {
      setWeeklyStatus(snap.exists() && snap.data().status === "active");
    });

    const unsubDailyGame = onSnapshot(doc(db, "tournament_status", "daily_status"), (snap) => {
      setDailyGameStatus(snap.exists() && snap.data().status === "active");
    });

    const unsubWeeklyGame = onSnapshot(doc(db, "tournament_status", "weekly_status"), (snap) => {
      setWeeklyGameStatus(snap.exists() && snap.data().status === "active");
    });

    return () => {
      unsubDailyIDP();
      unsubWeeklyIDP();
      unsubDailyGame();
      unsubWeeklyGame();
    };
  }, [user]);

  // 🔁 IDP toggle logic
  const toggleStatus = async (type) => {
    try {
      const ref = doc(db, type === "daily" ? "daily_idp" : "weekly_idp", "current");
      const newStatus = type === "daily" ? !dailyStatus : !weeklyStatus;
      await setDoc(ref, { status: newStatus ? "active" : "inactive" }, { merge: true });
    } catch (err) {
      console.error("❌ Toggle failed:", err);
    }
  };

  // 🔁 Tournament Game Status toggle
  const toggleGameStatus = async (type) => {
    try {
      const ref = doc(db, "tournament_status", type === "daily" ? "daily_status" : "weekly_status");
      const newStatus = type === "daily" ? !dailyGameStatus : !weeklyGameStatus;
      await setDoc(ref, { status: newStatus ? "active" : "inactive" }, { merge: true });
    } catch (err) {
      console.error("❌ Failed to toggle game status:", err);
    }
  };

  return (
    <div className="absolute top-4 right-4">
      <Avatar onClick={handleOpen} sx={{ cursor: "pointer", bgcolor: "#1976d2" }}>
        {user?.email?.charAt(0)?.toUpperCase() || "A"}
      </Avatar>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem disabled>
          <strong>Email:</strong>&nbsp; {user?.email}
        </MenuItem>

        <Box px={2} py={1}>
          <Typography fontWeight={600}>DAILY IDP</Typography>
          <Switch
            checked={dailyStatus}
            onChange={() => toggleStatus("daily")}
            color="primary"
          />
          <Typography variant="caption" color="textSecondary">
            {dailyStatus ? "Active" : "Inactive"}
          </Typography>

          <Typography fontWeight={600} mt={2}>WEEKLY IDP</Typography>
          <Switch
            checked={weeklyStatus}
            onChange={() => toggleStatus("weekly")}
            color="primary"
          />
          <Typography variant="caption" color="textSecondary">
            {weeklyStatus ? "Active" : "Inactive"}
          </Typography>

          <Typography fontWeight={600} mt={2}>DAILY SCRIM</Typography>
          <Switch
            checked={dailyGameStatus}
            onChange={() => toggleGameStatus("daily")}
            color="secondary"
          />
          <Typography variant="caption" color="textSecondary">
            {dailyGameStatus ? "Active" : "Inactive"}
          </Typography>

          <Typography fontWeight={600} mt={2}>WEEKLY WAR</Typography>
          <Switch
            checked={weeklyGameStatus}
            onChange={() => toggleGameStatus("weekly")}
            color="secondary"
          />
          <Typography variant="caption" color="textSecondary">
            {weeklyGameStatus ? "Active" : "Inactive"}
          </Typography>
        </Box>

        <MenuItem onClick={() => { setOpenDialog(true); handleClose(); }}>
          🔒 Change Password
        </MenuItem>
        <MenuItem onClick={handleLogout} sx={{ color: "red" }}>
          🔓 Logout
        </MenuItem>
      </Menu>

      {/* 🔐 Password Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            type="password"
            label="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            type="password"
            label="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            margin="normal"
          />
          {message && (
            <p className={`text-sm ${message.includes("✅") ? "text-green-600" : "text-red-500"}`}>
              {message}
            </p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handlePasswordChange} disabled={!currentPassword || !newPassword}>
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminProfileMenu;
