import { useState, useEffect } from 'react'
import { Plus, Trash2, CheckCircle2 } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { api } from '../services/api'

export default function TodoTab({ darkMode }) {
  const { userId } = useAuthStore()
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const cardClass = darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
  const inputClass = darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-black'
  const textSubtle = darkMode ? 'text-slate-400' : 'text-slate-600'

  // Fetch todos when date changes
  useEffect(() => {
    if (userId) {
      fetchTodos()
    }
  }, [selectedDate, userId])

  const fetchTodos = async () => {
    try {
      setLoading(true)
      setError('')
      
      const response = await api.get('/api/todos', {
        params: {
          userId,
          date: selectedDate,
        }
      })
      
      const data = Array.isArray(response.data) ? response.data : []
      setTodos(data)
    } catch (err) {
      console.error('❌ Fetch todos error:', err.message)
      setError('Failed to load todos')
      setTodos([])
    } finally {
      setLoading(false)
    }
  }

  const handleAddTodo = async () => {
  if (!newTodo.trim()) return

  try {
    setError('')

    await api.post('/api/todos', {
      userId: Number(userId),
      date: selectedDate,
      title: newTodo,
      description: ''
    })

    setNewTodo('')
    await fetchTodos()
  } catch (err) {
    console.error('❌ Add todo error:', err.message)
    setError('Failed to add todo')
  }
}


  const handleToggleTodo = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'DONE' ? 'PENDING' : 'DONE'
      
      await api.put(`/api/todos/${id}`, null, {
        params: {
          status: newStatus,
          userId,
          date: selectedDate,
        }
      })
      
      await fetchTodos()
    } catch (err) {
      console.error('❌ Toggle todo error:', err.message)
      setError('Failed to update todo')
    }
  }

  const handleDeleteTodo = async (id) => {
    try {
      await api.delete(`/api/todos/${id}`, {
        params: {
          userId,
          date: selectedDate,
        }
      })
      
      await fetchTodos()
    } catch (err) {
      console.error('❌ Delete todo error:', err.message)
      setError('Failed to delete todo')
    }
  }

  return (
    <div className="space-y-6">
      <div className={`${cardClass} border rounded-2xl p-6 backdrop-blur-sm`}>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Select Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className={`w-full px-4 py-2 rounded-lg border ${inputClass}`}
          />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500 text-red-500 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Add New Task</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
                placeholder="Enter task name..."
                className={`flex-1 px-4 py-3 rounded-lg border ${inputClass}`}
              />
              <button 
                onClick={handleAddTodo}
                disabled={loading}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-shadow disabled:opacity-50 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" /> Add
              </button>
            </div>
          </div>

          <div className="space-y-3 mt-6">
            <h3 className="text-lg font-semibold">Tasks for {selectedDate}</h3>
            {loading ? (
              <p className={textSubtle}>Loading...</p>
            ) : todos.length === 0 ? (
              <p className={textSubtle}>No tasks for this date</p>
            ) : (
              todos.map(todo => (
                <div key={todo.id} className={`flex items-center gap-4 p-4 rounded-xl ${darkMode ? 'bg-slate-800' : 'bg-slate-100'} hover:shadow-md transition-shadow`}>
                  <button
                    onClick={() => handleToggleTodo(todo.id, todo.status)}
                    className="flex-shrink-0"
                  >
                    {todo.status === 'DONE' ? (
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-slate-500"></div>
                    )}
                  </button>
                  <div className="flex-1">
                    <p className={`font-medium ${todo.status === 'DONE' ? 'line-through opacity-50' : ''}`}>
                      {todo.title}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteTodo(todo.id)}
                    className={`p-2 rounded-lg ${darkMode ? 'hover:bg-red-900/30' : 'hover:bg-red-100'} text-red-500 transition-colors`}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
