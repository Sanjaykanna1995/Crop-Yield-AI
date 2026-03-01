import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, ShieldAlert, User, Mail, ShieldCheck } from "lucide-react"; // Highly recommend 'npm i lucide-react'
import type { Profile as ProfileType } from "../types/user.types";
import { getProfile } from "../api/axios";
import ProfileForm from "../components/profile/ProfileForm";

const Profile = () => {
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProfile();
      setProfile(data);
    } catch (err) {
      console.error("Failed to load profile:", err);
      setError("We couldn't load your profile. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // --- Loading State ---
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
        <p className="text-gray-500 font-medium">Loading your profile...</p>
      </div>
    );
  }

  // --- Error State ---
  if (error) {
    return (
      <div className="bg-red-50 rounded-2xl border border-red-100 p-8 text-center max-w-lg mx-auto mt-10">
        <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-lg font-bold text-red-900 mb-2">Oops!</h2>
        <p className="text-red-600 mb-6">{error}</p>
        <button
          onClick={fetchProfile}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  // --- Empty State ---
  if (!profile) {
    return (
      <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8 text-center text-gray-500 mt-10">
        Profile data is unavailable.
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-emerald-900">Profile Settings</h1>
          <p className="text-gray-500 mt-1">Manage your account details and preferences.</p>
        </div>
        <button
          onClick={() => navigate("/app/dashboard")}
          className="flex items-center gap-2 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 px-4 py-2 rounded-lg font-medium transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
      </div>

      {/* 2 Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN – USER OVERVIEW (Takes up 4 columns on large screens) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            
            {/* Avatar */}
            <div className="flex justify-center mb-6">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 border-4 border-white shadow-lg flex items-center justify-center text-4xl font-bold text-emerald-800">
                {profile.name.charAt(0).toUpperCase()}
              </div>
            </div>

            {/* Basic Info */}
            <div className="text-center space-y-3">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                {profile.name}
              </h2>
              <div className="flex items-center justify-center gap-2 text-gray-500">
                <Mail className="w-4 h-4" />
                <span>{profile.email}</span>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 mt-2 px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full ${
                  profile.role === "admin"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-emerald-100 text-emerald-700"
                }`}
              >
                {profile.role === "admin" ? <ShieldCheck className="w-3 h-3" /> : <User className="w-3 h-3" />}
                {profile.role}
              </span>
            </div>

            {/* Account Overview */}
            <div className="border-t border-gray-100 mt-8 pt-6 space-y-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Account Overview
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-50/50 p-4 rounded-xl text-center border border-emerald-100">
                  <p className="text-xs text-emerald-600/70 font-medium mb-1">Status</p>
                  <p className="font-semibold text-emerald-800">Active</p>
                </div>
                <div className="bg-blue-50/50 p-4 rounded-xl text-center border border-blue-100">
                  <p className="text-xs text-blue-600/70 font-medium mb-1">Role</p>
                  <p className="font-semibold text-blue-800 capitalize">{profile.role}</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="border-t border-gray-100 mt-8 pt-6 space-y-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    // Requires you to add id="password-section" to the password form in ProfileForm.tsx
                    document.getElementById("password-section")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 py-2.5 rounded-lg text-sm font-medium transition"
                >
                  Change Password
                </button>
              </div>
            </div>
            
          </div>
        </div>

        {/* RIGHT COLUMN – PROFILE FORM (Takes up 8 columns on large screens) */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <ProfileForm
              profile={profile}
              refreshProfile={fetchProfile}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;