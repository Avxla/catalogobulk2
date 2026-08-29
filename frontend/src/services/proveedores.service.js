import api from './api'

export default {
  async listar() {
    const response = await api.get('/proveedores')
    return response.data
  },
  async obtener(id) {
    const response = await api.get(`/proveedores/${id}`)
    return response.data
  },
  async crear(data) {
    const response = await api.post('/proveedores', data)
    return response.data
  },
  async actualizar(id, data) {
    const response = await api.put(`/proveedores/${id}`, data)
    return response.data
  },
  async eliminar(id) {
    const response = await api.delete(`/proveedores/${id}`)
    return response.data
  }
}