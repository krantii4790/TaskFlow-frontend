import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

console.log('🔌 API Service Initializing...')
console.log('📍 Base URL:', API_BASE_URL)

// Create axios instance - WITHOUT /api suffix (will handle it per request)
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    const userId = localStorage.getItem('userId')
    
    // Log full URL
    const fullUrl = `${config.baseURL}${config.url}`
    console.log(`\n📤 REQUEST:`)
    console.log(`   Method: ${config.method?.toUpperCase()}`)
    console.log(`   URL: ${fullUrl}`)
    console.log(`   Params:`, config.params)
    console.log(`   Token: ${token ? '✅ Present' : '❌ Missing'}`)
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    console.error('❌ Request Interceptor Error:', error.message)
    return Promise.reject(error)
  }
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log(`\n✅ RESPONSE ${response.status}:`)
    console.log(`   Data:`, response.data)
    return response
  },
  (error) => {
    console.log(`\n❌ RESPONSE ERROR:`)
    console.log(`   Status: ${error.response?.status || 'No Status'}`)
    console.log(`   Message: ${error.message}`)
    console.log(`   Data:`, error.response?.data)
    console.log(`   URL Attempted:`, error.config?.url)
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
      localStorage.removeItem('email')
      window.location.href = '/'
    }
    
    return Promise.reject(error)
  }
)

export const api = apiClient
export default apiClient