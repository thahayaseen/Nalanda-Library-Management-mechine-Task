import api from './axios'

export const borrowService = {
  async borrowBook(bookId: string) {
    const response = await api.post('/buy-book/'+bookId, { bookId })
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
