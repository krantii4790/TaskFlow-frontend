import { create } from 'zustand'

export const usePlannerStore = create((set) => ({
  selectedDate: new Date().toISOString().split('T')[0],
  timetableDate: new Date().toISOString().split('T')[0],
  activeTab: 'dashboard',
  
  todosData: {
    '2026-01-19': [
      { id: 1, title: 'Morning Workout', status: 'DONE' },
      { id: 2, title: 'Review Documentation', status: 'PENDING' },
      { id: 3, title: 'Team Meeting', status: 'DONE' },
    ],
    '2026-01-20': [
      { id: 4, title: 'Project Planning', status: 'PENDING' },
      { id: 5, title: 'Code Review', status: 'PENDING' },
    ],
  },
  
  timetableData: {
    '2026-01-19': [
      { id: 1, taskName: 'Running', startTime: '06:00', endTime: '07:00' },
      { id: 2, taskName: 'Breakfast', startTime: '07:30', endTime: '08:00' },
      { id: 3, taskName: 'Work Session', startTime: '09:00', endTime: '12:00' },
      { id: 4, taskName: 'Lunch Break', startTime: '12:00', endTime: '13:00' },
      { id: 5, taskName: 'Coding', startTime: '14:00', endTime: '17:00' },
    ],
    '2026-01-20': [
      { id: 6, taskName: 'Gym', startTime: '06:00', endTime: '07:30' },
      { id: 7, taskName: 'Meeting', startTime: '10:00', endTime: '11:30' },
    ],
  },

  // Setters
  setSelectedDate: (date) => set({ selectedDate: date }),
  setTimetableDate: (date) => set({ timetableDate: date }),
  setActiveTab: (tab) => set({ activeTab: tab }),

  // Todo Actions
  addTodo: (date, title) => set((state) => ({
    todosData: {
      ...state.todosData,
      [date]: [
        ...(state.todosData[date] || []),
        {
          id: Date.now(),
          title,
          status: 'PENDING',
        },
      ],
    },
  })),

  toggleTodo: (date, id) => set((state) => ({
    todosData: {
      ...state.todosData,
      [date]: state.todosData[date].map(t =>
        t.id === id ? { ...t, status: t.status === 'DONE' ? 'PENDING' : 'DONE' } : t
      ),
    },
  })),

  deleteTodo: (date, id) => set((state) => ({
    todosData: {
      ...state.todosData,
      [date]: state.todosData[date].filter(t => t.id !== id),
    },
  })),

  // Timetable Actions
  addTimetable: (date, taskName, startTime, endTime) => set((state) => ({
    timetableData: {
      ...state.timetableData,
      [date]: [
        ...(state.timetableData[date] || []),
        {
          id: Date.now(),
          taskName,
          startTime,
          endTime,
        },
      ],
    },
  })),

  deleteTimetable: (date, id) => set((state) => ({
    timetableData: {
      ...state.timetableData,
      [date]: state.timetableData[date].filter(t => t.id !== id),
    },
  })),

  clearTimetableForDate: (date) => set((state) => {
    const newData = { ...state.timetableData }
    delete newData[date]
    return { timetableData: newData }
  }),
}))
