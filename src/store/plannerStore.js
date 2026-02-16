import { create } from 'zustand'
import { todoAPI, timetableAPI, progressAPI } from '../services/api'

export const usePlannerStore = create((set) => ({
  selectedDate: new Date().toISOString().split('T')[0],
  timetableDate: new Date().toISOString().split('T')[0],
  activeTab: 'dashboard',

  todos: [],
  timetable: [],
  history: [],

  setSelectedDate: (date) => set({ selectedDate: date }),
  setTimetableDate: (date) => set({ timetableDate: date }),
  setActiveTab: (tab) => set({ activeTab: tab }),

  /* ================= TODOS ================= */

  fetchTodos: async (date) => {
    const userId = localStorage.getItem('userId')
    if (!userId) return
    const res = await todoAPI.getTodos(userId, date)
    set({ todos: res.data })
  },

  addTodo: async (date, title, description = '') => {
    if (!title.trim()) return
    const userId = localStorage.getItem('userId')
    await todoAPI.createTodo(userId, date, title, description)
    const res = await todoAPI.getTodos(userId, date)
    set({ todos: res.data })
  },

  updateTodoStatus: async (id, status, date) => {
    const userId = localStorage.getItem('userId')
    await todoAPI.updateTodo(id, status, userId, date)
    const res = await todoAPI.getTodos(userId, date)
    set({ todos: res.data })
  },

  deleteTodo: async (id, date) => {
    const userId = localStorage.getItem('userId')
    await todoAPI.deleteTodo(id, userId, date)
    const res = await todoAPI.getTodos(userId, date)
    set({ todos: res.data })
  },

  /* ================= TIMETABLE ================= */

  fetchTimetable: async (date) => {
    const userId = localStorage.getItem('userId')
    const res = await timetableAPI.getTimetable(userId, date)
    set({ timetable: res.data })
  },

  addTimetable: async (date, activity, startTime, endTime) => {
    if (!activity.trim()) return
    const userId = localStorage.getItem('userId')
    await timetableAPI.createTimetable(userId, date, activity, startTime, endTime)
    const res = await timetableAPI.getTimetable(userId, date)
    set({ timetable: res.data })
  },

  deleteTimetable: async (id, date) => {
    const userId = localStorage.getItem('userId')
    await timetableAPI.deleteTimetable(id)
    const res = await timetableAPI.getTimetable(userId, date)
    set({ timetable: res.data })
  },

  /* ================= HISTORY ================= */

  fetchHistory: async (startDate, endDate) => {
    const userId = localStorage.getItem('userId')
    const res = await progressAPI.getMonthly(userId, startDate, endDate)
    set({ history: res.data })
  },
}))
