import { LogOut } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

export default function Header({ darkMode, setDarkMode, logout }) {
  const { email } = useAuthStore()

  const handleLogout = () => {
    logout()
    window.location.reload()
  }

  return (
    <header className={`border-b ${darkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-white/50'} backdrop-blur-xl sticky top-0 z-50`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Daily Planner Pro
          </h1>
          <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{email}</p>
        </div>
        <div className="flex gap-4 items-center">
          <button 
            onClick={() => setDarkMode(!darkMode)} 
            className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/30 flex items-center gap-2"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </div>
    </header>
  )
}