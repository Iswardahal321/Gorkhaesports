import React, { useEffect, useState } from "react";
import {
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Switch,
  Typography,
  Box,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { useNavigate } from "react-router-dom";
import {
  signOut,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { auth, db } from "../firebase/config";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

const AdminProfileMenu = ({ user }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const [dailyStatus, setDailyStatus] = useState(false);
  const [weeklyStatus, setWeeklyStatus] = useState(false);

  const navigate = useNavigate();

  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const handlePasswordChange = async () => {
    setMessage("");
    const userAuth = auth.currentUser;
    const credential = EmailAuthProvider.credential(
      userAuth.email,
      currentPassword
    );

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

  const fetchStatus = async () => {
    try {
      const dailyRef = doc(db, "daily_idp", "current");
      const weeklyRef = doc(db, "weekly_idp", "current");

      const dailySnap = await getDoc(dailyRef);
      const weeklySnap = await getDoc(weeklyRef);

      if (dailySnap.exists()) {
        setDailyStatus(dailySnap.data().status === "active");
      }
      if (weeklySnap.exists()) {
        setWeeklyStatus(weeklySnap.data().status === "active");
      }
    } catch (err) {
      console.error("❌ Failed to fetch status:", err);
    }
  };

  const toggleStatus = async (type) => {
    try {
      const collection = type === "daily" ? "daily_idp" : "weekly_idp";
      const ref = doc(db, collection, "current");
      const newStatus = type === "daily" ? !dailyStatus : !weeklyStatus;

      const snap = await getDoc(ref);

      if (snap.exists()) {
        await updateDoc(ref, {
          status: newStatus ? "active" : "inactive",
        });
      } else {
        await setDoc(ref, {
          status: newStatus ? "active" : "inactive",
        });
      }

      if (type === "daily") {
        setDailyStatus(newStatus);
      } else {
        setWeeklyStatus(newStatus);
      }
    } catch (err) {
      console.error("❌ Failed to toggle status:", err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchStatus();
    }
  }, [user]);

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

          <Typography fontWeight={600} mt={2}>
            WEEKLY IDP
          </Typography>
          <Switch
            checked={weeklyStatus}
            onChange={() => toggleStatus("weekly")}
            color="primary"
          />
          <Typography variant="caption" color="textSecondary">
            {weeklyStatus ? "Active" : "Inactive"}
          </Typography>
        </Box>

        <MenuItem
          onClick={() => {
            setOpenDialog(true);
            handleClose();
          }}
        >
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
            <p
              className={`text-sm ${
                message.includes("✅") ? "text-green-600" : "text-red-500"
              }`}
            >
              {message}
            </p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handlePasswordChange}
            disabled={!currentPassword || !newPassword}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminProfileMenu;
