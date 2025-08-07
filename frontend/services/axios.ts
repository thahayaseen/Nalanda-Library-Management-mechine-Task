import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL+'/api' || 'http://localhost:4000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
export default api