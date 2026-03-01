import { useState, useEffect } from 'react'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
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
    streak: 0,
  })

  const [weeklyData, setWeeklyData] = useState([])
  const [monthlyData, setMonthlyData] = useState([])

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true)
        setError('')

        // Fetch all dashboard data in parallel
        const [summaryRes, weeklyRes, monthlyRes] = await Promise.all([
          api.get('/api/dashboard/summary', { params: { userId } }),
          api.get('/api/dashboard/weekly', { params: { userId } }),
          api.get('/api/dashboard/monthly', { params: { userId } }),
        ])

        setSummary(summaryRes.data)

        // Map weekly progress data - backend returns list of Progress objects
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        const mappedWeekly = (weeklyRes.data.dailyProgress || []).map((p, i) => ({
          date: days[i] || `Day ${i + 1}`,
          completion: Math.round(p.completionPercentage || 0),
        }))

        // If no data from backend, show empty state
        setWeeklyData(mappedWeekly.length > 0 ? mappedWeekly : days.map(d => ({ date: d, completion: 0 })))

        // Map monthly performance data
        const mappedMonthly = (monthlyRes.data.weeklyBreakdown || []).map((w, i) => ({
          week: `Week ${i + 1}`,
          tasks: w.totalTasks || 0,
          completed: w.completedTasks || 0,
        }))

        setMonthlyData(mappedMonthly.length > 0 ? mappedMonthly : [
          { week: 'Week 1', tasks: 0, completed: 0 },
          { week: 'Week 2', tasks: 0, completed: 0 },
          { week: 'Week 3', tasks: 0, completed: 0 },
          { week: 'Week 4', tasks: 0, completed: 0 },
        ])

      } catch (err) {
        console.error('❌ Fetch dashboard error:', err.message)
        setError('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchAll()
    }
  }, [userId])

  const pieData = [
    { name: 'Completed', value: summary.completedTasks },
    { name: 'Pending', value: Math.max(0, summary.totalTasks - summary.completedTasks) },
  ]

  const cardClass = darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
  const textSubtle = darkMode ? 'text-slate-400' : 'text-slate-600'

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className={`${textSubtle} text-lg animate-pulse`}>Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500 text-red-500 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats Cards */}
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
              <p className="text-4xl font-bold">{summary.streak || 0}</p>
            </div>
            <Flame className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Weekly Progress Line Chart - now uses real API data */}
        <div className={`${cardClass} border rounded-2xl p-6 backdrop-blur-sm`}>
          <h2 className="text-xl font-bold mb-4">Weekly Progress</h2>
          {weeklyData.every(d => d.completion === 0) ? (
            <div className={`flex items-center justify-center h-[300px] ${textSubtle}`}>
              No progress data for this week yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e2e8f0'} />
                <XAxis
                  dataKey="date"   // ✅ FIXED: was missing dataKey, causing 0-6 index labels
                  stroke={darkMode ? '#94a3b8' : '#64748b'}
                />
                <YAxis
                  domain={[0, 100]}
                  stroke={darkMode ? '#94a3b8' : '#64748b'}
                />
                <Tooltip
                  formatter={(value) => [`${value}%`, 'Completion']}
                  contentStyle={{
                    backgroundColor: darkMode ? '#1e293b' : '#f8fafc',
                    border: 'none',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="completion"
                  stroke="#60a5fa"
                  strokeWidth={3}
                  dot={{ fill: '#60a5fa', r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Today's Status Pie Chart */}
        <div className={`${cardClass} border rounded-2xl p-6 backdrop-blur-sm`}>
          <h2 className="text-xl font-bold mb-4">Today's Status</h2>
          {summary.totalTasks === 0 ? (
            <div className={`flex items-center justify-center h-[300px] ${textSubtle}`}>
              No tasks added for today
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#f97316" />
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? '#1e293b' : '#f8fafc',
                    border: 'none',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Monthly Performance Bar Chart - now uses real API data */}
        <div className={`${cardClass} border rounded-2xl p-6 backdrop-blur-sm lg:col-span-2`}>
          <h2 className="text-xl font-bold mb-4">Monthly Performance</h2>
          {monthlyData.every(d => d.tasks === 0) ? (
            <div className={`flex items-center justify-center h-[300px] ${textSubtle}`}>
              No monthly data available yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e2e8f0'} />
                <XAxis
                  dataKey="week"   // ✅ FIXED: was missing dataKey, causing 0-3 index labels
                  stroke={darkMode ? '#94a3b8' : '#64748b'}
                />
                <YAxis stroke={darkMode ? '#94a3b8' : '#64748b'} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? '#1e293b' : '#f8fafc',
                    border: 'none',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="completed" name="Completed" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                <Bar dataKey="tasks" name="Total Tasks" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  )
}