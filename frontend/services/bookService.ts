import api from './axios'

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
