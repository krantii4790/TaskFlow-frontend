import { useState, useEffect } from 'react'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Flame } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { api } from '../services/api'

export default function Dashboard({ darkMode }) {
  const { userId } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [summary, setSummary] = useState({
    totalTasks: 0,
    completedTasks: 0,
    completionPercentage: 0,
  })

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true)
        setError('')
        
        const response = await api.get('/api/dashboard/summary', {
          params: { userId }
        })
        
        setSummary(response.data)
      } catch (err) {
        console.error('❌ Fetch dashboard error:', err.message)
        setError('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchSummary()
    }
  }, [userId])

  const progressData = [
    { date: 'Mon', completion: 75 },
    { date: 'Tue', completion: 82 },
    { date: 'Wed', completion: 68 },
    { date: 'Thu', completion: 90 },
    { date: 'Fri', completion: 85 },
    { date: 'Sat', completion: 70 },
    { date: 'Sun', completion: 88 },
  ]

  const monthlyData = [
    { week: 'Week 1', tasks: 45, completed: 38 },
    { week: 'Week 2', tasks: 52, completed: 46 },
    { week: 'Week 3', tasks: 48, completed: 42 },
    { week: 'Week 4', tasks: 55, completed: 50 },
  ]

  const pieData = [
    { name: 'Completed', value: summary.completedTasks },
    { name: 'Pending', value: Math.max(0, summary.totalTasks - summary.completedTasks) },
  ]

  const cardClass = darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
  const textSubtle = darkMode ? 'text-slate-400' : 'text-slate-600'

  if (loading) {
    return <div className={textSubtle}>Loading dashboard...</div>
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500 text-red-500 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`${cardClass} border rounded-2xl p-6 backdrop-blur-sm`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`${textSubtle} text-sm font-medium mb-2`}>Today's Tasks</p>
              <p className="text-4xl font-bold">{summary.totalTasks}</p>
            </div>
            <div className="text-3xl">✅</div>
          </div>
        </div>
        
        <div className={`${cardClass} border rounded-2xl p-6 backdrop-blur-sm`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`${textSubtle} text-sm font-medium mb-2`}>Completed</p>
              <p className="text-4xl font-bold">{summary.completedTasks}</p>
            </div>
            <div className="text-3xl">🎯</div>
          </div>
        </div>

        <div className={`${cardClass} border rounded-2xl p-6 backdrop-blur-sm`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`${textSubtle} text-sm font-medium mb-2`}>Completion %</p>
              <p className="text-4xl font-bold">{(summary.completionPercentage || 0).toFixed(0)}%</p>
            </div>
            <div className="text-3xl">📊</div>
          </div>
        </div>

        <div className={`${cardClass} border rounded-2xl p-6 backdrop-blur-sm`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`${textSubtle} text-sm font-medium mb-2`}>Streak</p>
              <p className="text-4xl font-bold">12</p>
            </div>
            <Flame className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`${cardClass} border rounded-2xl p-6 backdrop-blur-sm`}>
          <h2 className="text-xl font-bold mb-4">Weekly Progress</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e2e8f0'} />
              <XAxis stroke={darkMode ? '#94a3b8' : '#64748b'} />
              <YAxis stroke={darkMode ? '#94a3b8' : '#64748b'} />
              <Tooltip contentStyle={{ backgroundColor: darkMode ? '#1e293b' : '#f8fafc', border: 'none', borderRadius: '8px' }} />
              <Line type="monotone" dataKey="completion" stroke="#60a5fa" strokeWidth={3} dot={{ fill: '#60a5fa', r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className={`${cardClass} border rounded-2xl p-6 backdrop-blur-sm`}>
          <h2 className="text-xl font-bold mb-4">Today's Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value">
                <Cell fill="#10b981" />
                <Cell fill="#f97316" />
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: darkMode ? '#1e293b' : '#f8fafc', border: 'none', borderRadius: '8px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className={`${cardClass} border rounded-2xl p-6 backdrop-blur-sm lg:col-span-2`}>
          <h2 className="text-xl font-bold mb-4">Monthly Performance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e2e8f0'} />
              <XAxis stroke={darkMode ? '#94a3b8' : '#64748b'} />
              <YAxis stroke={darkMode ? '#94a3b8' : '#64748b'} />
              <Tooltip contentStyle={{ backgroundColor: darkMode ? '#1e293b' : '#f8fafc', border: 'none', borderRadius: '8px' }} />
              <Bar dataKey="completed" fill="#06b6d4" />
              <Bar dataKey="tasks" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}