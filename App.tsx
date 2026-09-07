import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import AmbientBackdrop from "./components/AmbientBackdrop";
import MobileTabBar from "./components/MobileTabBar";
import Dashboard from "./pages/Dashboard";
import CalendarPage from "./pages/CalendarPage";
import DailyJournal from "./pages/DailyJournal";
import TradeLog from "./pages/TradeLog";
import Playbooks from "./pages/Playbooks";
import Reports from "./pages/Reports";
import Notebook from "./pages/Notebook";
import AddTrade from "./pages/AddTrade";
import TradeDetail from "./pages/TradeDetail";

export default function App() {
  return (
    <HashRouter>
      <AmbientBackdrop />
      <div className="min-h-screen flex bg-base relative z-10">
        <Sidebar />
        <main className="flex-1 min-w-0">
          <TopBar />
          <div className="max-w-6xl mx-auto p-6 md:p-10 pb-28 md:pb-10">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/daily-journal" element={<DailyJournal />} />
              <Route path="/trade-log" element={<TradeLog />} />
              <Route path="/playbooks" element={<Playbooks />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/notebook" element={<Notebook />} />
              <Route path="/add" element={<AddTrade />} />
              <Route path="/trade/:id" element={<TradeDetail />} />
            </Routes>
          </div>
        </main>
      </div>
      <MobileTabBar />
    </HashRouter>
  );
}
