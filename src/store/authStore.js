import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  token: localStorage.getItem('token') || null,
  userId: localStorage.getItem('userId') || null,
  email: localStorage.getItem('email') || null,

  setAuth: (token, userId, email) => {
    localStorage.setItem('token', token)
    localStorage.setItem('userId', userId)
    localStorage.setItem('email', email)
    set({ token, userId, email })
  },

  isLoggedIn: () => {
    const token = localStorage.getItem('token')
    return !!token
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('email')
    set({ token: null, userId: null, email: null })
  },
}))