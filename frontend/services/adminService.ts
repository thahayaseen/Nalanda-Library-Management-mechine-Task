import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL+'/api' || 'http://localhost:4000/api'
console.log(API_BASE_URL,'urls is');

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

export const adminService = {
  async getDashboardStats() {
    const response = await api.get('/admin/stats')
    return response.data
  },

  async getAllBooks(page: number = 1, limit: number = 10, search: string = '') {
    const response = await api.get('/books', {
      params: { page, limit, search }
    })
    return response.data
  },

  async createBook(formData: FormData) {
    const response = await api.post('/books/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  async updateBook(id: string, formData: FormData) {
    const response = await api.put(`/books/update/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  async deleteBook(id: string) {
    const response = await api.delete(`/admin/books/${id}`)
    return response.data
  },

  async getAllUsers(page: number = 1, limit: number = 10) {
    const response = await api.get('/admin/users', {
      params: { page, limit }
    })
    return response.data
  },
}
