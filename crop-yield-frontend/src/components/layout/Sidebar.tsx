import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { useState, useEffect } from "react";
import { 
  Droplets, 
  History, 
  BarChart3, 
  ShieldCheck, 
  Menu, 
  X, 
  ChevronLeft, 
  ChevronRight,
  User 
} from "lucide-react";

interface NavItemProps {
  path: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  collapsed: boolean;
  onNavigate: (path: string) => void;
}

const NavItem = ({ path, icon: Icon, label, isActive, collapsed, onNavigate }: NavItemProps) => {
  return (
    <button
      onClick={() => onNavigate(path)}
      className={`group relative flex items-center transition-all duration-300 ease-out w-full
        ${collapsed ? "justify-center h-14" : "px-6 py-4"} 
        ${isActive 
          ? "bg-emerald-500/10 text-white" 
          : "text-emerald-100/60 hover:text-white hover:bg-emerald-800/30"
        }`}
    >
      {/* Full-bleed Active Indicator */}
      {isActive && (
        <div className="absolute left-0 w-1 h-full bg-emerald-500 shadow-[0_0_15px_#10b981]" />
      )}

      <Icon className={`${collapsed ? "w-6 h-6" : "w-5 h-5"} transition-transform group-hover:scale-110 ${isActive ? "text-emerald-400" : ""}`} />

      {!collapsed && (
        <span className={`ml-4 font-medium tracking-wide text-sm whitespace-nowrap overflow-hidden transition-colors ${isActive ? "text-white font-bold" : ""}`}>
          {label}
        </span>
      )}

      {/* Floating Tooltip for Collapsed State */}
      {collapsed && (
        <div className="fixed left-20 px-3 py-2 bg-slate-900 text-white text-[11px] font-bold rounded-lg opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all pointer-events-none z-[100] shadow-2xl border border-white/10">
          {label}
        </div>
      )}
    </button>
  );
};

const Sidebar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
      if (window.innerWidth >= 768) {
        setIsMobileOpen(false);
      }
    };
    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMobile = () => setIsMobileOpen(!isMobileOpen);

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#064e3b] text-white border-b border-emerald-800/40 sticky top-0 z-50">
        <div className="flex flex-col">
          <span className="font-bold tracking-tight text-emerald-400">Crop Yield</span>
        </div>
        <button onClick={toggleMobile} className="p-2 bg-emerald-800/50 rounded-lg focus:outline-none">
          {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden transition-opacity"
          onClick={toggleMobile}
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-[70] md:relative flex flex-col h-screen bg-[#022c22] border-r border-emerald-800/30 transition-all duration-500 ease-in-out
          ${isMobileOpen ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0"}
          ${isCollapsed && !isMobileOpen ? "md:w-20" : "md:w-64"}`}
      >
        {/* Brand Section */}
        <div className={`flex items-center h-20 px-6 mb-4 ${isCollapsed ? "justify-center" : "justify-between"}`}>
          {(!isCollapsed || isMobileOpen) && (
            <div className="flex flex-col animate-in fade-in slide-in-from-left-4">
              <h2 className="text-lg font-black tracking-tighter text-white">
                CROP<span className="text-emerald-400">YIELD</span>
              </h2>
              <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-emerald-500/70 font-bold">
                <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                Intelligence
              </div>
            </div>
          )}
          
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex p-1.5 rounded-lg bg-emerald-900/40 border border-emerald-700/30 text-emerald-100 hover:bg-emerald-800 transition-colors focus:outline-none"
            aria-label="Toggle Sidebar"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col flex-1 overflow-y-auto pt-2 scrollbar-none">
          <NavItem 
            path="/app/dashboard" 
            icon={Droplets} 
            label="Predict Yield" 
            isActive={location.pathname === "/app/dashboard"} 
            collapsed={isCollapsed} 
            onNavigate={(p) => { navigate(p); setIsMobileOpen(false); }} 
          />
          <NavItem 
            path="/app/history" 
            icon={History} 
            label="Prediction History" 
            isActive={location.pathname === "/app/history"} 
            collapsed={isCollapsed} 
            onNavigate={(p) => { navigate(p); setIsMobileOpen(false); }} 
          />
          <NavItem 
            path="/app/analytics" 
            icon={BarChart3} 
            label="System Analytics" 
            isActive={location.pathname === "/app/analytics"} 
            collapsed={isCollapsed} 
            onNavigate={(p) => { navigate(p); setIsMobileOpen(false); }} 
          />

          {user?.role === "admin" && (
            <div className="mt-4 pt-4 border-t border-emerald-800/30">
              <NavItem 
                path="/app/admin" 
                icon={ShieldCheck} 
                label="Admin Console" 
                isActive={location.pathname === "/app/admin"} 
                collapsed={isCollapsed} 
                onNavigate={(p) => { navigate(p); setIsMobileOpen(false); }} 
              />
            </div>
          )}
        </nav>

        {/* User Footer */}
        <div className="mt-auto p-4 border-t border-emerald-800/30 bg-black/10">
          <div className={`flex items-center gap-3 ${isCollapsed ? "justify-center" : ""}`}>
            <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <User size={20} />
            </div>
            {(!isCollapsed || isMobileOpen) && (
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-white truncate">{user?.name || "Guest User"}</p>
                <p className="text-[10px] text-emerald-500/80 font-medium uppercase tracking-tight truncate">
                  {user?.role || "Explorer"}
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;