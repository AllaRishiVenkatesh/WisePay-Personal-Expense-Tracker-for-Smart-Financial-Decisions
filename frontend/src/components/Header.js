import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { changeNameAPI, changePasswordAPI } from "../utils/ApiRequest";
import { Button } from '@mui/material';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : undefined;
  });
  const [showProfile, setShowProfile] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [profileName, setProfileName] = useState("");
  const [updatingName, setUpdatingName] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);

  useEffect(() => {
    // Optional: keep this if you want to ensure it updates if localStorage changes outside React
    if (localStorage.getItem("user")) {
      setUser(JSON.parse(localStorage.getItem("user")));
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem("user")) {
      setUser(JSON.parse(localStorage.getItem("user")));
    } else {
      setUser(undefined);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (showProfile && localStorage.getItem("user")) {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      setUser(storedUser);
      setProfileName(storedUser.name || "");
    }
  }, [showProfile]);

  const handleShowLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  }

  const toastOptions = {
    position: "bottom-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "dark",
  };

  const canUpdatePassword =
    currentPassword.trim().length > 0 &&
    newPassword.trim().length >= 6 &&
    newPassword === confirmPassword &&
    !updatingPassword;

  const avatarSrc =
    user?.avatarImage || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.name || "profile"}`;

  const canUpdateName =
    profileName.trim().length >= 2 &&
    profileName.trim() !== user?.name &&
    !updatingName;

  const handleUpdateName = async () => {
    if (!user?._id || !canUpdateName) return;

    try {
      setUpdatingName(true);
      const { data } = await axios.post(`${changeNameAPI}/${user._id}`, {
        name: profileName,
      });

      if (data?.success && data?.user) {
        const updatedUser = { ...user, ...data.user };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        setProfileName(updatedUser.name || "");
        toast.success("Username updated successfully", toastOptions);
      } else {
        toast.error(data?.message || "Unable to update username", toastOptions);
      }
    } catch (err) {
      toast.error("Unable to update username", toastOptions);
    } finally {
      setUpdatingName(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!user?._id) return;
    if (newPassword.trim().length < 6) {
      toast.error("New password must be at least 6 characters", toastOptions);
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match", toastOptions);
      return;
    }

    try {
      setUpdatingPassword(true);
      const { data } = await axios.post(`${changePasswordAPI}/${user._id}`, {
        oldPassword: currentPassword,
        newPassword,
      });

      if (data?.success) {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        toast.success("Password updated successfully", toastOptions);
      } else {
        toast.error(data?.message || "Unable to update password", toastOptions);
      }
    } catch (err) {
      toast.error("Unable to update password", toastOptions);
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <>
    <nav className="sticky top-0 z-50 w-full bg-[#0b0f19] border-b border-white/5 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-3 group no-underline focus:outline-none">
              <div className="w-10 h-10 rounded-[10px] bg-[#00ffb2] flex items-center justify-center">
                <span className="text-[#050816] text-2xl font-black">$</span>
              </div>
              <span className="text-2xl font-bold tracking-tight text-white border-b-[3px] border-[#00ffb2] pb-0.5 leading-none">
                WisePay
              </span>
            </Link>
          </div>

          {/* Navigation & Profile */}
          <div className="flex items-center">
            {user ? (
              <>
                {/* Navigation Links */}
                <div className="flex items-center gap-2 sm:gap-3 mr-3 sm:mr-6 border border-white/30 p-1 rounded-full">
                  <Link
                    to="/"
                    className={`flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full transition-all duration-300 no-underline ${
                      location.pathname === "/"
                        ? "bg-[#00ffb2] text-[#0055ff]"
                        : "text-[#00ffb2] hover:bg-white/10"
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
                    </svg>
                    <span className="text-xs sm:text-sm font-bold">Dashboard</span>
                  </Link>
                  <Link
                    to="/reports"
                    className={`flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full transition-all duration-300 no-underline ${
                      location.pathname === "/reports"
                        ? "bg-[#00ffb2] text-[#0055ff]"
                        : "text-[#00ffb2] hover:bg-white/10"
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span className="text-xs sm:text-sm font-bold">Reports</span>
                  </Link>
                  <Link
                    to="/about"
                    className={`flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full transition-all duration-300 no-underline ${
                      location.pathname === "/about"
                        ? "bg-[#00ffb2] text-[#0055ff]"
                        : "text-[#00ffb2] hover:bg-white/10"
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs sm:text-sm font-bold">About</span>
                  </Link>
                </div>

                {/* Profile Box */}
                <button 
                  onClick={() => setShowProfile(true)} 
                  className="hidden sm:flex items-center gap-3 px-3 py-2 bg-transparent border border-white/30 hover:border-white/50 transition-all duration-300 focus:outline-none"
                >
                  <div className="h-8 w-8 rounded-full overflow-hidden bg-[#0f172a]">
                    <img
                      src={avatarSrc}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="text-[11px] text-gray-400 font-semibold uppercase tracking-widest mr-2">
                    Account
                  </span>
                </button>
              </>
            ) : (
              <button 
                onClick={() => navigate("/login")} 
                className="btn-primary-custom px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 focus:outline-none"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>

      {/* Profile Modal */}
      {showProfile && user && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-3 sm:px-4 py-4">
          <div className="glass-panel w-full max-w-md max-h-[92vh] p-0 overflow-y-auto shadow-2xl animate-fade-in-up border border-[rgba(255,255,255,0.1)]">
            <div className="sticky top-0 z-10 flex justify-between items-center p-4 sm:p-6 border-b border-[rgba(255,255,255,0.1)] bg-[rgba(0,0,0,0.45)] backdrop-blur-md">
              <h3 className="text-xl font-bold text-white">Your Profile</h3>
              <button
                type="button"
                onClick={() => setShowProfile(false)}
                className="h-10 w-10 rounded-[9999px] flex items-center justify-center text-white bg-white/10 border border-white/20 hover:bg-white/20 transition-colors"
                aria-label="Close profile"
                title="Close profile"
              >
                <CloseIcon fontSize="small" />
              </button>
            </div>
            <div className="p-5 sm:p-8 flex flex-col items-center">
              <div className="relative mb-6">
                <div className="w-32 h-32 rounded-[9999px] overflow-hidden border-4 border-[var(--color-primary)] shadow-[0_0_20px_rgba(5,150,105,0.3)] flex items-center justify-center bg-black/30">
                  <img src={avatarSrc} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowProfile(false);
                    navigate("/setAvatar");
                  }}
                  className="absolute bottom-0 right-0 bg-[var(--color-primary)] rounded-[9999px] p-2 cursor-pointer shadow-lg hover:bg-emerald-500 transition-colors"
                  title="Change avatar"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-1 text-center w-full">{user.name}</h2>
              <p className="text-[var(--color-text-muted)] mb-6 text-sm bg-[rgba(0,0,0,0.3)] px-4 py-1 rounded-[9999px] text-center">{user.email}</p>

              <div className="w-full border-t border-[rgba(255,255,255,0.1)] pt-6 mt-2 text-left">
                <h4 className="text-white font-medium mb-4 text-left w-full">Account Settings</h4>
                <form className="flex flex-col gap-4 w-full mb-6">
                  <div className="flex flex-col w-full text-left">
                    <label className="text-[var(--color-text-muted)] text-xs font-semibold mb-1 w-full">Username</label>
                    <input
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      type="text"
                      placeholder="Enter username"
                      className="w-full px-4 py-2.5 rounded-lg bg-[rgba(0,0,0,0.2)] border border-[rgba(255,255,255,0.1)] text-white focus:border-[var(--color-primary)] outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleUpdateName}
                    disabled={!canUpdateName}
                    className={`btn-primary-custom w-full py-2.5 rounded-lg font-bold ${
                      canUpdateName ? "" : "opacity-70 cursor-not-allowed"
                    }`}
                  >
                    {updatingName ? "Updating..." : "Update Username"}
                  </button>
                </form>

                <h4 className="text-white font-medium mb-4 text-left w-full">Security Settings</h4>
                <form className="flex flex-col gap-4 w-full">
                  <div className="flex flex-col w-full text-left">
                    <label className="text-[var(--color-text-muted)] text-xs font-semibold mb-1 w-full">Current Password</label>
                    <input
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      type="password"
                      placeholder="Enter current password"
                      className="w-full px-4 py-2.5 rounded-lg bg-[rgba(0,0,0,0.2)] border border-[rgba(255,255,255,0.1)] text-white focus:border-[var(--color-primary)] outline-none"
                    />
                  </div>
                  <div className="flex flex-col w-full text-left">
                    <label className="text-[var(--color-text-muted)] text-xs font-semibold mb-1 w-full">New Password</label>
                    <input
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      type="password"
                      placeholder="Enter new password"
                      className="w-full px-4 py-2.5 rounded-lg bg-[rgba(0,0,0,0.2)] border border-[rgba(255,255,255,0.1)] text-white focus:border-[var(--color-primary)] outline-none"
                    />
                  </div>
                  <div className="flex flex-col w-full text-left">
                    <label className="text-[var(--color-text-muted)] text-xs font-semibold mb-1 w-full">Confirm New Password</label>
                    <input
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      type="password"
                      placeholder="Re-enter new password"
                      className="w-full px-4 py-2.5 rounded-lg bg-[rgba(0,0,0,0.2)] border border-[rgba(255,255,255,0.1)] text-white focus:border-[var(--color-primary)] outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleUpdatePassword}
                    disabled={!canUpdatePassword}
                    className={`btn-primary-custom w-full py-2.5 rounded-lg font-bold mt-2 ${
                      canUpdatePassword ? "" : "opacity-70 cursor-not-allowed"
                    }`}
                  >
                    {updatingPassword ? "Updating..." : "Update Password"}
                  </button>
                </form>

                <div className="w-full border-t border-[rgba(255,255,255,0.1)] pt-6 mt-6 sm:hidden">
                  <button 
                    onClick={handleShowLogout} 
                    className="w-full px-4 py-3 rounded-lg text-sm font-bold text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all duration-300"
                  >
                    Logout Account
                  </button>
                </div>
              </div>
            </div>
          </div>
          <ToastContainer />
        </div>
      )}
    </>
  );
};

export default Header;
