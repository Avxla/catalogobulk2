import api from './api'

export default {
  async listar() {
    const response = await api.get('/productos')
    return response.data
  },
  async obtenerEstadisticas() {
    const response = await api.get('/productos/stats')
    return response.data
  },
  async obtener(id) {
    const response = await api.get(`/productos/${id}`)
    return response.data
  },
  async crear(data) {
    const response = await api.post('/productos', data)
    return response.data
  },
  async actualizar(id, data) {
    const response = await api.put(`/productos/${id}`, data)
    return response.data
  },
  async eliminar(id) {
    const response = await api.delete(`/productos/${id}`)
    return response.data
  }
}