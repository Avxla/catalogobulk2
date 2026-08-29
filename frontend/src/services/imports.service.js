import api from './api'

export default {
  async crear(formData) {
    const response = await api.post('/imports', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },
  async listar() {
    const response = await api.get('/imports')
    return response.data
  },
  async obtener(id) {
    const response = await api.get(`/imports/${id}`)
    return response.data
  }
}