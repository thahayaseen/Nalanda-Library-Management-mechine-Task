import api from './axios'

export const authService = {
  async login(email: string, password: string) {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  },

  async register(username: string, email: string, password: string) {
    const response = await api.post('/auth/signup', { username, email, password })
    return response.data
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me')
    return response.data
  },
}
