import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import { Outlet, useLocation } from "react-router-dom";

const Dashboard = () => {
  const location = useLocation();

  const getTitle = () => {
    if (location.pathname.includes("history")) return "Prediction History";
    if (location.pathname.includes("analytics")) return "Analytics Overview";
    if (location.pathname.includes("admin")) return "Admin Panel";
    if (location.pathname.includes("profile")) return "Profile Settings"; // Added profile just in case!
    return "Predict Crop Yield";
  };

  return (
    // 1. Locked screen height to prevent double scrollbars, added custom text selection colors
    <div className="flex h-screen w-full overflow-hidden bg-white selection:bg-emerald-100 selection:text-emerald-900 font-sans">
      
      <Sidebar />

      {/* 2. Main Column */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        
        <Header title={getTitle()} />

        {/* 3. Scrollable area WITH THE SOFT THEME BACKGROUND */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth bg-gradient-to-br from-emerald-50/80 via-white to-emerald-100/40">
          
          {/* 4. Kept your padding, but added a smooth fade-in animation */}
          <div className="px-4 sm:px-8 lg:px-12 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="max-w-7xl mx-auto space-y-8">
              
              {/* Your nested pages (PredictForm, History, etc.) will render here */}
              <Outlet />
              
            </div>
          </div>
          
        </main>

      </div>

    </div>
  );
};

export default Dashboard;