import api from '../plugins/api'

export default {
  async login(credentials) {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },

  async registrar(userData) {
    const response = await api.post('/auth/register', userData)
    return response.data
  },

  logout() {
    localStorage.removeItem('token')
  }
}