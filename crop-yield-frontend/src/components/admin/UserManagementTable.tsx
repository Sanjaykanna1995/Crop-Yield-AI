import { useEffect, useState } from "react";
import { 
  ShieldCheck, 
  User as UserIcon, 
  Trash2, 
  Mail,
  UserCog,
  Search,
  AlertCircle,
  X
} from "lucide-react";
import {
  getAllUsers,
  deleteUser,
  updateUserRole,
} from "../../api/admin.api";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const UserManagementTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      if (Array.isArray(data)) {
        setUsers(data);
        setError(null);
      }
    } catch {
      setError("Failed to synchronize user directory. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Permanent action: Delete this user account?")) return;
    try {
      await deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch {
      setError("System error: Could not remove user.");
    }
  };

  const handleToggleRole = async (user: User) => {
    const newRole = user.role === "admin" ? "user" : "admin";
    try {
      await updateUserRole(user.id, newRole);
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, role: newRole } : u));
    } catch {
      setError("Role update failed. Please check network connection.");
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <UserTableSkeleton />;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Error Alert Banner */}
      {error && (
        <div className="bg-rose-50 border-b border-rose-100 p-4 flex items-center justify-between animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3 text-rose-600 text-sm font-medium">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
          <button onClick={() => setError(null)} className="text-rose-400 hover:text-rose-600 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header & Search */}
      <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">User Management</h2>
          <p className="text-sm text-slate-500">Manage permissions and account access</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Search directory..."
            className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all w-full md:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="text-left px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest uppercase">User Details</th>
              <th className="text-left px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest uppercase">Email Address</th>
              {/* RECTIFIED: Removed text-left to fix CSS conflict with text-center */}
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center uppercase">Security Role</th>
              <th className="text-right px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="group hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${user.role === 'admin' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-600'}`}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-semibold text-slate-700">{user.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <Mail className="w-3.5 h-3.5" />
                    {user.email}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                    user.role === "admin" 
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                      : "bg-slate-100 text-slate-500 border border-slate-200"
                  }`}>
                    {user.role === "admin" && <ShieldCheck className="w-3 h-3" />}
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end items-center gap-2">
                    <button 
                      onClick={() => handleToggleRole(user)}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                    >
                      <UserCog className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(user.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && (
        <div className="p-12 text-center">
          <div className="inline-flex p-4 bg-slate-50 rounded-full mb-4">
            <UserIcon className="w-8 h-8 text-slate-300" />
          </div>
          <p className="text-slate-500 font-medium">No users found matching your search.</p>
        </div>
      )}
    </div>
  );
};

const UserTableSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden p-6">
    <div className="h-8 w-48 bg-slate-100 rounded-lg animate-pulse mb-8" />
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-12 w-full bg-slate-50 rounded-xl animate-pulse" />
      ))}
    </div>
  </div>
);

export default UserManagementTable;