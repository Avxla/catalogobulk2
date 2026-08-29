<template>
  <div class="catalog-container">
    <!-- Encabezado Público: Solo se muestra si NO estamos en la ruta de administración -->
    <header class="catalog-header" v-if="!isAdminRoute">
      <div class="logo">
        <h1>Catálogo Bulk</h1>
      </div>
      <nav class="nav-links">
        <a @click.prevent="alertarAcceso">Productos</a>
        <a @click.prevent="alertarAcceso">Categorías</a>
        <a @click.prevent="alertarAcceso">Proveedores</a>
        
        <a @click.prevent="alertarAcceso">Importaciones</a>
      </nav>
      <div class="auth-actions">
        <router-link to="/login" class="btn-login">Iniciar Sesión</router-link>
      </div>
    </header>

    <!-- Sección Hero / Banner Principal -->
    <section class="hero-section">
      <div class="hero-content">
        <h2>Soluciones al por mayor para tu negocio</h2>
        <p>Explora nuestro inventario actualizado en tiempo real. Calidad, confianza y los mejores precios del mercado.</p>
        <div class="search-bar">
          <input type="text" placeholder="¿Qué producto estás buscando?" v-model="busqueda" />
          <button class="btn-search">Buscar</button>
        </div>
      </div>
    </section>

    <!-- Contenido Principal: Sidebar de Filtros + Grilla de Productos -->
    <div class="catalog-main">
      <!-- Barra lateral de categorías (Simulada) -->
      <aside class="sidebar">
        <h3>Categorías</h3>
        <ul>
          <li><a @click.prevent="alertarAcceso">Todos los productos</a></li>
          <li><a @click.prevent="alertarAcceso">Electrónica y Tecnología</a></li>
          <li><a @click.prevent="alertarAcceso">Alimentos y Bebidas</a></li>
          <li><a @click.prevent="alertarAcceso">Hogar y Oficina</a></li>
          <li><a @click.prevent="alertarAcceso">Construcción y Ferretería</a></li>
        </ul>

        <div class="sidebar-banner">
          <h4>¿Eres proveedor?</h4>
          <p>Inicia sesión y gestiona tus catálogos de forma directa.</p>
          <router-link to="/login" class="btn-sidebar">Acceder</router-link>
        </div>
      </aside>

      <!-- Grilla de Productos Extendida -->
      <section class="products-section">
        <div class="section-title">
          <h3>Productos Destacados</h3>
          <span class="results-count">Mostrando catálogo público</span>
        </div>

        <div class="public-grid">
          <div class="product-card" v-for="i in 6" :key="i">
            <div class="product-img-placeholder">📦</div>
            <span class="category-tag">Categoría General</span>
            <h3>Producto Comercialización #{{ i }}</h3>
            <p class="product-desc">Descripción breve del producto al por mayor, ideal para distribución masiva.</p>
            <div class="card-footer">
              <span class="price">$149.99</span>
              <button class="btn-detail" @click="alertarAcceso">Ver más</button>
            </div>
          </div>
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
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from '../stores/auth.js'

const router = useRouter()
const route = useRoute()
const $q = useQuasar()
const authStore = useAuthStore() // Inicializas tu store de Pinia

const busqueda = ref('')

const isAdminRoute = computed(() => route.path.startsWith('/admin'))

const alertarAcceso = () => {
  // Verificas la autenticación directamente desde el estado de Pinia
  if (!authStore.token) { // O puedes usar authStore.isAuthenticated si lo tienes definido así
    $q.notify({
      type: 'warning',
      message: 'Debes iniciar sesión para acceder a esta sección.',
      position: 'top-right',
      timeout: 2500
    })
    router.push('/login')
  } else {
    console.log("Usuario ya autenticado mediante Pinia, acceso permitido.")
  }
}
</script>

<style scoped>
.catalog-container {
  min-height: 100vh;
  background-color: #f4f7f6;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  display: flex;
  flex-direction: column;
}

/* Encabezado */
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

.nav-links a {
  color: #ffffff;
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
  padding: 0.5rem 1rem;
  transition: background 0.3s;
  border-radius: 4px;
}

.nav-links a:hover {
  background-color: #3498db;
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

/* Banner Hero */
.hero-section {
  background: linear-gradient(135deg, #2c3e50, #3498db);
  color: white;
  padding: 4rem 2rem;
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

.btn-search:hover {
  background-color: #2980b9;
}

/* Cuerpo principal (Sidebar + Grilla) */
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

/* Sidebar */
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

.sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0 0 2rem 0;
}

.sidebar ul li {
  margin-bottom: 0.8rem;
}

.sidebar ul li a {
  color: #555;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.2s;
}

.sidebar ul li a:hover {
  color: #3498db;
  font-weight: 500;
}

.sidebar-banner {
  background: #f4f7f6;
  padding: 1rem;
  border-radius: 6px;
  text-align: center;
}

.sidebar-banner h4 {
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
}

.sidebar-banner p {
  font-size: 0.85rem;
  color: #7f8c8d;
  margin-bottom: 1rem;
}

.btn-sidebar {
  display: inline-block;
  background-color: #2c3e50;
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: bold;
}

/* Sección de Productos */
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
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 0.5rem;
  background: #f4f7f6;
  padding: 1rem;
  border-radius: 6px;
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

/* Footer */
.catalog-footer {
  background-color: #2c3e50;
  color: white;
  text-align: center;
  padding: 1.5rem;
  margin-top: 3rem;
  font-size: 0.9rem;
}
</style>