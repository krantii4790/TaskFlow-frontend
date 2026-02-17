import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import AuthPage from "./AuthPage";
import ForgotPassword from "./pages/ForgotPassword";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import Dashboard from "./components/Dashboard";
import TodoTab from "./components/TodoTab";
import TimetableTab from "./components/TimetableTab";
import HistoryTab from "./components/HistoryTab";
import { useAuthStore } from "./store/authStore";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(true);
  const { isLoggedIn, logout } = useAuthStore();

  const bgClass = darkMode ? "bg-slate-950" : "bg-slate-50";
  const textClass = darkMode ? "text-slate-100" : "text-slate-900";

  return (
    <Routes>
      {/* NOT LOGGED IN ROUTES */}
      {!isLoggedIn() && (
        <>
          <Route
            path="/"
            element={<AuthPage darkMode={darkMode} setDarkMode={setDarkMode} />}
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </>
      )}

      {/* LOGGED IN ROUTES */}
      {isLoggedIn() && (
        <Route
          path="/*"
          element={
            <div className={`min-h-screen ${bgClass} ${textClass}`}>
              <Header
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                logout={logout}
              />
              <Navigation
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                darkMode={darkMode}
              />

              <main className="max-w-7xl mx-auto px-6 py-8">
                {activeTab === "dashboard" && (
                  <Dashboard darkMode={darkMode} />
                )}
                {activeTab === "todos" && <TodoTab darkMode={darkMode} />}
                {activeTab === "timetable" && (
                  <TimetableTab darkMode={darkMode} />
                )}
                {activeTab === "history" && (
                  <HistoryTab darkMode={darkMode} />
                )}
              </main>
            </div>
          }
        />
      )}
    </Routes>
  );
}

export default App;
