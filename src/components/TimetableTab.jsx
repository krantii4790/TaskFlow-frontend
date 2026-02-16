// ============================================================
// FILE: src/components/TimetableTab.jsx - FINAL WORKING VERSION
// ============================================================
import { useState, useEffect } from 'react'
import { Plus, Trash2, Clock } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { api } from '../services/api'

export default function TimetableTab({ darkMode }) {
  const { userId } = useAuthStore()
  const [timetableDate, setTimetableDate] = useState(new Date().toISOString().split('T')[0])
  const [timetables, setTimetables] = useState([])
  const [newTaskName, setNewTaskName] = useState('')
  const [newStartTime, setNewStartTime] = useState('08:00')
  const [newEndTime, setNewEndTime] = useState('09:00')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const cardClass = darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
  const inputClass = darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-black'
  const textSubtle = darkMode ? 'text-slate-400' : 'text-slate-600'

  useEffect(() => {
    if (userId) {
      fetchTimetables()
    }
  }, [timetableDate, userId])

  const fetchTimetables = async () => {
    try {
      setLoading(true)
      setError('')
      
      const response = await api.get('/api/timetable', {
  params: {
    userId: Number(userId),
    date: timetableDate
  }
})



      
      const data = Array.isArray(response.data) ? response.data : []
      setTimetables(data)
    } catch (err) {
      console.error('❌ Fetch timetables error:', err.message)
      setError('Failed to load timetable')
      setTimetables([])
    } finally {
      setLoading(false)
    }
  }

  const handleAddTimetable = async () => {
  if (!newTaskName.trim()) return

  try {
    setError('')

    await api.post('/api/timetable', {
      userId: Number(userId),
      date: timetableDate,
      activity: newTaskName,
      startTime: newStartTime,
      endTime: newEndTime
    })

    setNewTaskName('')
    setNewStartTime('08:00')
    setNewEndTime('09:00')

    await fetchTimetables()
  } catch (err) {
    console.error('❌ Add timetable error:', err.message)
    setError('Failed to add timetable entry')
  }
}


  const handleDeleteTimetable = async (id) => {
    try {
      await api.delete(`/api/timetable/${id}`)
      await fetchTimetables()
    } catch (err) {
      console.error('❌ Delete timetable error:', err.message)
      setError('Failed to delete timetable entry')
    }
  }

  return (
    <div className={`${cardClass} border rounded-2xl p-6 backdrop-blur-sm space-y-6`}>
      <div>
        <label className="block text-sm font-medium mb-2">Select Timetable Date</label>
        <p className={`text-xs mb-3 ${textSubtle}`}>📌 Plan ahead for tomorrow or any future date. Auto-clears at midnight.</p>
        <input
          type="date"
          value={timetableDate}
          onChange={(e) => setTimetableDate(e.target.value)}
          className={`w-full px-4 py-2 rounded-lg border ${inputClass}`}
        />
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500 text-red-500 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className={`border-t ${darkMode ? 'border-slate-800' : 'border-slate-200'} pt-6`}>
        <h3 className="text-lg font-semibold mb-4">Add Activity to Schedule</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Task Name</label>
            <input
              type="text"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              placeholder="e.g., Running, Meeting, Coding..."
              className={`w-full px-4 py-2 rounded-lg border ${inputClass}`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Start Time</label>
              <input
                type="time"
                value={newStartTime}
                onChange={(e) => setNewStartTime(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${inputClass}`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">End Time</label>
              <input
                type="time"
                value={newEndTime}
                onChange={(e) => setNewEndTime(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${inputClass}`}
              />
            </div>
          </div>

          <button 
            onClick={handleAddTimetable}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-shadow disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" /> Add to Schedule
          </button>
        </div>
      </div>

      <div className={`border-t ${darkMode ? 'border-slate-800' : 'border-slate-200'} pt-6`}>
        <h3 className="text-lg font-semibold mb-4">Schedule for {timetableDate}</h3>
        {loading ? (
          <p className={textSubtle}>Loading...</p>
        ) : timetables.length === 0 ? (
          <p className={textSubtle}>No activities scheduled for this date</p>
        ) : (
          <div className="space-y-3">
            {timetables.sort((a, b) => a.startTime.localeCompare(b.startTime)).map(slot => {
              const start = parseInt(slot.startTime.split(':')[0])
              const end = parseInt(slot.endTime.split(':')[0])
              const duration = end - start
              return (
                <div key={slot.id} className={`flex items-center gap-4 p-4 rounded-xl ${darkMode ? 'bg-slate-800' : 'bg-slate-100'} hover:shadow-md transition-shadow`}>
                  <Clock className="w-6 h-6 text-blue-500 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-bold text-lg">{slot.activity}</p>
                    <p className={`text-sm ${textSubtle}`}>{slot.startTime} - {slot.endTime}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-lg ${darkMode ? 'bg-blue-900/30' : 'bg-blue-100'} text-blue-400 text-sm font-medium`}>
                    {duration}h
                  </div>
                  <button
                    onClick={() => handleDeleteTimetable(slot.id)}
                    className={`p-2 rounded-lg ${darkMode ? 'hover:bg-red-900/30' : 'hover:bg-red-100'} text-red-500 transition-colors`}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}