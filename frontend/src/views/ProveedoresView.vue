<template>
  <div class="catalog-container">
    <!-- Banner Principal -->
    <section class="hero-section">
      <div class="hero-content">
        <h2>Gestión de Proveedores</h2>
        <p>Administra la información de contacto y el directorio de tus proveedores asociados.</p>
        <div class="search-bar">
          <input type="text" placeholder="Buscar proveedor por nombre..." v-model="busqueda" />
          <button class="btn-search" @click="toggleModal(true)">+ Nuevo Proveedor</button>
        </div>
      </div>
    </section>

    <!-- Contenido Principal: Sidebar + Grilla -->
    <div class="catalog-main">
      <!-- Barra lateral con el contador -->
      <aside class="sidebar">
        <h3>Resumen</h3>
        <div class="counter-box">
          <span class="counter-label">Proveedores activos</span>
          <span class="counter-number">{{ proveedores.length }}</span>
        </div>
      </aside>

      <!-- Grilla de Proveedores -->
      <!-- Tabla de Proveedores -->
      <section class="products-section">
        <div class="section-title">
          <h3>Directorio de Proveedores</h3>
          <span class="results-count">Mostrando {{ proveedoresFiltrados.length }} de {{ proveedores.length }}</span>
        </div>

        <p v-if="loading" class="state-text">Cargando proveedores...</p>
        <p v-else-if="error" class="state-text error">{{ error }}</p>

        <div v-else class="table-container">
          <table class="styled-table">
            <thead>
              <tr>
                <th>Empresa</th>
                <th>Contacto</th>
                <th>Teléfono</th>
                <th>Correo</th>
                <th>Dirección</th>
                <th class="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="proveedor in proveedoresFiltrados" :key="proveedor._id || proveedor.id">
                <td class="font-weight-bold">
                  <div class="company-cell">
                    <span class="company-icon">🏢</span>
                    <span>{{ proveedor.nombre }}</span>
                  </div>
                </td>
                <td>{{ proveedor.contacto || 'No especificado' }}</td>
                <td>{{ proveedor.telefono || 'Sin teléfono' }}</td>
                <td>{{ proveedor.email || 'Sin correo' }}</td>
                <td>{{ proveedor.direccion || 'Sin dirección' }}</td>
                <td class="text-center">
                  <button class="btn-table-danger" @click="eliminarProveedor(proveedor._id || proveedor.id)">Eliminar</button>
                </td>
              </tr>
              <tr v-if="proveedoresFiltrados.length === 0">
                <td colspan="6" class="empty-table-state">No se encontraron proveedores registrados.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>

    <!-- Modal para crear proveedor -->
    <div v-if="showModal" class="modal-backdrop">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Registrar Nuevo Proveedor</h3>
          <button class="close-btn" @click="toggleModal(false)">&times;</button>
        </div>
        <form @submit.prevent="crearProveedor">
          <div class="form-group">
            <label>Nombre de la empresa / Proveedor</label>
            <input type="text" v-model="nuevoProveedor.nombre" placeholder="Ej. Distribuidora Global" required />
          </div>
          <div class="form-group">
            <label>Persona de contacto</label>
            <input type="text" v-model="nuevoProveedor.contacto" placeholder="Ej. Carlos Pérez" />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Teléfono</label>
              <input type="text" v-model="nuevoProveedor.telefono" placeholder="Ej. 3001234567" />
            </div>
            <div class="form-group">
              <label>Correo electrónico</label>
              <input type="email" v-model="nuevoProveedor.email" placeholder="correo@empresa.com" />
            </div>
          </div>
          <div class="form-group">
            <label>Dirección</label>
            <input type="text" v-model="nuevoProveedor.direccion" placeholder="Calle Principal #123" />
          </div>
          <div class="modal-footer">
            <button type="button" class="btn-secondary" @click="toggleModal(false)">Cancelar</button>
            <button type="submit" class="btn-primary">Guardar Proveedor</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../plugins/api'

const proveedores = ref([])
const loading = ref(true)
const error = ref(null)
const showModal = ref(false)
const busqueda = ref('')

const nuevoProveedor = ref({
  nombre: '',
  contacto: '',
  telefono: '',
  email: '',
  direccion: ''
})

const proveedoresFiltrados = computed(() => {
  if (!Array.isArray(proveedores.value)) return []
  return proveedores.value.filter(p => p.nombre && p.nombre.toLowerCase().includes(busqueda.value.toLowerCase()))
})

const obtenerProveedores = async () => {
  loading.value = true
  try {
    const response = await api.get('/proveedores')
    // Acepta tanto un arreglo directo como respuestas paginadas comunes (.docs, .data, .proveedores)
    const data = response.data
    proveedores.value = Array.isArray(data) 
      ? data 
      : (data.docs || data.data || data.proveedores || [])
  } catch (err) {
    error.value = 'Error al cargar los proveedores del servidor.'
    proveedores.value = []
  } finally {
    loading.value = false
  }
}

const toggleModal = (isOpen) => {
  showModal.value = isOpen
  if (!isOpen) {
    nuevoProveedor.value = { nombre: '', contacto: '', telefono: '', email: '', direccion: '' }
  }
}

const crearProveedor = async () => {
  try {
    await api.post('/proveedores', nuevoProveedor.value)
    toggleModal(false)
    obtenerProveedores()
  } catch (err) {
    alert('Error al crear el proveedor')
  }
}

const eliminarProveedor = async (id) => {
  if (confirm('¿Estás seguro de eliminar este proveedor?')) {
    try {
      await api.delete(`/proveedores/${id}`)
      obtenerProveedores()
    } catch (err) {
      alert('Error al eliminar el proveedor')
    }
  }
}

onMounted(() => {
  obtenerProveedores()
})
</script>

<style scoped>
.catalog-container {
  min-height: calc(100vh - 70px);
  background-color: #f4f7f6;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  display: flex;
  flex-direction: column;
}

.hero-section {
  background: linear-gradient(135deg, #2c3e50, #8e44ad);
  color: white;
  padding: 3rem 2rem;
  text-align: center;
}

.hero-content {
  max-width: 700px;
  margin: 0 auto;
}

.hero-content h2 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.hero-content p {
  font-size: 1rem;
  margin-bottom: 1.5rem;
  opacity: 0.9;
}

.search-bar {
  display: flex;
  background: white;
  padding: 5px;
  border-radius: 6px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

.search-bar input {
  flex: 1;
  border: none;
  padding: 10px 15px;
  font-size: 1rem;
  outline: none;
  border-radius: 4px;
}

.btn-search {
  background-color: #8e44ad;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  white-space: nowrap;
}

.btn-search:hover {
  background-color: #732d91;
}

.catalog-main {
  display: flex;
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
  gap: 2rem;
  flex: 1;
  width: 100%;
  box-sizing: border-box;
}

.sidebar {
  width: 250px;
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  height: fit-content;
}

.sidebar h3 {
  color: #2c3e50;
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  border-bottom: 2px solid #f4f7f6;
  padding-bottom: 0.5rem;
}

.counter-box {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 6px;
  text-align: center;
}

.counter-label {
  display: block;
  font-size: 0.85rem;
  color: #7f8c8d;
  margin-bottom: 0.3rem;
}

.counter-number {
  font-size: 1.8rem;
  font-weight: bold;
  color: #2c3e50;
}

.products-section {
  flex: 1;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-title h3 {
  color: #2c3e50;
  margin: 0;
  font-size: 1.4rem;
}

.results-count {
  color: #7f8c8d;
  font-size: 0.9rem;
}

.public-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.5rem;
}

.product-card {
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.2s;
}

.product-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.product-img-placeholder {
  font-size: 2rem;
  text-align: center;
  margin-bottom: 0.5rem;
  background: #f4ecf7;
  padding: 0.8rem;
  border-radius: 6px;
}

.product-card h3 {
  color: #2c3e50;
  font-size: 1.1rem;
  margin: 0.4rem 0;
}

.product-desc {
  color: #555;
  font-size: 0.85rem;
  margin-bottom: 0.4rem;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #f0f0f0;
  padding-top: 1rem;
  margin-top: 0.5rem;
}

.price-small {
  color: #7f8c8d;
  font-size: 0.8rem;
  max-width: 130px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.btn-detail {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: bold;
}

.btn-detail:hover {
  background-color: #c0392b;
}

.state-text, .empty-grid-state {
  text-align: center;
  padding: 3rem;
  color: #7f8c8d;
  grid-column: 1 / -1;
  background: white;
  border-radius: 8px;
}

.modal-backdrop {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background-color: rgba(44, 62, 80, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(3px);
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.modal-header h3 { margin: 0; color: #2c3e50; }
.close-btn { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #7f8c8d; }

.form-group { margin-bottom: 1.2rem; }
.form-group label { display: block; margin-bottom: 6px; font-weight: 500; font-size: 0.9rem; color: #34495e; }
.form-group input { width: 100%; padding: 10px 12px; border: 1px solid #dcdde1; border-radius: 6px; box-sizing: border-box; outline: none; font-size: 0.95rem; }

.form-row { display: flex; gap: 1rem; }
.modal-footer { display: flex; justify-content: flex-end; gap: 10px; margin-top: 2rem; }

.btn-primary {
  background-color: #8e44ad;
  color: white;
  padding: 10px 20px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 600;
}
.btn-primary:hover { background-color: #732d91; }

.btn-secondary {
  background-color: #ecf0f1;
  color: #7f8c8d;
  padding: 10px 20px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 600;
}
.table-container {
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  overflow-x: auto;
}

.styled-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.9rem;
  color: #2c3e50;
}

.styled-table th {
  background-color: #f8f9fa;
  color: #2c3e50;
  padding: 14px 16px;
  font-weight: 600;
  border-bottom: 2px solid #eaedf0;
}

.styled-table td {
  padding: 14px 16px;
  border-bottom: 1px solid #f0f2f5;
  vertical-align: middle;
}

.styled-table tbody tr:hover {
  background-color: #fafbfc;
}

.company-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.company-icon {
  font-size: 1.2rem;
  background: #f4ecf7;
  padding: 6px;
  border-radius: 6px;
}

.font-weight-bold {
  font-weight: 600;
}

.text-center {
  text-align: center;
}

.btn-table-danger {
  background-color: #fee2e2;
  color: #dc2626;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  transition: background 0.2s;
}

.btn-table-danger:hover {
  background-color: #f87171;
  color: white;
}

.empty-table-state {
  text-align: center;
  padding: 3rem;
  color: #7f8c8d;
}
</style>