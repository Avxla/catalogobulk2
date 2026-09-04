<template>
  <div class="catalog-container">
    <!-- Banner Principal Estilo Catálogo -->
    <section class="hero-section">
      <div class="hero-content">
        <!-- Botón de agregar producto en la esquina superior derecha -->
        <div class="hero-top-actions">
          <button class="btn-search btn-add-corner" @click="toggleModal(true)">+ Nuevo Producto</button>
        </div>
        
        <h2>Panel de Gestión de Productos</h2>
        <p>Administra, busca y controla el inventario activo de tu catálogo en tiempo real.</p>
        
        <!-- Buscador independiente -->
        <div class="search-bar-standalone">
          <input type="text" class="search-input-clean" placeholder="Buscar producto por nombre..." v-model="busqueda" />
        </div>
      </div>
    </section>

    <!-- Contenido Principal: Sidebar + Tabla de Productos -->
    <div class="catalog-main">
      <aside class="sidebar">
        <h3>Resumen</h3>
        <div class="counter-box">
          <span class="counter-label">Total en BD</span>
          <span class="counter-number">{{ totalItems }}</span>
        </div>
        <div class="stock-summary">
          <span>Stock total: <strong>{{ totalStock }} un.</strong></span>
        </div>
      </aside>

      <!-- Sección de la Tabla / Cards Adaptativas -->
      <section class="products-section">
        <div class="section-title">
          <h3>Inventario Registrado</h3>
          <span class="results-count">Página {{ paginaActual }} de {{ totalPaginas || 1 }}</span>
        </div>

        <p v-if="loading" class="state-text">Cargando productos...</p>
        <p v-else-if="error" class="state-text error">{{ error }}</p>

        <div v-else class="table-container">
          <!-- Tabla Tradicional (Visible en pantallas medianas y grandes) -->
          <div class="table-responsive desktop-table-view">
            <table class="styled-table">
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>SKU</th>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Estado</th>
                  <th class="text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="producto in productosFiltrados" 
                  :key="producto._id || producto.id"
                  :class="{ 'row-inactive': producto.activo === false }"
                >
                  <td>
                    <img 
                      :src="producto.imagenUrl || 'https://via.placeholder.com/50'" 
                      alt="Imagen" 
                      class="product-thumbnail"
                    />
                  </td>
                  <td><span class="sku-badge">{{ producto.sku || 'N/A' }}</span></td>
                  <td class="product-name-cell">
                    <strong>{{ producto.nombre }}</strong>
                    <small>{{ producto.descripcion || 'Sin descripción' }}</small>
                  </td>
                  <td>
                    <span class="category-pill">{{ producto.categoria || 'general' }}</span>
                  </td>
                  <td class="price-cell">${{ Number(producto.precio).toFixed(2) }}</td>
                  <td>
                    <span :class="['stock-badge', producto.stock > 0 ? 'in-stock' : 'out-stock']">
                      {{ producto.stock }} un.
                    </span>
                  </td>
                  <td>
                    <span :class="['status-dot', producto.activo !== false ? 'active' : 'inactive']"></span>
                    {{ producto.activo !== false ? 'Disponible' : 'Agotado' }}
                  </td>
                  <td class="text-right">
                    <button 
                      :class="['btn-toggle', producto.activo !== false ? 'btn-deactivate' : 'btn-activate']" 
                      @click="toggleEstadoProducto(producto._id || producto.id, producto.activo !== false)">
                      {{ producto.activo !== false ? 'Desactivar' : 'Activar' }}
                    </button>
                  </td>
                </tr>
                
                <tr v-if="productosFiltrados.length === 0">
                  <td colspan="8" class="empty-table-state">
                    No se encontraron productos en esta página.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Vista de Tarjetas Adaptativas (Visible en móviles / pantallas < 900px sin scroll horizontal) -->
          <div class="mobile-cards-view">
            <div 
              v-for="producto in productosFiltrados" 
              :key="producto._id || producto.id"
              :class="['mobile-card-item', { 'row-inactive': producto.activo === false }]"
            >
              <div class="mobile-card-header">
                <img 
                  :src="producto.imagenUrl || 'https://via.placeholder.com/50'" 
                  alt="Imagen" 
                  class="product-thumbnail-mobile"
                />
                <div class="mobile-card-title-group">
                  <span class="sku-badge">{{ producto.sku || 'N/A' }}</span>
                  <strong>{{ producto.nombre }}</strong>
                </div>
                <span :class="['status-dot', producto.activo !== false ? 'active' : 'inactive']" :title="producto.activo !== false ? 'Disponible' : 'Agotado'"></span>
              </div>

              <div class="mobile-card-body">
                <p class="mobile-card-desc">{{ producto.descripcion || 'Sin descripción' }}</p>
                <div class="mobile-card-details">
                  <div class="detail-row">
                    <span>Categoría:</span>
                    <span class="category-pill">{{ producto.categoria || 'general' }}</span>
                  </div>
                  <div class="detail-row">
                    <span>Precio:</span>
                    <span class="price-cell">${{ Number(producto.precio).toFixed(2) }}</span>
                  </div>
                  <div class="detail-row">
                    <span>Stock:</span>
                    <span :class="['stock-badge', producto.stock > 0 ? 'in-stock' : 'out-stock']">
                      {{ producto.stock }} un.
                    </span>
                  </div>
                </div>
              </div>

              <div class="mobile-card-footer">
                <button 
                  :class="['btn-toggle w-100', producto.activo !== false ? 'btn-deactivate' : 'btn-activate']" 
                  @click="toggleEstadoProducto(producto._id || producto.id, producto.activo !== false)">
                  {{ producto.activo !== false ? 'Desactivar' : 'Activar' }}
                </button>
              </div>
            </div>

            <div v-if="productosFiltrados.length === 0" class="empty-table-state">
              No se encontraron productos en esta página.
            </div>
          </div>

          <!-- Pestañas de Paginación -->
          <div class="pagination-bar" v-if="totalPaginas > 1">
            <button 
              class="page-btn" 
              :disabled="paginaActual === 1" 
              @click="cambiarPagina(paginaActual - 1)">
              Anterior
            </button>
            
            <button 
              v-for="p in totalPaginas" 
              :key="p" 
              :class="['page-btn', { active: p === paginaActual }]" 
              @click="cambiarPagina(p)">
              {{ p }}
            </button>

            <button 
              class="page-btn" 
              :disabled="paginaActual === totalPaginas" 
              @click="cambiarPagina(paginaActual + 1)">
              Siguiente
            </button>
          </div>
        </div>
      </section>
    </div>

    <!-- Modal para crear producto -->
    <div v-if="showModal" class="modal-backdrop">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Registrar Nuevo Producto</h3>
          <button class="close-btn" @click="toggleModal(false)">&times;</button>
        </div>
        <form @submit.prevent="crearProducto">
          <div class="form-group">
            <label>SKU</label>
            <input type="text" v-model="nuevoProducto.sku" placeholder="Ej. SKU-12345" required />
          </div>
          <div class="form-group">
            <label>Nombre del producto</label>
            <input type="text" v-model="nuevoProducto.nombre" placeholder="Ej. Producto A" required />
          </div>
          <div class="form-group">
            <label>Categoría</label>
            <input type="text" v-model="nuevoProducto.categoria" placeholder="Ej. tecnologia" required />
          </div>
          <div class="form-group">
            <label>URL de la Imagen</label>
            <input type="text" v-model="nuevoProducto.imagenUrl" placeholder="https://ejemplo.com/imagen.jpg" />
          </div>
          <div class="form-group">
            <label>Descripción</label>
            <input type="text" v-model="nuevoProducto.descripcion" placeholder="Detalles..." />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Precio ($)</label>
              <input type="number" step="0.01" v-model="nuevoProducto.precio" placeholder="0.00" required />
            </div>
            <div class="form-group">
              <label>Stock</label>
              <input type="number" v-model="nuevoProducto.stock" placeholder="0" required />
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn-secondary" @click="toggleModal(false)">Cancelar</button>
            <button type="submit" class="btn-primary">Guardar Producto</button>
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

const productos = ref([])
const loading = ref(true)
const error = ref(null)
const showModal = ref(false)
const busqueda = ref('')

const paginaActual = ref(1)
const totalItems = ref(0)
const limitePorPagina = 25

const nuevoProducto = ref({
  sku: '',
  nombre: '',
  categoria: '',
  imagenUrl: '',
  descripcion: '',
  precio: '',
  stock: '',
  proveedorId: ''
})

const totalStock = computed(() => {
  if (!Array.isArray(productos.value)) return 0
  return productos.value.reduce((acc, p) => acc + Number(p.stock || 0), 0)
})

const totalPaginas = computed(() => {
  return Math.ceil(totalItems.value / limitePorPagina)
})

const productosFiltrados = computed(() => {
  if (!Array.isArray(productos.value)) return []
  return productos.value.filter(p => p.nombre && p.nombre.toLowerCase().includes(busqueda.value.toLowerCase()))
})

const obtenerProductos = async (pagina = 1) => {
  loading.value = true
  try {
    const response = await api.get(`/productos?page=${pagina}&limit=${limitePorPagina}`)
    
    if (response.data && Array.isArray(response.data.data)) {
      productos.value = response.data.data
      totalItems.value = response.data.total || 0
      paginaActual.value = response.data.page || pagina
    } else if (Array.isArray(response.data)) {
      productos.value = response.data
      totalItems.value = response.data.length
    } else {
      productos.value = []
    }
  } catch (err) {
    error.value = 'Error al cargar los productos del servidor.'
    productos.value = []
    $q.notify({
      color: 'negative',
      position: 'top',
      message: 'Error al cargar los productos del servidor.',
      icon: 'report_problem'
    })
  } finally {
    loading.value = false
  }
}

const cambiarPagina = (nuevaPagina) => {
  if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas.value) {
    obtenerProductos(nuevaPagina)
  }
}

const toggleModal = (isOpen) => {
  showModal.value = isOpen
  if (!isOpen) {
    nuevoProducto.value = { sku: '', nombre: '', categoria: '', imagenUrl: '', descripcion: '', precio: '', stock: '', proveedorId: '' }
  }
}

const crearProducto = async () => {
  try {
    await api.post('/productos', nuevoProducto.value)
    toggleModal(false)
    obtenerProductos(paginaActual.value)
    $q.notify({
      color: 'positive',
      position: 'top',
      message: 'Producto creado exitosamente.',
      icon: 'check'
    })
  } catch (err) {
    $q.notify({
      color: 'negative',
      position: 'top',
      message: err.response?.data?.error || 'Error al crear el producto.',
      icon: 'report_problem'
    })
  }
}

const toggleEstadoProducto = async (id, estadoActual) => {
  const nuevoEstado = !estadoActual
  try {
    await api.put(`/productos/${id}`, { activo: nuevoEstado })
    obtenerProductos(paginaActual.value)
    $q.notify({
      color: 'positive',
      position: 'top',
      message: nuevoEstado ? 'Producto activado correctamente.' : 'Producto desactivado correctamente.',
      icon: 'check'
    })
  } catch (err) {
    $q.notify({
      color: 'negative',
      position: 'top',
      message: err.response?.data?.error || 'Error al cambiar el estado del producto.',
      icon: 'report_problem'
    })
  }
}

onMounted(() => {
  obtenerProductos(1)
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
  background: linear-gradient(135deg, #2c3e50, #3498db); 
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
  background-color: #3498db; 
  color: white; 
  border: none; 
  padding: 10px 20px; 
  border-radius: 6px; 
  font-weight: bold; 
  cursor: pointer; 
  white-space: nowrap; 
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
  min-width: 750px; 
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

.product-thumbnail { 
  width: 42px; 
  height: 42px; 
  object-fit: cover; 
  border-radius: 6px; 
  border: 1px solid #e2e8f0; 
}

.product-thumbnail-mobile {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.sku-badge { 
  background-color: #edf2f7; 
  color: #2d3748; 
  padding: 4px 8px; 
  border-radius: 4px; 
  font-size: 0.8rem; 
  font-family: monospace; 
  font-weight: bold; 
}

.product-name-cell strong { 
  display: block; 
  color: #2d3748; 
}

.product-name-cell small { 
  color: #718096; 
  font-size: 0.8rem; 
}

.category-pill { 
  background-color: #ebf8ff; 
  color: #3182ce; 
  padding: 4px 10px; 
  border-radius: 12px; 
  font-size: 0.8rem; 
  font-weight: 500; 
  text-transform: capitalize; 
}

.price-cell { 
  font-weight: 600; 
  color: #2d3748; 
}

.stock-badge { 
  padding: 4px 8px; 
  border-radius: 6px; 
  font-size: 0.85rem; 
  font-weight: 500; 
}

.stock-badge.in-stock { 
  background-color: #def7ec; 
  color: #03543f; 
}

.stock-badge.out-stock { 
  background-color: #fde8e8; 
  color: #9b1c1c; 
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
  gap: 0.75rem;
  border-bottom: 1px solid #edf2f7;
  padding-bottom: 0.75rem;
}

.mobile-card-title-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mobile-card-title-group strong {
  font-size: 1rem;
  color: #2d3748;
}

.mobile-card-body {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.mobile-card-desc {
  font-size: 0.85rem;
  color: #718096;
  margin: 0;
}

.mobile-card-details {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  background: white;
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid #edf2f7;
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

.pagination-bar { 
  display: flex; 
  justify-content: center; 
  flex-wrap: wrap; 
  gap: 6px; 
  padding: 1rem; 
  background: #fff; 
  border-top: 1px solid #edf2f7; 
}

.page-btn { 
  background-color: #f8f9fa; 
  border: 1px solid #dcdde1; 
  padding: 6px 12px; 
  border-radius: 4px; 
  cursor: pointer; 
  font-weight: 600; 
  color: #2c3e50; 
}

.page-btn:hover:not(:disabled) { 
  background-color: #3498db; 
  color: white; 
  border-color: #3498db; 
}

.page-btn.active { 
  background-color: #3498db; 
  color: white; 
  border-color: #3498db; 
}

.page-btn:disabled { 
  opacity: 0.5; 
  cursor: not-allowed; 
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
  background-color: #3498db; 
  color: white; 
  padding: 10px 20px; 
  border-radius: 6px; 
  border: none; 
  cursor: pointer; 
  font-weight: 600; 
}

.btn-primary:hover { 
  background-color: #2980b9; 
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
    gap: 1.5rem;
  }

  .sidebar {
    width: 100%;
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

  .sidebar {
    flex-direction: column;
    gap: 0.5rem;
    align-items: stretch;
  }

  .form-row {
    flex-direction: column;
    gap: 0;
  }
}
</style>