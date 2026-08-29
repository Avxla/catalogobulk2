<template>
  <div class="catalog-container">
    <!-- Banner Principal -->
    <section class="hero-section">
      <div class="hero-content">
        <h2>Gestión de Categorías</h2>
        <p>Organiza y clasifica tus artículos para mantener un catálogo estructurado.</p>
        <div class="search-bar">
          <input type="text" placeholder="Buscar categoría..." v-model="busqueda" />
          <button class="btn-search" @click="toggleModal(true)">+ Nueva Categoría</button>
        </div>
      </div>
    </section>

    <!-- Contenido Principal: Sidebar + Grilla -->
    <div class="catalog-main">
      <aside class="sidebar">
        <h3>Resumen</h3>
        <div class="counter-box">
          <span class="counter-label">Categorías activas</span>
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

        <div v-else class="public-grid">
          <div class="product-card" v-for="cat in categoriasFiltradas" :key="cat._id || cat.id">
            <div class="product-img-placeholder">🏷️</div>
            <h3>{{ cat.nombre }}</h3>
            <p class="product-desc">{{ cat.descripcion || 'Sin descripción disponible.' }}</p>
            
            <div class="card-footer">
              <span class="price-small">Activa</span>
              <button class="btn-detail danger" @click="eliminarCategoria(cat._id || cat.id)">Eliminar</button>
            </div>
          </div>
          
          <div v-if="categoriasFiltradas.length === 0" class="empty-grid-state">
            <p>No se encontraron categorías registradas.</p>
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
            <input type="text" v-model="nuevaCategoria.nombre" placeholder="Ej. Electrónica" required />
          </div>
          <div class="form-group">
            <label>Descripción</label>
            <input type="text" v-model="nuevaCategoria.descripcion" placeholder="Detalles de la categoría..." />
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
import api from '../services/api'

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
  return categorias.value.filter(c => c.nombre.toLowerCase().includes(busqueda.value.toLowerCase()))
})

const obtenerCategorias = async () => {
  loading.value = true
  try {
    const response = await api.get('/categorias')
    categorias.value = response.data
  } catch (err) {
    error.value = 'Error al cargar las categorías del servidor.'
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
  } catch (err) {
    alert('Error al crear la categoría')
  }
}

const eliminarCategoria = async (id) => {
  if (confirm('¿Estás seguro de eliminar esta categoría?')) {
    try {
      await api.delete(`/categorias/${id}`)
      obtenerCategorias()
    } catch (err) {
      alert('Error al eliminar la categoría')
    }
  }
}

onMounted(() => {
  obtenerCategorias()
})
</script>

<style scoped>
/* Comparten el mismo diseño estilizado del sistema */
.catalog-container { min-height: calc(100vh - 70px); background-color: #f4f7f6; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; display: flex; flex-direction: column; }
.hero-section { background: linear-gradient(135deg, #2c3e50, #d35400); color: white; padding: 3rem 2rem; text-align: center; }
.hero-content { max-width: 700px; margin: 0 auto; }
.hero-content h2 { font-size: 2rem; margin-bottom: 0.5rem; }
.hero-content p { font-size: 1rem; margin-bottom: 1.5rem; opacity: 0.9; }
.search-bar { display: flex; background: white; padding: 5px; border-radius: 6px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
.search-bar input { flex: 1; border: none; padding: 10px 15px; font-size: 1rem; outline: none; border-radius: 4px; }
.btn-search { background-color: #d35400; color: white; border: none; padding: 10px 20px; border-radius: 4px; font-weight: bold; cursor: pointer; white-space: nowrap; }
.btn-search:hover { background-color: #ba4a00; }
.catalog-main { display: flex; max-width: 1200px; margin: 2rem auto; padding: 0 1rem; gap: 2rem; flex: 1; width: 100%; box-sizing: border-box; }
.sidebar { width: 250px; background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); height: fit-content; }
.sidebar h3 { color: #2c3e50; margin-top: 0; margin-bottom: 1rem; font-size: 1.2rem; border-bottom: 2px solid #f4f7f6; padding-bottom: 0.5rem; }
.counter-box { background: #f8f9fa; padding: 1rem; border-radius: 6px; text-align: center; }
.counter-label { display: block; font-size: 0.85rem; color: #7f8c8d; margin-bottom: 0.3rem; }
.counter-number { font-size: 1.8rem; font-weight: bold; color: #2c3e50; }
.products-section { flex: 1; }
.section-title { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
.section-title h3 { color: #2c3e50; margin: 0; font-size: 1.4rem; }
.results-count { color: #7f8c8d; font-size: 0.9rem; }
.public-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1.5rem; }
.product-card { background: #ffffff; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); display: flex; flex-direction: column; justify-content: space-between; transition: transform 0.2s; }
.product-card:hover { transform: translateY(-3px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
.product-img-placeholder { font-size: 2rem; text-align: center; margin-bottom: 0.5rem; background: #fbfbee; padding: 0.8rem; border-radius: 6px; }
.product-card h3 { color: #2c3e50; font-size: 1.1rem; margin: 0.4rem 0; }
.product-desc { color: #555; font-size: 0.85rem; margin-bottom: 1rem; }
.card-footer { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f0f0f0; padding-top: 1rem; }
.price-small { color: #d35400; font-size: 0.85rem; font-weight: bold; }
.btn-detail { background-color: #e74c3c; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 0.85rem; font-weight: bold; }
.btn-detail:hover { background-color: #c0392b; }
.state-text, .empty-grid-state { text-align: center; padding: 3rem; color: #7f8c8d; grid-column: 1 / -1; background: white; border-radius: 8px; }
.modal-backdrop { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(44, 62, 80, 0.6); display: flex; justify-content: center; align-items: center; z-index: 1000; backdrop-filter: blur(3px); }
.modal-content { background: white; padding: 2rem; border-radius: 12px; width: 100%; max-width: 450px; box-shadow: 0 10px 30px rgba(0,0,0,0.15); }
.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
.modal-header h3 { margin: 0; color: #2c3e50; }
.close-btn { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #7f8c8d; }
.form-group { margin-bottom: 1.2rem; }
.form-group label { display: block; margin-bottom: 6px; font-weight: 500; font-size: 0.9rem; color: #34495e; }
.form-group input { width: 100%; padding: 10px 12px; border: 1px solid #dcdde1; border-radius: 6px; box-sizing: border-box; outline: none; font-size: 0.95rem; }
.modal-footer { display: flex; justify-content: flex-end; gap: 10px; margin-top: 2rem; }
.btn-primary { background-color: #d35400; color: white; padding: 10px 20px; border-radius: 6px; border: none; cursor: pointer; font-weight: 600; }
.btn-primary:hover { background-color: #ba4a00; }
.btn-secondary { background-color: #ecf0f1; color: #7f8c8d; padding: 10px 20px; border-radius: 6px; border: none; cursor: pointer; font-weight: 600; }
</style>