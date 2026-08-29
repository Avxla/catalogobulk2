<template>
  <div class="admin-layout">
    <!-- Encabezado Interno (Administración) -->
    <header class="admin-header">
      
      <!-- Zona Izquierda: Icono de Cuenta (Perfil) + Título -->
      <div class="header-left">
        <div class="user-profile-icon-container" @click="toggleUserModal">
          <button class="btn-profile-icon" title="Mi Cuenta y Perfil">
            👤
          </button>
        </div>
        <div class="logo">
          <h1>Catálogo Bulk <span class="badge-admin">Admin</span></h1>
        </div>
      </div>
      
      <!-- Navegación principal -->
      <nav class="nav-links">
        <router-link to="/admin/catalogo" class="btn-nav catalog-link">Ver Catálogo</router-link>
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

    <!-- MODAL OSCURO ÚNICO (ESTILO DISCORD LIMPIO) -->
    <div v-if="showUserModal" class="ds-modal-overlay" @click.self="toggleUserModal">
      <div class="ds-modal-box">
        <!-- Banner superior -->
        <div class="ds-banner"></div>

        <!-- Sección de Avatar y Botón -->
        <div class="ds-avatar-row">
          <div class="ds-avatar-circle">
            <span>👤</span>
            <div class="ds-status-dot"></div>
          </div>
          <button class="ds-btn-save-top" @click="guardarPerfil">Guardar Cambios</button>
        </div>

        <!-- Contenido y Formulario con fondo 100% oscuro -->
        <div class="ds-content-area">
          <div class="ds-user-titles">
            <h2>{{ perfilUsuario.nombre || 'Usuario' }}</h2>
            <span class="ds-subtag">Administrador#0001</span>
          </div>

          <div class="ds-separator"></div>

          <form @submit.prevent="guardarPerfil" class="ds-form">
            <div class="ds-section-label">INFORMACIÓN DE LA CUENTA</div>
            
            <div class="ds-input-group">
              <label>NOMBRE COMPLETO</label>
              <input type="text" v-model="perfilUsuario.nombre" required />
            </div>
            
            <div class="ds-input-group">
              <label>CORREO ELECTRÓNICO</label>
              <input type="email" v-model="perfilUsuario.email" required />
            </div>

            <div class="ds-input-group">
              <label>TELÉFONO</label>
              <input type="text" v-model="perfilUsuario.telefono" placeholder="Añadir número de teléfono" />
            </div>

            <div class="ds-input-group">
              <label>DIRECCIÓN</label>
              <input type="text" v-model="perfilUsuario.direccion" placeholder="Añadir dirección de residencia" />
            </div>

            <div class="ds-footer-actions">
              <button type="button" class="ds-btn-cancel" @click="toggleUserModal">Cerrar</button>
              <button type="submit" class="ds-btn-submit">Actualizar Datos</button>
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
import { useQuasar } from 'quasar' // Importar Quasar notify[cite: 2]

const router = useRouter()
const $q = useQuasar() // Inicializar $q[cite: 2]
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

  // Alerta de éxito con Quasar Notify en lugar de alert()
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

<style>
/* ==========================================================
   ESTILOS GLOBALES ABSOLUTOS DEL MODAL (SIN SCOPED)
   Garantizan un fondo oscuro total (#313338) libre de blancos
   ========================================================== */
.ds-modal-overlay {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  background-color: rgba(0, 0, 0, 0.75) !important;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  z-index: 99999 !important;
  backdrop-filter: blur(4px);
}

.ds-modal-box {
  background-color: #313338 !important;
  background: #313338 !important;
  color: #dbdee1 !important;
  width: 100% !important;
  max-width: 440px !important;
  border-radius: 8px !important;
  overflow: hidden !important;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6) !important;
  font-family: 'gg sans', 'Noto Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
}

.ds-banner {
  height: 110px !important;
  background: linear-gradient(135deg, #5865f2, #eb459e) !important;
}

.ds-avatar-row {
  padding: 0 16px !important;
  display: flex !important;
  justify-content: space-between !important;
  align-items: flex-end !important;
  margin-top: -42px !important;
  margin-bottom: 12px !important;
  background: transparent !important;
}

.ds-avatar-circle {
  width: 82px !important;
  height: 82px !important;
  background-color: #2b2d31 !important;
  background: #2b2d31 !important;
  border-radius: 50% !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  font-size: 2.2rem !important;
  border: 6px solid #313338 !important;
  position: relative !important;
}

.ds-status-dot {
  width: 16px !important;
  height: 16px !important;
  background-color: #23a55a !important;
  border: 3px solid #313338 !important;
  border-radius: 50% !important;
  position: absolute !important;
  bottom: 2px !important;
  right: 2px !important;
}

.ds-btn-save-top {
  background-color: #4e5058 !important;
  background: #4e5058 !important;
  color: white !important;
  border: none !important;
  padding: 6px 14px !important;
  border-radius: 4px !important;
  font-size: 0.85rem !important;
  font-weight: 500 !important;
  cursor: pointer !important;
}

.ds-content-area {
  padding: 0 20px 20px 20px !important;
  background-color: #313338 !important;
  background: #313338 !important;
}

.ds-user-titles h2 {
  margin: 0 !important;
  font-size: 1.3rem !important;
  color: #f2f3f5 !important;
  font-weight: 600 !important;
}

.ds-subtag {
  font-size: 0.8rem !important;
  color: #949ba4 !important;
}

.ds-separator {
  height: 1px !important;
  background-color: #3f4147 !important;
  background: #3f4147 !important;
  margin: 14px 0 !important;
}

.ds-form {
  background: transparent !important;
}

.ds-section-label {
  font-size: 0.72rem !important;
  font-weight: 700 !important;
  color: #949ba4 !important;
  letter-spacing: 0.5px !important;
  margin-bottom: 10px !important;
}

.ds-input-group {
  margin-bottom: 12px !important;
  background: transparent !important;
}

.ds-input-group label {
  display: block !important;
  font-size: 0.7rem !important;
  font-weight: 700 !important;
  color: #b5bac1 !important;
  margin-bottom: 6px !important;
}

.ds-input-group input {
  width: 100% !important;
  background-color: #1e1f22 !important;
  background: #1e1f22 !important;
  border: 1px solid transparent !important;
  border-radius: 4px !important;
  padding: 10px !important;
  color: #dbdee1 !important;
  font-size: 0.9rem !important;
  box-sizing: border-box !important;
  outline: none !important;
}

.ds-input-group input:focus {
  border-color: #00a8fc !important;
}

.ds-footer-actions {
  display: flex !important;
  justify-content: flex-end !important;
  gap: 10px !important;
  margin-top: 18px !important;
  background: transparent !important;
}

.ds-btn-submit {
  background-color: #5865f2 !important;
  background: #5865f2 !important;
  color: white !important;
  border: none !important;
  padding: 8px 16px !important;
  border-radius: 4px !important;
  font-weight: 500 !important;
  font-size: 0.9rem !important;
  cursor: pointer !important;
}

.ds-btn-cancel {
  background-color: transparent !important;
  background: transparent !important;
  color: white !important;
  border: none !important;
  padding: 8px 16px !important;
  font-weight: 500 !important;
  cursor: pointer !important;
}
</style>

<style scoped>
/* Estilos normales del layout de administración */
.admin-layout { min-height: 100vh; background-color: #f4f7f6; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; display: flex; flex-direction: column; }
.admin-header { display: flex; justify-content: space-between; align-items: center; background-color: #2c3e50; color: #ffffff; padding: 1rem 2rem; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
.header-left { display: flex; align-items: center; gap: 15px; }
.btn-profile-icon { background: #3498db; border: none; font-size: 1.3rem; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.2s, background 0.2s; color: white; }
.btn-profile-icon:hover { background: #2980b9; transform: scale(1.05); }
.logo h1 { margin: 0; font-size: 1.5rem; display: flex; align-items: center; gap: 10px; }
.badge-admin { background-color: #3498db; font-size: 0.75rem; padding: 2px 8px; border-radius: 4px; font-weight: normal; }
.nav-links { display: flex; gap: 1rem; align-items: center; }
.nav-links a { color: #ffffff; text-decoration: none; font-weight: 500; padding: 0.5rem 1rem; border-radius: 4px; transition: background 0.3s; }
.nav-links a:hover { background-color: #3498db; }
.nav-links a.catalog-link { background-color: rgba(52, 152, 219, 0.25); border: 1px solid #3498db; color: #3498db; }
.nav-links a.catalog-link:hover { background-color: #3498db; color: white; }
.btn-logout { background-color: #e74c3c; color: #ffffff; border: none; padding: 8px 16px; border-radius: 4px; font-weight: bold; cursor: pointer; transition: background 0.3s; }
.btn-logout:hover { background-color: #c0392b; }
.admin-content { flex: 1; width: 100%; box-sizing: border-box; }
</style>