<template>
  <div class="catalog-container">
    <!-- Banner Principal Estilo Catálogo -->
    <section class="hero-section">
      <div class="hero-content">
        <!-- Botón de agregar superior derecho adaptativo -->
        <div class="hero-top-actions">
          <button class="btn-search btn-add-corner" @click="toggleModal(true)">+ Nueva Categoría</button>
        </div>
        
        <h2>Panel de Gestión de Categorías</h2>
        <p>Administra y controla las categorías activas de tu catálogo en tiempo real.</p>
        
        <!-- Buscador independiente -->
        <div class="search-bar-standalone">
          <input type="text" class="search-input-clean" placeholder="Buscar categoría por nombre..." v-model="busqueda" />
        </div>
      </div>
    </section>

    <div class="catalog-main">
      <aside class="sidebar">
        <h3>Resumen</h3>
        <div class="counter-box">
          <span class="counter-label">Categorías registradas</span>
          <span class="counter-number">{{ categorias.length }}</span>
        </div>
      </aside>

      <section class="products-section">
        <div class="section-title">
          <h3>Listado de Categorías</h3>
          <span class="results-count">Mostrando {{ categoriasFiltradas.length }} de {{ categorias.length }}</span>
        </div>

        <p v-if="loading" class="state-text">Cargando categorías...</p>
        <p v-else-if="error" class="state-text error">{{ error }}</p>

        <div v-else class="table-container">
          <!-- Tabla Tradicional (Visible en pantallas medianas y grandes) -->
          <div class="table-responsive desktop-table-view">
            <table class="styled-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Estado</th>
                  <th class="text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="categoria in categoriasFiltradas" 
                  :key="categoria._id || categoria.id"
                  :class="{ 'row-inactive': categoria.activo === false }"
                >
                  <td class="font-weight-bold">
                    <div class="category-cell">
                      <span class="category-icon">📂</span>
                      <span class="category-pill">{{ categoria.nombre }}</span>
                    </div>
                  </td>
                  <td class="product-name-cell">
                    <small>{{ categoria.descripcion || 'Sin descripción' }}</small>
                  </td>
                  <td>
                    <span :class="['status-dot', categoria.activo !== false ? 'active' : 'inactive']"></span>
                    {{ categoria.activo !== false ? 'Activa' : 'Inactiva' }}
                  </td>
                  <td class="text-right">
                    <button 
                      :class="['btn-toggle', categoria.activo !== false ? 'btn-deactivate' : 'btn-activate']" 
                      @click="toggleEstadoCategoria(categoria._id || categoria.id, categoria.activo !== false)">
                      {{ categoria.activo !== false ? 'Desactivar' : 'Activar' }}
                    </button>
                  </td>
                </tr>
                
                <tr v-if="categoriasFiltradas.length === 0">
                  <td colspan="4" class="empty-table-state">
                    No se encontraron categorías registradas.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Vista de Tarjetas Adaptativas (Visible en pantallas < 900px sin scroll horizontal) -->
          <div class="mobile-cards-view">
            <div 
              v-for="categoria in categoriasFiltradas" 
              :key="categoria._id || categoria.id"
              :class="['mobile-card-item', { 'row-inactive': categoria.activo === false }]"
            >
              <div class="mobile-card-header">
                <div class="mobile-card-title-group">
                  <span class="category-icon-sm">📂</span>
                  <span class="category-pill">{{ categoria.nombre }}</span>
                </div>
                <span :class="['status-dot', categoria.activo !== false ? 'active' : 'inactive']" :title="categoria.activo !== false ? 'Activa' : 'Inactiva'"></span>
              </div>

              <div class="mobile-card-body">
                <div class="detail-row">
                  <span>Descripción:</span>
                  <span class="mobile-card-desc">{{ categoria.descripcion || 'Sin descripción' }}</span>
                </div>
                <div class="detail-row">
                  <span>Estado:</span>
                  <span>{{ categoria.activo !== false ? 'Activa' : 'Inactiva' }}</span>
                </div>
              </div>

              <div class="mobile-card-footer">
                <button 
                  :class="['btn-toggle w-100', categoria.activo !== false ? 'btn-deactivate' : 'btn-activate']" 
                  @click="toggleEstadoCategoria(categoria._id || categoria.id, categoria.activo !== false)">
                  {{ categoria.activo !== false ? 'Desactivar' : 'Activar' }}
                </button>
              </div>
            </div>

            <div v-if="categoriasFiltradas.length === 0" class="empty-table-state">
              No se encontraron categorías registradas.
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Modal para crear categoría -->
    <div v-if="showModal" class="modal-backdrop">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Registrar Nueva Categoría</h3>
          <button class="close-btn" @click="toggleModal(false)">&times;</button>
        </div>
        <form @submit.prevent="crearCategoria">
          <div class="form-group">
            <label>Nombre de la categoría</label>
            <input type="text" v-model="nuevaCategoria.nombre" placeholder="Ej. tecnologia" required />
          </div>
          <div class="form-group">
            <label>Descripción</label>
            <input type="text" v-model="nuevaCategoria.descripcion" placeholder="Detalles..." />
          </div>
          <div class="modal-footer">
            <button type="button" class="btn-secondary" @click="toggleModal(false)">Cancelar</button>
            <button type="submit" class="btn-primary">Guardar Categoría</button>
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

const categorias = ref([])
const loading = ref(true)
const error = ref(null)
const showModal = ref(false)
const busqueda = ref('')

const nuevaCategoria = ref({
  nombre: '',
  descripcion: ''
})

const categoriasFiltradas = computed(() => {
  if (!Array.isArray(categorias.value)) return []
  return categorias.value.filter(c => c.nombre && c.nombre.toLowerCase().includes(busqueda.value.toLowerCase()))
})

const obtenerCategorias = async () => {
  loading.value = true
  try {
    const response = await api.get('/categorias')
    if (Array.isArray(response.data)) {
      categorias.value = response.data
    } else if (response.data && Array.isArray(response.data.data)) {
      categorias.value = response.data.data
    } else {
      categorias.value = []
    }
  } catch (err) {
    error.value = 'Error al cargar las categorías del servidor.'
    categorias.value = []
    $q.notify({ color: 'negative', position: 'top', message: 'Error al cargar categorías.', icon: 'report_problem' })
  } finally {
    loading.value = false
  }
}

const toggleModal = (isOpen) => {
  showModal.value = isOpen
  if (!isOpen) {
    nuevaCategoria.value = { nombre: '', descripcion: '' }
  }
}

const crearCategoria = async () => {
  try {
    await api.post('/categorias', nuevaCategoria.value)
    toggleModal(false)
    obtenerCategorias()
    $q.notify({ color: 'positive', position: 'top', message: 'Categoría creada exitosamente.', icon: 'check' })
  } catch (err) {
    $q.notify({ color: 'negative', position: 'top', message: 'Error al crear la categoría.', icon: 'report_problem' })
  }
}

const toggleEstadoCategoria = async (id, estadoActual) => {
  const nuevoEstado = !estadoActual
  try {
    await api.put(`/categorias/${id}`, { activo: nuevoEstado })
    obtenerCategorias()
    $q.notify({ 
      color: 'positive', 
      position: 'top', 
      message: nuevoEstado ? 'Categoría activada correctamente.' : 'Categoría desactivada correctamente.', 
      icon: 'check' 
    })
  } catch (err) {
    $q.notify({ color: 'negative', position: 'top', message: 'Error al cambiar el estado de la categoría.', icon: 'report_problem' })
  }
}

onMounted(() => {
  obtenerCategorias()
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
  background: linear-gradient(135deg, #2c3e50, #d35400); 
  color: white; 
  padding: 2.5rem 2rem 3rem 2rem; 
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
  background-color: #e67e22; 
  color: white; 
  border: none; 
  padding: 10px 20px; 
  border-radius: 6px; 
  font-weight: bold; 
  cursor: pointer; 
  white-space: nowrap; 
}

.btn-search:hover { 
  background-color: #d35400; 
}

.catalog-main { 
  display: flex; 
  width: 100%;
  max-width: 1300px; 
  margin: 2rem auto; 
  padding: 0 2rem; 
  gap: 2rem; 
  flex: 1; 
  box-sizing: border-box; 
}

.sidebar { 
  width: 260px; 
  min-width: 260px;
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
  margin-bottom: 1rem; 
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
  background: white; 
  border-radius: 8px; 
  box-shadow: 0 2px 8px rgba(0,0,0,0.05); 
  overflow: hidden; 
  width: 100%;
  display: flex;
  flex-direction: column;
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
  font-size: 0.95rem; 
  min-width: 600px;
}

.styled-table th { 
  background-color: #f8f9fa; 
  color: #2c3e50; 
  padding: 14px 16px; 
  font-weight: 600; 
  border-bottom: 2px solid #e9ecef; 
}

.styled-table td { 
  padding: 14px 16px; 
  border-bottom: 1px solid #edf2f7; 
  color: #4a5568; 
  vertical-align: middle; 
}

.styled-table tbody tr:hover { 
  background-color: #f8fafc; 
}

.category-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.category-icon {
  font-size: 1.2rem;
  background: #fef5ec;
  padding: 6px;
  border-radius: 6px;
}

.category-icon-sm {
  font-size: 1rem;
  background: #fef5ec;
  padding: 4px;
  border-radius: 4px;
}

.font-weight-bold {
  font-weight: 600;
}

.category-pill { 
  background-color: #fef5ec; 
  color: #d35400; 
  padding: 4px 10px; 
  border-radius: 12px; 
  font-size: 0.8rem; 
  font-weight: 500; 
  text-transform: capitalize; 
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

/* Estilos de Tarjetas Móviles (< 900px) */
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

.mobile-card-desc {
  font-size: 0.9rem;
  color: #4a5568;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: #4a5568;
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
}

.modal-footer { 
  display: flex; 
  justify-content: flex-end; 
  gap: 10px; 
  margin-top: 2rem; 
}

.btn-primary { 
  background-color: #e67e22; 
  color: white; 
  padding: 10px 20px; 
  border-radius: 6px; 
  border: none; 
  cursor: pointer; 
  font-weight: 600; 
}

.btn-primary:hover { 
  background-color: #d35400; 
}

.btn-secondary { 
  background-color: #ecf0f1; 
  color: #7f8c8d; 
  padding: 10px 20px; 
  border-radius: 6px; 
  border: none; 
  cursor: pointer; 
  font-weight: 600; 
}

.styled-table tbody tr.row-inactive,
.mobile-card-item.row-inactive { 
  background-color: #f1f3f5 !important; 
  opacity: 0.7; 
}

.styled-table tbody tr.row-inactive td { 
  color: #adb5bd !important; 
}

/* Transición automática entre tabla y tarjetas móviles a los 900px */
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

  .desktop-table-view {
    display: none;
  }
  .mobile-cards-view {
    display: flex;
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
  .hero-content h2 {
    font-size: 1.5rem;
  }
  .modal-content {
    margin: 1rem;
    width: calc(100% - 2rem) !important;
    padding: 1.2rem !important;
  }
}
</style>