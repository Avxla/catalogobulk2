<template>
  <div class="catalog-container">
    <!-- Encabezado Público: Solo se muestra si NO estamos en la ruta de administración -->
    <header class="catalog-header" v-if="!isAdminRoute">
      <div class="logo">
        <h1>Catálogo Bulk</h1>
      </div>
      <div class="nav-links">
        <router-link to="/login" class="btn-login" v-if="!authStore.token">Iniciar Sesión</router-link>
        <router-link to="/admin/productos" class="btn-login" v-else>Panel Admin</router-link>
      </div>
    </header>

    <!-- Sección Hero / Banner Principal -->
    <section class="hero-section">
      <div class="hero-content">
        <h2>Soluciones al por mayor para tu negocio</h2>
        <p>Explora nuestro inventario actualizado en tiempo real. Calidad, confianza y los mejores precios del mercado.</p>
        <div class="search-bar">
          <input type="text" placeholder="¿Qué producto estás buscando?" v-model="busqueda" @input="paginaActual = 1" />
          <button class="btn-search">Buscar</button>
        </div>
      </div>
    </section>

    <!-- Contenido Principal: Sidebar de Filtros + Grilla de Productos -->
    <div class="catalog-main">
      <!-- Barra lateral de categorías dinámicas -->
      <aside class="sidebar">
        <h3>Categorías</h3>
        <ul>
          <li>
            <a 
              href="#" 
              :class="{ active: categoriaSeleccionada === '' }" 
              @click.prevent="seleccionarCategoria('')"
            >
              Todos los productos
            </a>
          </li>
          <li v-for="cat in categorias" :key="cat._id || cat.id">
            <a 
              href="#" 
              :class="{ active: categoriaSeleccionada === cat.nombre }"
              @click.prevent="seleccionarCategoria(cat.nombre)"
            >
              {{ cat.nombre }}
            </a>
          </li>
        </ul>
      </aside>

      <!-- Grilla de Productos Conectada al Backend -->
      <section class="products-section">
        <div class="section-title">
          <h3>Productos Destacados</h3>
          <span class="results-count">Mostrando página {{ paginaActual }} de {{ totalPaginas || 1 }} ({{ productosFiltrados.length }} total)</span>
        </div>

        <p v-if="loading" class="state-text">Cargando catálogo en tiempo real...</p>
        
        <div class="public-grid" v-else-if="productosPaginados.length > 0">
          <div class="product-card" v-for="producto in productosPaginados" :key="producto._id || producto.id">
            <div class="product-img-wrapper">
              <img 
                :src="producto.imagenUrl || 'https://via.placeholder.com/150'" 
                alt="Imagen del producto" 
                class="product-img"
              />
            </div>
            <span class="category-tag">{{ producto.categoria || 'General' }}</span>
            <h3>{{ producto.nombre }}</h3>
            <p class="product-desc">{{ producto.descripcion || 'Sin descripción disponible.' }}</p>
            <div class="card-footer">
              <span class="price">${{ Number(producto.precio).toFixed(2) }}</span>
              <button class="btn-detail" @click="verDetalle(producto)">Ver más</button>
            </div>
          </div>
        </div>

        <div v-else class="empty-table-state">
          No se encontraron productos disponibles con los filtros seleccionados.
        </div>

        <!-- Barra de Paginación de 25 en 25 -->
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
      </section>
    </div>

    <!-- Pie de página institucional -->
    <footer class="catalog-footer">
      <p>&copy; 2026 Catálogo Bulk. Todos los derechos reservados.</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from '../stores/auth.js'
import api from '../plugins/api'

const router = useRouter()
const route = useRoute()
const $q = useQuasar()
const authStore = useAuthStore()

const productos = ref([])
const categorias = ref([])
const loading = ref(true)
const busqueda = ref('')
const categoriaSeleccionada = ref('')

const paginaActual = ref(1)
const elementosPorPagina = 25

const isAdminRoute = computed(() => route.path.startsWith('/admin'))

const cargarDatosCatalogo = async () => {
  loading.value = true
  try {
    const [resProductos, resCategorias] = await Promise.all([
      api.get('/productos?limit=500'),
      api.get('/categorias')
    ])

    if (resProductos.data && Array.isArray(resProductos.data.data)) {
      productos.value = resProductos.data.data
    } else if (Array.isArray(resProductos.data)) {
      productos.value = resProductos.data
    } else {
      productos.value = []
    }

    if (Array.isArray(resCategorias.data)) {
      categorias.value = resCategorias.data
    } else if (resCategorias.data && Array.isArray(resCategorias.data.data)) {
      categorias.value = resCategorias.data.data
    } else {
      categorias.value = []
    }

  } catch (err) {
    $q.notify({
      color: 'negative',
      position: 'top',
      message: 'Error al sincronizar los productos con el servidor.',
      icon: 'report_problem'
    })
  } finally {
    loading.value = false
  }
}

const seleccionarCategoria = (nombreCategoria) => {
  categoriaSeleccionada.value = nombreCategoria
  paginaActual.value = 1
}

const productosFiltrados = computed(() => {
  if (!Array.isArray(productos.value)) return []
  
  return productos.value.filter(p => {
    const estaActivo = p.activo !== false
    const coincideNombre = p.nombre && p.nombre.toLowerCase().includes(busqueda.value.toLowerCase())
    const coincideCategoria = categoriaSeleccionada.value === '' || 
      (p.categoria && p.categoria.toLowerCase() === categoriaSeleccionada.value.toLowerCase())

    return estaActivo && coincideNombre && coincideCategoria
  })
})

const totalPaginas = computed(() => {
  return Math.ceil(productosFiltrados.value.length / elementosPorPagina)
})

const productosPaginados = computed(() => {
  const inicio = (paginaActual.value - 1) * elementosPorPagina
  const fin = inicio + elementosPorPagina
  return productosFiltrados.value.slice(inicio, fin)
})

const cambiarPagina = (nuevaPagina) => {
  if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas.value) {
    paginaActual.value = nuevaPagina
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const verDetalle = (producto) => {
  $q.notify({
    type: 'info',
    message: `Producto seleccionado: ${producto.nombre} - Stock: ${producto.stock} un.`,
    position: 'top-right'
  })
}

onMounted(() => {
  cargarDatosCatalogo()
})
</script>

<style scoped>
.catalog-container {
  min-height: 100vh;
  background-color: #f4f7f6;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  display: flex;
  flex-direction: column;
}

/* Grilla adaptable profesional */
.public-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.2rem;
  width: 100%;
}

.catalog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #2c3e50;
  color: #ffffff;
  padding: 1rem 2rem;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.logo h1 {
  margin: 0;
  font-size: 1.5rem;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
}

.btn-login {
  background-color: #3498db;
  color: #ffffff;
  padding: 8px 16px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
  transition: background 0.3s;
}

.btn-login:hover {
  background-color: #2980b9;
}

.hero-section {
  background: linear-gradient(135deg, #2c3e50, #3498db);
  color: white;
  padding: 3.5rem 2rem;
  text-align: center;
}

.hero-content {
  max-width: 700px;
  margin: 0 auto;
}

.hero-content h2 {
  font-size: 2.2rem;
  margin-bottom: 1rem;
}

.hero-content p {
  font-size: 1.1rem;
  margin-bottom: 2rem;
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
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
}

.catalog-main {
  display: flex;
  width: 100%;
  max-width: 100% !important;
  margin: 2rem 0;
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

.sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar ul li {
  margin-bottom: 0.8rem;
}

.sidebar ul li a {
  color: #555;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.2s;
  display: block;
  padding: 6px 8px;
  border-radius: 4px;
}

.sidebar ul li a:hover,
.sidebar ul li a.active {
  color: #ffffff;
  background-color: #3498db;
  font-weight: 500;
}

.products-section {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
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

.product-img-wrapper {
  width: 100%;
  height: 140px;
  background: #f4f7f6;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
  overflow: hidden;
}

.product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.category-tag {
  font-size: 0.75rem;
  color: #3498db;
  font-weight: bold;
  text-transform: uppercase;
}

.product-card h3 {
  color: #2c3e50;
  font-size: 1rem;
  margin: 0.5rem 0;
}

.product-desc {
  color: #7f8c8d;
  font-size: 0.85rem;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #f0f0f0;
  padding-top: 1rem;
}

.price {
  color: #2c3e50;
  font-weight: bold;
  font-size: 1.1rem;
}

.btn-detail {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: bold;
}

.btn-detail:hover {
  background-color: #2980b9;
}

.pagination-bar {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 6px;
  padding: 1.5rem 0;
  margin-top: auto;
}

.page-btn {
  background-color: #ffffff;
  border: 1px solid #dcdde1;
  padding: 8px 14px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  color: #2c3e50;
  transition: all 0.2s;
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
  opacity: 0.4;
  cursor: not-allowed;
}

.state-text, .empty-table-state {
  text-align: center;
  padding: 3rem;
  color: #7f8c8d;
  background: white;
  border-radius: 8px;
}

.catalog-footer {
  background-color: #2c3e50;
  color: white;
  text-align: center;
  padding: 1.5rem;
  margin-top: 3rem;
  font-size: 0.9rem;
}

/* Media Queries Profesionales para Responsividad */
@media (max-width: 992px) {
  .catalog-main {
    flex-direction: column;
    padding: 0 1rem;
    gap: 1.5rem;
  }
  .sidebar {
    width: 100%;
    min-width: 100%;
  }
}

@media (max-width: 576px) {
  .catalog-header {
    padding: 1rem;
    flex-direction: column;
    gap: 0.8rem;
  }
  .hero-section {
    padding: 2.5rem 1rem;
  }
  .hero-content h2 {
    font-size: 1.6rem;
  }
}
</style>