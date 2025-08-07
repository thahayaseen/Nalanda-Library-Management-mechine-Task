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

export const borrowService = {
  async borrowBook(bookId: string) {
    const response = await api.post('/book/'+bookId, { bookId })
    return response.data
  },

  async returnBook(bookId: string) {
    const response = await api.post('/return-book', { bookId })
    return response.data
  },

  async getUserBorrowedBooks(page:number) {
    const response = await api.get('/my-records?page='+page)
    return response.data
  },
}
