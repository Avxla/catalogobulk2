<template>
  <div class="catalog-container">
    <!-- Banner Principal -->
    <section class="hero-section">
      <div class="hero-content">
        <h2>Gestión de Usuarios</h2>
        <p>Administra las cuentas de acceso, roles y permisos de los operadores del sistema.</p>
        <div class="search-bar">
          <input type="text" placeholder="Buscar usuario por nombre o correo..." v-model="busqueda" />
          <button class="btn-search" @click="toggleModal(true)">+ Nuevo Usuario</button>
        </div>
      </div>
    </section>

    <!-- Contenido Principal -->
    <div class="catalog-main">
      <aside class="sidebar">
        <h3>Resumen</h3>
        <div class="counter-box">
          <span class="counter-label">Usuarios registrados</span>
          <span class="counter-number">{{ usuarios.length }}</span>
        </div>
      </aside>

      <section class="products-section">
        <div class="section-title">
          <h3>Directorio de Usuarios</h3>
          <span class="results-count">Mostrando {{ usuariosFiltrados.length }} de {{ usuarios.length }}</span>
        </div>

        <p v-if="loading" class="state-text">Cargando usuarios...</p>
        <p v-else-if="error" class="state-text error">{{ error }}</p>

        <div v-else class="public-grid">
          <div class="product-card" v-for="usuario in usuariosFiltrados" :key="usuario._id || usuario.id">
            <div class="product-img-placeholder">👤</div>
            
            <div class="card-badges">
              <span class="badge role">{{ usuario.rol || usuario.role || 'Operador' }}</span>
            </div>

            <h3>{{ usuario.nombre || usuario.name }}</h3>
            <p class="product-desc">✉️ {{ usuario.email }}</p>
            <p class="product-desc">📞 {{ usuario.telefono || 'Sin teléfono' }}</p>
            
            <div class="card-footer">
              <span class="price-small">Activo</span>
              <button class="btn-detail danger" @click="eliminarUsuario(usuario._id || usuario.id)">Eliminar</button>
            </div>
          </div>
          
          <div v-if="usuariosFiltrados.length === 0" class="empty-grid-state">
            <p>No se encontraron usuarios registrados.</p>
          </div>
        </div>
      </section>
    </div>

    <!-- Modal para crear usuario -->
    <div v-if="showModal" class="modal-backdrop">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Registrar Nuevo Usuario</h3>
          <button class="close-btn" @click="toggleModal(false)">&times;</button>
        </div>
        <form @submit.prevent="crearUsuario">
          <div class="form-group">
            <label>Nombre completo</label>
            <input type="text" v-model="nuevoUsuario.nombre" placeholder="Ej. Ana Gómez" required />
          </div>
          <div class="form-group">
            <label>Correo electrónico</label>
            <input type="email" v-model="nuevoUsuario.email" placeholder="correo@sistema.com" required />
          </div>
          <div class="form-group">
            <label>Teléfono</label>
            <input type="text" v-model="nuevoUsuario.telefono" placeholder="Ej. +57 3001234567" />
          </div>
          <div class="form-group">
            <label>Dirección</label>
            <input type="text" v-model="nuevoUsuario.direccion" placeholder="Ej. Calle Principal #123" />
          </div>
          <div class="form-group">
            <label>Contraseña</label>
            <input type="password" v-model="nuevoUsuario.password" placeholder="••••••••" required />
          </div>
          <div class="form-group">
            <label>Rol del sistema</label>
            <select v-model="nuevoUsuario.rol" class="form-select" required>
              <option value="Administrador">Administrador</option>
              <option value="Operador">Operador</option>
              <option value="Almacenista">Almacenista</option>
            </select>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn-secondary" @click="toggleModal(false)">Cancelar</button>
            <button type="submit" class="btn-primary">Guardar Usuario</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../services/api'

const usuarios = ref([])
const loading = ref(true)
const error = ref(null)
const showModal = ref(false)
const busqueda = ref('')

const nuevoUsuario = ref({
  nombre: '',
  email: '',
  telefono: '',
  direccion: '',
  password: '',
  rol: 'Operador'
})

const usuariosFiltrados = computed(() => {
  return usuarios.value.filter(u => {
    const nombre = u.nombre || u.name || ''
    const email = u.email || ''
    const query = busqueda.value.toLowerCase()
    return nombre.toLowerCase().includes(query) || email.toLowerCase().includes(query)
  })
})

const obtenerUsuarios = async () => {
  loading.value = true
  try {
    const response = await api.get('/usuarios')
    usuarios.value = response.data
  } catch (err) {
    error.value = 'Error al cargar los usuarios del servidor.'
  } finally {
    loading.value = false
  }
}

const toggleModal = (isOpen) => {
  showModal.value = isOpen
  if (!isOpen) {
    nuevoUsuario.value = { nombre: '', email: '', telefono: '', direccion: '', password: '', rol: 'Operador' }
  }
}

const crearUsuario = async () => {
  try {
    await api.post('/usuarios', nuevoUsuario.value)
    toggleModal(false)
    obtenerUsuarios()
  } catch (err) {
    alert('Error al crear el usuario')
  }
}

const eliminarUsuario = async (id) => {
  if (confirm('¿Estás seguro de eliminar este usuario?')) {
    try {
      await api.delete(`/usuarios/${id}`)
      obtenerUsuarios()
    } catch (err) {
      alert('Error al eliminar el usuario')
    }
  }
}

onMounted(() => {
  obtenerUsuarios()
})
</script>

<style scoped>
.catalog-container { min-height: calc(100vh - 70px); background-color: #f4f7f6; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; display: flex; flex-direction: column; }
.hero-section { background: linear-gradient(135deg, #2c3e50, #16a085); color: white; padding: 3rem 2rem; text-align: center; }
.hero-content { max-width: 700px; margin: 0 auto; }
.hero-content h2 { font-size: 2rem; margin-bottom: 0.5rem; }
.hero-content p { font-size: 1rem; margin-bottom: 1.5rem; opacity: 0.9; }
.search-bar { display: flex; background: white; padding: 5px; border-radius: 6px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
.search-bar input { flex: 1; border: none; padding: 10px 15px; font-size: 1rem; outline: none; border-radius: 4px; }
.btn-search { background-color: #16a085; color: white; border: none; padding: 10px 20px; border-radius: 4px; font-weight: bold; cursor: pointer; white-space: nowrap; }
.btn-search:hover { background-color: #138d75; }
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
.product-img-placeholder { font-size: 2rem; text-align: center; margin-bottom: 0.5rem; background: #e8f8f5; padding: 0.8rem; border-radius: 6px; }
.card-badges { display: flex; gap: 6px; margin-bottom: 0.5rem; }
.badge.role { font-size: 0.7rem; padding: 3px 8px; border-radius: 12px; font-weight: bold; text-transform: uppercase; background-color: #e8f8f5; color: #16a085; }
.product-card h3 { color: #2c3e50; font-size: 1.1rem; margin: 0.4rem 0; }
.product-desc { color: #555; font-size: 0.85rem; margin-bottom: 0.5rem; word-break: break-all; }
.card-footer { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f0f0f0; padding-top: 1rem; }
.price-small { color: #27ae60; font-size: 0.85rem; font-weight: bold; }
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
.form-group input, .form-select { width: 100%; padding: 10px 12px; border: 1px solid #dcdde1; border-radius: 6px; box-sizing: border-box; outline: none; font-size: 0.95rem; background: white; }
.modal-footer { display: flex; justify-content: flex-end; gap: 10px; margin-top: 2rem; }
.btn-primary { background-color: #16a085; color: white; padding: 10px 20px; border-radius: 6px; border: none; cursor: pointer; font-weight: 600; }
.btn-primary:hover { background-color: #138d75; }
.btn-secondary { background-color: #ecf0f1; color: #7f8c8d; padding: 10px 20px; border-radius: 6px; border: none; cursor: pointer; font-weight: 600; }
</style>