<template>
  <div class="auth-container">
    <div class="auth-box" :class="{ 'sign-up-mode': isSignUpMode }">
      
      <!-- Formulario de Registro (Sign Up) -->
      <div class="form-container sign-up-container">
        <form @submit.prevent="handleRegister">
          <h2>Crear Cuenta</h2>
          <div class="form-group">
            <input type="text" v-model="registerForm.nombre" placeholder="Nombre completo" required />
          </div>
          <div class="form-group">
            <input type="email" v-model="registerForm.email" placeholder="Correo electrónico" required />
          </div>
          <div class="form-group">
            <input type="password" v-model="registerForm.password" placeholder="Contraseña" required />
          </div>
          <button type="submit" class="btn-submit" :disabled="loading">
            {{ loading ? 'Registrando...' : 'REGISTRARSE' }}
          </button>
          
          <!-- Botón de alternancia visible solo en móviles -->
          <div class="mobile-toggle-link">
            ¿Ya tienes una cuenta? <span @click="isSignUpMode = false">Inicia sesión</span>
          </div>
        </form>
      </div>

      <!-- Formulario de Inicio de Sesión (Sign In) -->
      <div class="form-container sign-in-container">
        <form @submit.prevent="handleLogin">
          <h2>Iniciar Sesión</h2>
          <div class="form-group">
            <input type="email" v-model="loginForm.email" placeholder="Correo electrónico" required />
          </div>
          <div class="form-group">
            <input type="password" v-model="loginForm.password" placeholder="Contraseña" required />
          </div>
          <button type="submit" class="btn-submit" :disabled="loading">
            {{ loading ? 'Ingresando...' : 'ENTRAR' }}
          </button>

          <!-- Botón de alternancia visible solo en móviles -->
          <div class="mobile-toggle-link">
            ¿No tienes cuenta? <span @click="isSignUpMode = true">Regístrate aquí</span>
          </div>
        </form>
      </div>

      <!-- Panel Deslizante (Overlay) - Oculto en pantallas pequeñas para evitar solapamientos -->
      <div class="overlay-container">
        <div class="overlay">
          <div class="overlay-panel overlay-right">
            <h2>¡Bienvenido!</h2>
            <p>Regístrate y comienza a gestionar tu catálogo de forma eficiente</p>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import authService from '../services/auth.service'

const router = useRouter()
const $q = useQuasar()
const isSignUpMode = ref(false)
const loading = ref(false)

const loginForm = ref({ email: '', password: '' })
const registerForm = ref({ nombre: '', email: '', password: '' })

// Capturar mensajes pendientes del router al cargar la vista
onMounted(() => {
  const mensajeFlash = localStorage.getItem('flash_message')
  if (mensajeFlash) {
    $q.notify({
      type: 'warning',
      message: mensajeFlash,
      position: 'top-right',
      timeout: 4000
    })
    localStorage.removeItem('flash_message')
  }
})

// Manejar Inicio de Sesión
const handleLogin = async () => {
  loading.value = true
  try {
    const data = await authService.login(loginForm.value)
    localStorage.setItem('token', data.token)
    
    $q.notify({
      type: 'positive',
      message: '¡Bienvenido de nuevo!',
      position: 'top-right',
      timeout: 2500
    })

    router.push('/admin/productos')
  } catch (err) {
    const mensajeError = err.response?.data?.message || 'Credenciales incorrectas'
    $q.notify({
      type: 'negative',
      message: mensajeError,
      position: 'top-right',
      timeout: 3000
    })
  } finally {
    loading.value = false
  }
}

// Manejar Registro
const handleRegister = async () => {
  loading.value = true
  try {
    await authService.registrar(registerForm.value)
    
    $q.notify({
      type: 'positive',
      message: '¡Cuenta creada con éxito! Ahora puedes iniciar sesión.',
      position: 'top-right',
      timeout: 3000
    })

    registerForm.value = { nombre: '', email: '', password: '' }
    setTimeout(() => {
      isSignUpMode.value = false
    }, 1000)
  } catch (err) {
    const mensajeError = err.response?.data?.message || 'Error al registrarse'
    $q.notify({
      type: 'negative',
      message: mensajeError,
      position: 'top-right',
      timeout: 3000
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f4f7f6;
  padding: 1rem;
  box-sizing: border-box;
}

.auth-box {
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 14px 28px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.08);
  position: relative;
  overflow: hidden;
  width: 768px;
  max-width: 100%;
  min-height: 480px;
}

.form-container {
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.6s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 50px;
  text-align: center;
  box-sizing: border-box;
}

.sign-in-container {
  left: 0;
  width: 50%;
  z-index: 2;
}

.auth-box.sign-up-mode .sign-in-container {
  transform: translateX(100%);
  opacity: 0;
  pointer-events: none;
}

.sign-up-container {
  left: 0;
  width: 50%;
  opacity: 0;
  z-index: 1;
  pointer-events: none;
}

.auth-box.sign-up-mode .sign-up-container {
  transform: translateX(100%);
  opacity: 1;
  z-index: 5;
  pointer-events: auto;
  animation: show 0.6s;
}

@keyframes show {
  0%, 49.99% { opacity: 0; z-index: 1; }
  50%, 100% { opacity: 1; z-index: 5; }
}

.overlay-container {
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: transform 0.6s ease-in-out;
  z-index: 100;
}

.auth-box.sign-up-mode .overlay-container {
  transform: translateX(-100%);
}

.overlay {
  background: #2c3e50;
  background: linear-gradient(to right, #3498db, #2c3e50);
  color: #ffffff;
  position: relative;
  left: -100%;
  height: 100%;
  width: 200%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
}

.auth-box.sign-up-mode .overlay {
  transform: translateX(50%);
}

.overlay-panel {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 40px;
  text-align: center;
  top: 0;
  height: 100%;
  width: 50%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
}

.overlay-right {
  right: 0;
  transform: translateX(0);
}

/* Elementos de formulario */
form {
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 20px;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
}

h2 {
  font-weight: bold;
  margin-bottom: 20px;
  color: #2c3e50;
  font-size: 1.8rem;
}

.overlay-panel h2 {
  color: #ffffff;
}

.overlay-panel p {
  font-size: 0.95rem;
  line-height: 1.5;
  margin-top: 10px;
}

.form-group {
  width: 100%;
  margin-bottom: 15px;
}

input {
  background-color: #f4f7f6;
  border: 1px solid #bdc3c7;
  padding: 12px 15px;
  width: 100%;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 1rem;
  outline: none;
}

input:focus {
  border-color: #3498db;
}

.btn-submit {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 12px 35px;
  border-radius: 4px;
  font-weight: bold;
  letter-spacing: 1px;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.2s;
  width: 100%;
}

.btn-submit:hover {
  background-color: #2980b9;
}

.mobile-toggle-link {
  display: none;
  margin-top: 15px;
  font-size: 0.85rem;
  color: #7f8c8d;
}

.mobile-toggle-link span {
  color: #3498db;
  font-weight: bold;
  cursor: pointer;
}

/* Media Queries para Responsividad Completa en Móviles y Tablets */
@media (max-width: 768px) {
  .auth-box {
    width: 100%;
    min-height: 420px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  }

  .overlay-container {
    display: none; /* Ocultamos el panel lateral deslizante en pantallas pequeñas */
  }

  .form-container {
    width: 100% !important;
    padding: 0 20px;
    transform: none !important;
    opacity: 1 !important;
  }

  /* Control alternado basado en la clase sign-up-mode para móviles */
  .sign-in-container {
    display: flex;
    z-index: 2;
  }

  .sign-up-container {
    display: none;
    z-index: 1;
  }

  .auth-box.sign-up-mode .sign-in-container {
    display: none;
  }

  .auth-box.sign-up-mode .sign-up-container {
    display: flex;
    z-index: 5;
    animation: none;
  }

  .mobile-toggle-link {
    display: block;
  }

  h2 {
    font-size: 1.5rem;
    margin-bottom: 15px;
  }
}
</style>