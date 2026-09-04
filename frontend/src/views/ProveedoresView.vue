<template>
  <div class="catalog-container">
    <!-- Banner Principal Estilo Catálogo -->
    <section class="hero-section">
      <div class="hero-content">
        <!-- Botón de agregar en la esquina superior derecha -->
        <div class="hero-top-actions">
          <button class="btn-search btn-add-corner" @click="toggleModal(true)">+ Nuevo Proveedor</button>
        </div>
        
        <h2>Gestión de Proveedores</h2>
        <p>Administra la información de contacto y el directorio de tus proveedores asociados.</p>
        
        <!-- Buscador independiente -->
        <div class="search-bar-standalone">
          <input type="text" class="search-input-clean" placeholder="Buscar proveedor por nombre..." v-model="busqueda" />
        </div>
      </div>
    </section>

    <!-- Contenido Principal: Sidebar + Grilla -->
    <div class="catalog-main">
      <aside class="sidebar">
        <h3>Resumen</h3>
        <div class="counter-box">
          <span class="counter-label">Total en BD</span>
          <span class="counter-number">{{ proveedores.length }}</span>
        </div>
      </aside>

      <!-- Tabla de Proveedores -->
      <section class="products-section">
        <div class="section-title">
          <h3>Directorio de Proveedores</h3>
          <span class="results-count">Mostrando {{ proveedoresFiltrados.length }} de {{ proveedores.length }}</span>
        </div>

        <p v-if="loading" class="state-text">Cargando proveedores...</p>
        <p v-else-if="error" class="state-text error">{{ error }}</p>

        <div v-else class="table-container">
          <!-- Tabla Tradicional (Visible en pantallas medianas y grandes) -->
          <div class="table-responsive desktop-table-view">
            <table class="styled-table">
              <thead>
                <tr>
                  <th>Empresa</th>
                  <th>Contacto</th>
                  <th>Teléfono</th>
                  <th>Correo</th>
                  <th>Dirección</th>
                  <th>Estado</th>
                  <th class="text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="proveedor in proveedoresFiltrados" 
                  :key="proveedor._id || proveedor.id"
                  :class="{ 'row-inactive': proveedor.activo === false }"
                >
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
                  <td>
                    <span :class="['status-dot', proveedor.activo !== false ? 'active' : 'inactive']"></span>
                    {{ proveedor.activo !== false ? 'Activo' : 'Inactivo' }}
                  </td>
                  <td class="text-right">
                    <button 
                      :class="['btn-toggle', proveedor.activo !== false ? 'btn-deactivate' : 'btn-activate']" 
                      @click="toggleEstadoProveedor(proveedor._id || proveedor.id, proveedor.activo !== false)">
                      {{ proveedor.activo !== false ? 'Desactivar' : 'Activar' }}
                    </button>
                  </td>
                </tr>
                <tr v-if="proveedoresFiltrados.length === 0">
                  <td colspan="7" class="empty-table-state">No se encontraron proveedores registrados.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Vista de Tarjetas Adaptativas (Visible en pantallas < 992px sin scroll horizontal) -->
          <div class="mobile-cards-view">
            <div 
              v-for="proveedor in proveedoresFiltrados" 
              :key="proveedor._id || proveedor.id"
              :class="['mobile-card-item', { 'row-inactive': proveedor.activo === false }]"
            >
              <div class="mobile-card-header">
                <div class="mobile-card-title-group">
                  <span class="company-icon-sm">🏢</span>
                  <span class="font-weight-bold">{{ proveedor.nombre }}</span>
                </div>
                <span :class="['status-dot', proveedor.activo !== false ? 'active' : 'inactive']" :title="proveedor.activo !== false ? 'Activo' : 'Inactivo'"></span>
              </div>

              <div class="mobile-card-body">
                <div class="detail-row">
                  <span>Contacto:</span>
                  <span class="mobile-card-val">{{ proveedor.contacto || 'No especificado' }}</span>
                </div>
                <div class="detail-row">
                  <span>Teléfono:</span>
                  <span class="mobile-card-val">{{ proveedor.telefono || 'Sin teléfono' }}</span>
                </div>
                <div class="detail-row">
                  <span>Correo:</span>
                  <span class="mobile-card-val">{{ proveedor.email || 'Sin correo' }}</span>
                </div>
                <div class="detail-row">
                  <span>Dirección:</span>
                  <span class="mobile-card-val">{{ proveedor.direccion || 'Sin dirección' }}</span>
                </div>
                <div class="detail-row">
                  <span>Estado:</span>
                  <span>{{ proveedor.activo !== false ? 'Activo' : 'Inactivo' }}</span>
                </div>
              </div>

              <div class="mobile-card-footer">
                <button 
                  :class="['btn-toggle w-100', proveedor.activo !== false ? 'btn-deactivate' : 'btn-activate']" 
                  @click="toggleEstadoProveedor(proveedor._id || proveedor.id, proveedor.activo !== false)">
                  {{ proveedor.activo !== false ? 'Desactivar' : 'Activar' }}
                </button>
              </div>
            </div>

            <div v-if="proveedoresFiltrados.length === 0" class="empty-table-state">
              No se encontraron proveedores registrados.
            </div>
          </div>
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
import { useQuasar } from 'quasar'
import api from '../plugins/api'

const $q = useQuasar()

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
    const data = response.data
    proveedores.value = Array.isArray(data) 
      ? data 
      : (data.docs || data.data || data.proveedores || [])
  } catch (err) {
    error.value = 'Error al cargar los proveedores del servidor.'
    proveedores.value = []
    $q.notify({ color: 'negative', position: 'top', message: 'Error al cargar proveedores.', icon: 'report_problem' })
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
    $q.notify({ color: 'positive', position: 'top', message: 'Proveedor creado exitosamente.', icon: 'check' })
  } catch (err) {
    $q.notify({ color: 'negative', position: 'top', message: 'Error al crear el proveedor.', icon: 'report_problem' })
  }
}

const toggleEstadoProveedor = async (id, estadoActual) => {
  const nuevoEstado = !estadoActual
  try {
    await api.put(`/proveedores/${id}`, { activo: nuevoEstado })
    obtenerProveedores()
    $q.notify({ 
      color: 'positive', 
      position: 'top', 
      message: nuevoEstado ? 'Proveedor activado correctamente.' : 'Proveedor desactivado correctamente.', 
      icon: 'check' 
    })
  } catch (err) {
    $q.notify({ color: 'negative', position: 'top', message: 'Error al cambiar el estado del proveedor.', icon: 'report_problem' })
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
  box-sizing: border-box;
}

.hero-section {
  background: linear-gradient(135deg, #2c3e50, #8e44ad);
  color: white;
  padding: 2.5rem 1.5rem 3rem 1.5rem;
  text-align: center;
  position: relative;
}

.hero-content {
  max-width: 700px;
  margin: 0 auto;
  position: relative;
}

.hero-top-actions {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-bottom: 1rem;
}

.btn-add-corner {
  background-color: #2ecc71 !important;
  box-shadow: 0 4px 10px rgba(0,0,0,0.15);
  transition: background-color 0.2s;
}

.btn-add-corner:hover {
  background-color: #27ae60 !important;
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

.search-bar-standalone {
  display: flex;
  background: white;
  padding: 5px;
  border-radius: 6px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

.search-input-clean {
  width: 100%;
  border: none;
  padding: 10px 15px;
  font-size: 1rem;
  outline: none;
  border-radius: 4px;
  background: transparent;
}

.btn-search {
  background-color: #8e44ad;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  white-space: nowrap;
}

.btn-search:hover {
  background-color: #732d91;
}

.catalog-main {
  display: flex;
  max-width: 1300px;
  margin: 2rem auto;
  padding: 0 1rem;
  gap: 2rem;
  flex: 1;
  width: 100%;
  box-sizing: border-box;
}

.sidebar {
  width: 250px;
  min-width: 250px;
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
  min-width: 0;
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

.table-container {
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  width: 100%;
}

/* Control de vistas (Escritorio vs Móvil) */
.desktop-table-view {
  display: block;
  width: 100%;
}

.mobile-cards-view {
  display: none;
  padding: 1rem;
  flex-direction: column;
  gap: 1rem;
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.styled-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.9rem;
  color: #2c3e50;
  min-width: 800px;
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

.company-icon-sm {
  font-size: 1rem;
  background: #f4ecf7;
  padding: 4px;
  border-radius: 4px;
}

.font-weight-bold {
  font-weight: 600;
}

.status-dot {
  height: 8px;
  width: 8px;
  background-color: #cbd5e1;
  border-radius: 50%;
  display: inline-block;
  margin-right: 6px;
}

.status-dot.active {
  background-color: #31c48d;
}

.status-dot.inactive {
  background-color: #f05252;
}

.text-right {
  text-align: right;
}

.w-100 {
  width: 100%;
}

.btn-toggle {
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  border: 1px solid;
}

.btn-deactivate {
  background-color: #fff5f5;
  color: #e53e3e;
  border-color: #fed7d7;
}

.btn-deactivate:hover {
  background-color: #e53e3e;
  color: white;
}

.btn-activate {
  background-color: #f0fdf4;
  color: #16a34a;
  border-color: #bbf7d0;
}

.btn-activate:hover {
  background-color: #16a34a;
  color: white;
}

/* Estilos de Tarjetas Móviles (< 992px) */
.mobile-card-item {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.mobile-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #edf2f7;
  padding-bottom: 0.75rem;
}

.mobile-card-title-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.mobile-card-body {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  background: white;
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid #edf2f7;
}

.mobile-card-val {
  font-size: 0.9rem;
  color: #4a5568;
  word-break: break-all;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: #4a5568;
  gap: 1rem;
}

.mobile-card-footer {
  margin-top: 0.25rem;
}

.empty-table-state, .state-text {
  text-align: center;
  padding: 3rem;
  color: #7f8c8d;
  background: white;
  border-radius: 8px;
}

.modal-backdrop {
  position: fixed;
  top: 0; 
  left: 0; 
  width: 100%; 
  height: 100%;
  background-color: rgba(44, 62, 80, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(3px);
  padding: 1rem;
  box-sizing: border-box;
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

.modal-header h3 { 
  margin: 0; 
  color: #2c3e50; 
}

.close-btn { 
  background: none; 
  border: none; 
  font-size: 1.5rem; 
  cursor: pointer; 
  color: #7f8c8d; 
}

.form-group { 
  margin-bottom: 1.2rem; 
}

.form-group label { 
  display: block; 
  margin-bottom: 6px; 
  font-weight: 500; 
  font-size: 0.9rem; 
  color: #34495e; 
}

.form-group input { 
  width: 100%; 
  padding: 10px 12px; 
  border: 1px solid #dcdde1; 
  border-radius: 6px; 
  box-sizing: border-box; 
  outline: none; 
  font-size: 0.95rem; 
}

.form-row { 
  display: flex; 
  gap: 1rem; 
}

.modal-footer { 
  display: flex; 
  justify-content: flex-end; 
  gap: 10px; 
  margin-top: 2rem; 
}

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

/* Fila inactiva con estilos visuales mejorados */
.styled-table tbody tr.row-inactive,
.mobile-card-item.row-inactive {
  background-color: #f1f3f5 !important;
  opacity: 0.7;
}

.styled-table tbody tr.row-inactive td {
  color: #adb5bd !important;
}

/* Media Queries de Responsividad Avanzada (Equivalente al patrón de Categorías) */
@media (max-width: 992px) {
  .catalog-main {
    flex-direction: column;
    padding: 0 1rem;
    gap: 1.5rem;
  }

  .sidebar {
    width: 100%;
    min-width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 1rem;
  }

  .sidebar h3 {
    display: none;
  }

  .counter-box {
    margin-bottom: 0;
    padding: 0.5rem 1rem;
  }

  .counter-number {
    font-size: 1.4rem;
  }

  /* Ocultar la tabla tradicional y mostrar las tarjetas adaptativas para evitar scroll horizontal */
  .desktop-table-view {
    display: none;
  }
  .mobile-cards-view {
    display: flex;
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 2rem 1rem;
  }

  .hero-content h2 {
    font-size: 1.6rem;
  }

  .hero-content p {
    font-size: 0.9rem;
  }

  .form-row {
    flex-direction: column;
    gap: 0;
  }
}

@media (max-width: 576px) {
  .hero-top-actions {
    justify-content: center;
  }
  .btn-add-corner {
    width: 100%;
    text-align: center;
  }
  .modal-content {
    margin: 1rem;
    width: calc(100% - 2rem) !important;
    padding: 1.2rem !important;
  }
}
</style>