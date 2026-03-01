import { useState, useEffect } from "react";
import { 
  User, 
  Mail, 
  Lock, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Save
} from "lucide-react";
import type { 
  Profile, 

} from "../../types/user.types";
import { updateProfile, changePassword } from "../../api/axios";
import { useAuth } from "../../context/useAuth";
import type { AxiosError } from "axios";

interface Props {
  profile: Profile;
  refreshProfile: () => void;
}

const ProfileForm = ({ profile, refreshProfile }: Props) => {
  const { login } = useAuth();

  // Profile State
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);

  // Password State
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  // UI State
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Auto-clear messages after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const getStrengthData = (password: string) => {
    if (!password) return { label: "", color: "bg-gray-200", width: "0%", text: "" };
    if (password.length < 6) return { label: "Weak", color: "bg-red-500", width: "33%", text: "text-red-500" };
    if (password.length < 10) return { label: "Medium", color: "bg-yellow-500", width: "66%", text: "text-yellow-500" };
    return { label: "Strong", color: "bg-green-500", width: "100%", text: "text-green-500" };
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setMessage({ type: 'error', text: "Name is required" });
    if (!validateEmail(email)) return setMessage({ type: 'error', text: "Invalid email format" });

    try {
      setLoading(true);
      const res = await updateProfile({ name, email });
      login(localStorage.getItem("token") || "", res.data.user);
      refreshProfile();
      setMessage({ type: 'success', text: "Profile details updated successfully!" });
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      setMessage({ type: 'error', text: err.response?.data?.message || "Profile update failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) return setMessage({ type: 'error', text: "Please fill in all password fields" });

    try {
      setLoading(true);
      await changePassword({ oldPassword, newPassword });
      setOldPassword("");
      setNewPassword("");
      setMessage({ type: 'success', text: "Password changed successfully!" });
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      setMessage({ type: 'error', text: err.response?.data?.message || "Password change failed" });
    } finally {
      setLoading(false);
    }
  };

  const strength = getStrengthData(newPassword);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Feedback Toast (Floating) */}
      {message && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border animate-in fade-in slide-in-from-top-4 duration-300 ${
          message.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Column: Profile Info */}
        <div className="md:col-span-7 bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 bg-green-100 rounded-xl text-green-600">
              <User className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Account Settings</h2>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="space-y-4">
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-4 py-3.5 focus:bg-white focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all"
                    placeholder="Enter your name"
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-4 py-3.5 focus:bg-white focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all"
                    placeholder="name@example.com"
                  />
                </div>
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-2xl shadow-lg shadow-gray-200 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Save Changes
            </button>
          </form>
        </div>

        {/* Right Column: Password */}
        <div className="md:col-span-5 bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 bg-blue-100 rounded-xl text-blue-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Security</h2>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-6">
            <div className="space-y-4">
              <div className="group relative">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Current Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showOldPass ? "text" : "password"}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-12 py-3.5 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowOldPass(!showOldPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500"
                  >
                    {showOldPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="group relative">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showNewPass ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-12 py-3.5 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500"
                  >
                    {showNewPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                
                {/* Visual Strength Meter */}
                {newPassword && (
                  <div className="mt-3 space-y-1.5 px-1">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                      <span className={strength.text}>Security: {strength.label}</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${strength.color} transition-all duration-500`} 
                        style={{ width: strength.width }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              Update Key
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;