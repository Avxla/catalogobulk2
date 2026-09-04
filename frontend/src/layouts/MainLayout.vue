<template>
  <div class="admin-layout">
    <!-- Encabezado Interno (Administración) -->
    <header class="admin-header">
      
      <!-- Zona Izquierda: Perfil y Título corporativo limpio -->
      <div class="header-left">
        <button class="profile-trigger" @click="toggleUserModal" title="Mi Cuenta y Perfil">
          <div class="avatar-wrapper">
            <span>👤</span>
          </div>
          <div class="brand-title">
            <span class="brand-name">Catálogo Bulk</span>
            <span class="brand-subtitle">Panel de Control</span>
          </div>
        </button>
      </div>
      
      <!-- Navegación principal -->
      <nav class="nav-links">
        <router-link to="/admin/productos">Productos</router-link>
        <router-link to="/admin/categorias">Categorías</router-link>
        <router-link to="/admin/proveedores">Proveedores</router-link>
        <router-link to="/admin/importaciones">Importaciones</router-link>
      </nav>

      <div class="auth-actions">
        <button @click="cerrarSesion" class="btn-logout">Cerrar Sesión</button>
      </div>
    </header>

    <!-- Contenido Dinámico -->
    <main class="admin-content">
      <router-view />
    </main>

    <!-- PANEL LATERAL IZQUIERDO -->
    <div v-if="showUserModal" class="side-panel-overlay" @click.self="toggleUserModal">
      <div class="side-panel-container">
        <div class="side-panel-header">
          <div class="user-identity">
            <div class="avatar-circle">
              <span>👤</span>
            </div>
            <div>
              <h2>{{ perfilUsuario.nombre || 'Usuario' }}</h2>
              <span class="user-role-badge">Administrador</span>
            </div>
          </div>
          <button class="btn-close-panel" @click="toggleUserModal">&times;</button>
        </div>

        <div class="side-panel-body">
          <form @submit.prevent="guardarPerfil" class="clean-form">
            <div class="form-section-title">Información de la Cuenta</div>
            
            <div class="input-field-group">
              <label>Nombre Completo</label>
              <input type="text" v-model="perfilUsuario.nombre" required />
            </div>
            
            <div class="input-field-group">
              <label>Correo Electrónico</label>
              <input type="email" v-model="perfilUsuario.email" required />
            </div>

            <div class="input-field-group">
              <label>Teléfono</label>
              <input type="text" v-model="perfilUsuario.telefono" placeholder="Añadir número de teléfono" />
            </div>

            <div class="input-field-group">
              <label>Dirección</label>
              <input type="text" v-model="perfilUsuario.direccion" placeholder="Añadir dirección de residencia" />
            </div>

            <div class="side-panel-actions">
              <button type="button" class="btn-text-cancel" @click="toggleUserModal">Cancelar</button>
              <button type="submit" class="btn-solid-save">Guardar Cambios</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const router = useRouter()
const $q = useQuasar()
const showUserModal = ref(false)

const perfilUsuario = ref({
  nombre: 'Administrador Principal',
  email: 'admin@catalogobulk.com',
  telefono: '',
  direccion: ''
})

const toggleUserModal = () => {
  showUserModal.value = !showUserModal.value
}

const guardarPerfil = () => {
  showUserModal.value = false

  $q.notify({
    type: 'positive',
    message: '¡Información actualizada con éxito!',
    position: 'top-right',
    timeout: 2500
  })
}

const cerrarSesion = () => {
  localStorage.removeItem('token')
  
  $q.notify({
    type: 'info',
    message: 'Sesión cerrada correctamente',
    position: 'top-right'
  })

  router.push('/login')
}
</script>

<style scoped>
/* Estilos profesionales y limpios para la cabecera */
.admin-layout { 
  min-height: 100vh; 
  background-color: #f8fafc; 
  font-family: 'Inter', system-ui, -apple-system, sans-serif; 
  display: flex; 
  flex-direction: column; 
}

.admin-header { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  background-color: #0f172a; /* Tono oscuro corporativo moderno */
  color: #ffffff; 
  padding: 0.85rem 2rem; 
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); 
}

.header-left { 
  display: flex; 
  align-items: center; 
}

/* Botón de perfil integrado con la marca de forma sutil */
.profile-trigger {
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.85rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
  transition: background-color 0.2s;
  text-align: left;
}

.profile-trigger:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.avatar-wrapper {
  width: 38px;
  height: 38px;
  background-color: #1e293b;
  border: 1px solid #334155;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
}

.brand-title {
  display: flex;
  flex-direction: column;
}

.brand-name {
  font-size: 1.05rem;
  font-weight: 600;
  color: #f8fafc;
  letter-spacing: -0.01em;
}

.brand-subtitle {
  font-size: 0.7rem;
  font-weight: 500;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Navegación y elementos generales */
.nav-links { 
  display: flex; 
  gap: 0.5rem; 
  align-items: center; 
}

.nav-links a { 
  color: #cbd5e1; 
  text-decoration: none; 
  font-weight: 500; 
  font-size: 0.9rem;
  padding: 0.5rem 0.85rem; 
  border-radius: 6px; 
  transition: all 0.2s; 
}

.nav-links a:hover { 
  color: #ffffff;
  background-color: rgba(255, 255, 255, 0.08); 
}

.nav-links a.router-link-active {
  color: #ffffff;
  background-color: #3b82f6;
}

.btn-logout { 
  background-color: transparent; 
  color: #94a3b8; 
  border: 1px solid #334155; 
  padding: 0.5rem 1rem; 
  border-radius: 6px; 
  font-weight: 500; 
  font-size: 0.85rem;
  cursor: pointer; 
  transition: all 0.2s; 
}

.btn-logout:hover { 
  background-color: #ef4444; 
  border-color: #ef4444;
  color: #ffffff; 
}

.admin-content { 
  flex: 1; 
  width: 100%; 
  box-sizing: border-box; 
}

/* Panel lateral izquierdo (Estilo limpio) */
.side-panel-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(2px);
  display: flex;
  justify-content: flex-start;
  z-index: 1100;
  animation: fadeIn 0.2s ease;
}

.side-panel-container {
  background-color: #ffffff;
  color: #1e293b;
  width: 100%;
  max-width: 440px;
  height: 100%;
  box-shadow: 4px 0 25px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  animation: slideFromLeft 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideFromLeft {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.side-panel-header {
  padding: 1.75rem 1.5rem;
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-identity {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar-circle {
  width: 48px;
  height: 48px;
  background-color: #e2e8f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
}

.side-panel-header h2 {
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.15rem 0;
}

.user-role-badge {
  font-size: 0.7rem;
  font-weight: 600;
  color: #3b82f6;
  background-color: #eff6ff;
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  text-transform: uppercase;
}

.btn-close-panel {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  color: #64748b;
  cursor: pointer;
  line-height: 1;
  padding: 0.2rem;
  transition: color 0.2s;
}

.btn-close-panel:hover {
  color: #0f172a;
}

.side-panel-body {
  padding: 2rem 1.5rem;
  flex: 1;
  overflow-y: auto;
}

.form-section-title {
  font-size: 0.7rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1.25rem;
}

.input-field-group {
  margin-bottom: 1.25rem;
}

.input-field-group label {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  color: #475569;
  margin-bottom: 0.4rem;
}

.input-field-group input {
  width: 100%;
  padding: 0.7rem 0.8rem;
  background-color: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.9rem;
  color: #0f172a;
  outline: none;
  box-sizing: border-box;
  transition: all 0.2s;
}

.input-field-group input:focus {
  background-color: #ffffff;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.side-panel-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.25rem;
  border-top: 1px solid #f1f5f9;
}

.btn-text-cancel {
  background: transparent;
  border: none;
  color: #64748b;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  padding: 0.5rem 0.75rem;
}

.btn-text-cancel:hover {
  color: #1e293b;
}

.btn-solid-save {
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 0.65rem 1.15rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-solid-save:hover {
  background-color: #2563eb;
}
</style>