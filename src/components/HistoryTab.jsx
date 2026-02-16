import { useState } from 'react'
import { Calendar, Clock, CheckCircle2, Eye } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { api } from '../services/api'

export default function HistoryTab({ darkMode }) {
  const { userId } = useAuthStore()
  const [historyStartDate, setHistoryStartDate] = useState('2026-01-19')
  const [historyEndDate, setHistoryEndDate] = useState('2026-01-20')
  const [historyData, setHistoryData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const cardClass = darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
  const inputClass = darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-black'
  const textSubtle = darkMode ? 'text-slate-400' : 'text-slate-600'

  const fetchHistory = async () => {
    try {
      setLoading(true)
      setError('')
      
      const [progressResponse, todosResponse, timetableResponse] = await Promise.all([
        api.get('/api/progress/monthly', {
          params: { userId, startDate: historyStartDate, endDate: historyEndDate }
        }).catch(() => ({ data: [] })),
        api.get('/api/todos/range', {
          params: { userId, startDate: historyStartDate, endDate: historyEndDate }
        }).catch(() => ({ data: [] })),
        api.get('/api/timetable/range', {
          params: { userId, startDate: historyStartDate, endDate: historyEndDate }
        }).catch(() => ({ data: [] }))
      ])

      const organized = {}
      
      progressResponse.data?.forEach(p => {
        if (!organized[p.date]) {
          organized[p.date] = { progress: p, todos: [], timetable: [] }
        } else {
          organized[p.date].progress = p
        }
      })

      todosResponse.data?.forEach(t => {
        if (!organized[t.date]) {
          organized[t.date] = { progress: null, todos: [], timetable: [] }
        }
        organized[t.date].todos.push(t)
      })

      timetableResponse.data?.forEach(tt => {
        if (!organized[tt.date]) {
          organized[tt.date] = { progress: null, todos: [], timetable: [] }
        }
        organized[tt.date].timetable.push(tt)
      })

      setHistoryData(organized)
    } catch (err) {
      console.error('❌ Fetch history error:', err.message)
      setError('Failed to load history')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className={`${cardClass} border rounded-2xl p-6 backdrop-blur-sm`}>
        <h2 className="text-2xl font-bold mb-6">Progress History</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Start Date</label>
            <input
              type="date"
              value={historyStartDate}
              onChange={(e) => setHistoryStartDate(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border ${inputClass}`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">End Date</label>
            <input
              type="date"
              value={historyEndDate}
              onChange={(e) => setHistoryEndDate(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border ${inputClass}`}
            />
          </div>
          <div className="flex items-end">
            <button 
              onClick={fetchHistory}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-shadow disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Eye className="w-5 h-5" /> {loading ? 'Loading...' : 'View History'}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500 text-red-500 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        {historyData && (
          <div className="space-y-8">
            {Object.entries(historyData).sort().reverse().map(([date, data]) => (
              <div key={date} className={`border-l-4 border-blue-500 pl-6 py-4 ${darkMode ? 'bg-slate-800/50' : 'bg-slate-100/50'} rounded-lg`}>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </h3>

                {data.progress && (
                  <div className="mb-6 p-3 rounded-lg bg-slate-700/30">
                    <p className={`text-sm ${textSubtle}`}>
                      Tasks: {data.progress.completedTasks}/{data.progress.totalTasks} ({data.progress.completionPercentage?.toFixed(0)}%)
                    </p>
                  </div>
                )}

                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-3 text-cyan-400">📋 Tasks</h4>
                  {data.todos.length === 0 ? (
                    <p className={textSubtle}>No tasks recorded</p>
                  ) : (
                    <div className="space-y-2">
                      {data.todos.map(todo => (
                        <div key={todo.id} className="flex items-center gap-3">
                          {todo.status === 'DONE' ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-slate-500"></div>
                          )}
                          <p className={`${todo.status === 'DONE' ? 'line-through opacity-50' : ''}`}>
                            {todo.title}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-3 text-cyan-400">⏰ Schedule</h4>
                  {data.timetable.length === 0 ? (
                    <p className={textSubtle}>No schedule recorded</p>
                  ) : (
                    <div className="space-y-2">
                      {data.timetable.sort((a, b) => a.startTime.localeCompare(b.startTime)).map(slot => (
                        <div key={slot.id} className={`flex items-center gap-3 p-3 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
                          <Clock className="w-5 h-5 text-blue-400 flex-shrink-0" />
                          <span className="font-medium">{slot.activity}</span>
                          <span className={`ml-auto text-sm ${textSubtle}`}>
                            {slot.startTime} - {slot.endTime}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}