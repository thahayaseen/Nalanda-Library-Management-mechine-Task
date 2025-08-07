import api from './axios'

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
    console.log(formData,'dafda');
    
    const response = await api.put(`/books/update/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },
  async unList(id:string,status:boolean){
  const response = await api.put(`/books/update/${id}`, {listed:status})
    return response.data
  },

  async deleteBook(id: string) {
    const response = await api.delete(`/books/${id}`)
    return response.data
  },

  async getAllUsers(page: number = 1, limit: number = 10) {
    const response = await api.get('/admin/users', {
      params: { page, limit }
    })
    return response.data
  },
}
