import { useState, useEffect } from 'react'
import AuthPage from './AuthPage'
import Header from './components/Header'
import Navigation from './components/Navigation'
import Dashboard from './components/Dashboard'
import TodoTab from './components/TodoTab'
import TimetableTab from './components/TimetableTab'
import HistoryTab from './components/HistoryTab'
import { useAuthStore } from './store/authStore'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [darkMode, setDarkMode] = useState(true)
  const { isLoggedIn, logout } = useAuthStore()

  const bgClass = darkMode ? 'bg-slate-950' : 'bg-slate-50'
  const textClass = darkMode ? 'text-slate-100' : 'text-slate-900'

  if (!isLoggedIn()) {
    return <AuthPage darkMode={darkMode} setDarkMode={setDarkMode} />
  }

  return (
    <div className={`min-h-screen ${bgClass} ${textClass} transition-colors duration-300`}>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} logout={logout} />
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} darkMode={darkMode} />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'dashboard' && <Dashboard darkMode={darkMode} />}
        {activeTab === 'todos' && <TodoTab darkMode={darkMode} />}
        {activeTab === 'timetable' && <TimetableTab darkMode={darkMode} />}
        {activeTab === 'history' && <HistoryTab darkMode={darkMode} />}
      </main>
    </div>
  )
}

export default App
