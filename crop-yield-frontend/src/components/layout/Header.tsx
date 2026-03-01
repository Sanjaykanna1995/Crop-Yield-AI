import { useAuth } from "../../context/useAuth";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { 
  LogOut, 
  User as UserIcon, 
} from "lucide-react";

interface HeaderProps {
  title: string;
}

const Header = ({ title }: HeaderProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Simple one-line descriptions mapping
  const getDescription = (pageTitle: string) => {
    switch (pageTitle.toLowerCase()) {
      case 'predict': return 'Generate high-precision AI yield forecasts based on environmental data.';
      case 'history': return 'Review and audit your past agricultural predictions and results.';
      case 'analytics': return 'Analyze system-wide performance trends and environmental impact.';
      case 'admin panel': return 'Manage user permissions and oversee platform-wide data integrity.';
      case 'profile': return 'Update your personal credentials and security preferences.';
      default: return 'Smart Agricultural Intelligence Platform.';
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-emerald-50 shadow-[0_2px_15px_-3px_rgba(16,185,129,0.07)]">
      <div className="px-5 sm:px-10 py-3.5 flex items-center justify-between">
        
        {/* LEFT SIDE - Contextual Info */}
        <div className="flex flex-col animate-in fade-in slide-in-from-left-4 duration-500">
          <div className="flex items-center gap-2">
             <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
               {title}
             </h1>
             <div className="hidden md:block h-4 w-px bg-slate-200 mx-2" />
             <p className="hidden md:flex items-center gap-1.5 text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">
               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
               Live
             </p>
          </div>
          {/* Simple One-Line Description */}
          <p className="hidden sm:block text-[11px] text-slate-500 font-medium mt-1 tracking-tight">
            {getDescription(title)}
          </p>
        </div>

        {/* RIGHT SIDE - User Profile Area */}
        <div className="relative flex items-center gap-3" ref={dropdownRef}>
          
          <div className="hidden sm:flex flex-col items-end text-right">
            <span className="text-xs font-bold text-slate-900 leading-none capitalize">
              {user?.name || "Explorer"}
            </span>
            <span className={`text-[10px] font-black uppercase tracking-tighter mt-1 px-2 py-0.5 rounded-md ${
              user?.role === "admin" ? "bg-purple-50 text-purple-600" : "bg-emerald-50 text-emerald-600"
            }`}>
              {user?.role}
            </span>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="group flex items-center gap-2 p-0.5 rounded-full hover:ring-4 hover:ring-emerald-50 transition-all focus:outline-none"
            aria-label="User menu"
          >
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-emerald-600 to-emerald-400 text-white flex items-center justify-center font-black text-sm shadow-lg shadow-emerald-200 group-hover:scale-105 transition-transform">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
          </button>

          {/* Dropdown Menu */}
          {open && (
            <div className="absolute right-0 top-full mt-4 w-60 bg-white border border-slate-100 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] py-3 origin-top-right animate-in fade-in zoom-in-95 duration-200">
              <div className="px-5 py-4 border-b border-slate-50 mb-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Account</p>
                <p className="text-sm font-black text-slate-900 truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>

              <div className="px-2 space-y-1">
                <DropdownLink 
                  icon={UserIcon} 
                  label="View Profile" 
                  onClick={() => { navigate("/app/profile"); setOpen(false); }} 
                />
                
                <div className="h-px bg-slate-50 my-2 mx-3" />
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-500 hover:bg-rose-50 rounded-2xl transition-colors group"
                >
                  <div className="p-1.5 bg-rose-100 text-rose-600 rounded-lg group-hover:bg-rose-200 transition-colors">
                    <LogOut className="w-4 h-4" />
                  </div>
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

const DropdownLink = ({ 
  icon: Icon, 
  label, 
  onClick 
}: { 
  icon: React.ElementType, 
  label: string, 
  onClick: () => void 
}) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-2xl transition-all group"
  >
    <div className="p-1.5 bg-slate-100 text-slate-500 rounded-lg group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
      <Icon className="w-4 h-4" />
    </div>
    {label}
  </button>
);

export default Header;