import api from './api'

export default {
  async listar() {
    const response = await api.get('/categorias')
    return response.data
  },
  async obtener(id) {
    const response = await api.get(`/categorias/${id}`)
    return response.data
  },
  async crear(data) {
    const response = await api.post('/categorias', data)
    return response.data
  },
  async actualizar(id, data) {
    const response = await api.put(`/categorias/${id}`, data)
    return response.data
  },
  async eliminar(id) {
    const response = await api.delete(`/categorias/${id}`)
    return response.data
  }
}