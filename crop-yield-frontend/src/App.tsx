import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import DashboardLayout from "./pages/Dashboard";
import PredictForm from "./components/predict/PredictForm";
import HistoryTable from "./components/history/HistoryTable";
import Analytics from "./pages/Analytics";
import Profile from "./pages/profile";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import Home from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />

        {/* App Layout */}
        <Route path="/app" element={<DashboardLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<PredictForm />} />
          <Route path="history" element={<HistoryTable />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="profile" element={<Profile />} />
          <Route path="admin" element={<Admin />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;