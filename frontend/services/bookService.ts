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

export const bookService = {
  async getAllBooks(page: number = 1, limit: number = 12, search: string = '', genre: string = '') {
    const response = await api.get('/books', {
      params: { page, limit, search,  }
    })
    return response.data
  },

  async getBookById(id: string) {
    const response = await api.get(`/books/${id}`)
    return response.data
  },

  async getTopBooks() {
    const response = await api.get('/books/most-borrowd')
    console.log(response);
    
    return response.data
  },

  async createBook(bookData: any) {
    const response = await api.post('/books', bookData)
    return response.data
  },
}
