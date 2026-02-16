// ============================================================
// FILE: src/AuthPage.jsx - COMPLETE FIX
// ============================================================
import { useState } from 'react'
import axios from 'axios'
import { useAuthStore } from './store/authStore'

export default function AuthPage({ darkMode, setDarkMode }) {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const { setAuth } = useAuthStore()

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      console.log('AuthPage - API Base URL:', API_BASE_URL)
      console.log('AuthPage - Is Login:', isLogin)
      console.log('AuthPage - Form Data:', { ...formData, password: '***' })

      let response

      if (isLogin) {
        // LOGIN
        const url = `${API_BASE_URL}/api/auth/login`
        console.log('AuthPage - Login URL:', url)

        response = await axios.post(url, {
          email: formData.email,
          password: formData.password,
        }, {
          headers: {
            'Content-Type': 'application/json',
          }
        })

        console.log('AuthPage - Login Response:', response.data)
      } else {
        // REGISTER
        const url = `${API_BASE_URL}/api/auth/register`
        console.log('AuthPage - Register URL:', url)

        response = await axios.post(url, {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }, {
          headers: {
            'Content-Type': 'application/json',
          }
        })

        console.log('AuthPage - Register Response:', response.data)
      }

      if (response.data && response.data.token && response.data.userId) {
        const { token, userId, email } = response.data
        console.log('AuthPage - Setting auth with token:', token.substring(0, 20) + '...')
        setAuth(token, userId, email || formData.email)
        // Page will reload automatically
        setTimeout(() => {
          window.location.reload()
        }, 500)
      } else {
        setError('Invalid response from server. Please try again.')
      }
    } catch (err) {
      console.error('AuthPage - Full Error:', err)
      console.error('AuthPage - Error Response:', err.response?.data)
      console.error('AuthPage - Error Status:', err.response?.status)
      console.error('AuthPage - Error Message:', err.message)

      if (err.response?.status === 400) {
        setError(err.response.data?.message || 'Email already exists or invalid input')
      } else if (err.response?.status === 401) {
        setError('Invalid email or password')
      } else if (err.response?.status === 500) {
        setError('Server error. Please check if backend is running.')
      } else if (err.message === 'Network Error' || err.code === 'ERR_NETWORK') {
        setError('Cannot connect to server. Is backend running on http://localhost:8080?')
      } else {
        setError(err.response?.data?.message || err.message || 'An error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  const cardClass = darkMode ? 'bg-white' : 'bg-white'
  const inputClass = darkMode ? 'bg-slate-50 border-slate-300 text-black' : 'bg-slate-50 border-slate-300 text-black'
  const textSubtle = darkMode ? 'text-slate-600' : 'text-slate-600'

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-950' : 'bg-slate-50'} flex items-center justify-center px-4`}>
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Daily Planner
          </h1>
          <button 
            onClick={() => setDarkMode(!darkMode)} 
            className={`px-3 py-2 rounded-lg text-lg ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>

        <div className={`${cardClass} rounded-2xl p-8 border ${darkMode ? 'border-slate-200' : 'border-slate-200'}`}>
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#000' }}>
            {isLogin ? 'Login' : 'Register'}
          </h2>

          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#000' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required={!isLogin}
                  placeholder="Your Name"
                  className={`w-full px-4 py-2 rounded-lg border ${inputClass}`}
                  style={{ color: '#000' }}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#000' }}>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your@email.com"
                className={`w-full px-4 py-2 rounded-lg border ${inputClass}`}
                style={{ color: '#000' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#000' }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className={`w-full px-4 py-2 rounded-lg border ${inputClass}`}
                style={{ color: '#000' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-2 rounded-lg font-bold hover:shadow-lg transition-shadow disabled:opacity-50"
            >
              {loading ? 'Processing...' : isLogin ? 'Login' : 'Register'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className={textSubtle}>
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin)
                  setError('')
                  setFormData({ name: '', email: '', password: '' })
                }}
                className="text-blue-500 hover:text-blue-400 font-medium"
              >
                {isLogin ? 'Register' : 'Login'}
              </button>
            </p>
          </div>
        </div>

        {/* Debug Info - Remove in production */}
        <div className={`mt-4 p-3 rounded-lg text-xs ${darkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-600'}`}>
          <p>Debug Info:</p>
          <p>API URL: {API_BASE_URL}</p>
          <p>Mode: {isLogin ? 'Login' : 'Register'}</p>
        </div>
      </div>
    </div>
  )
}