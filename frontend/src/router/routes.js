import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'
import CatalogView from '../views/CatalogView.vue'
import LoginView from '../views/LoginView.vue'
 import { Notify } from 'quasar'
const routes = [
  {
    path: '/',
    component: CatalogView // Vista pública inicial al abrir la app
  },
  {
    path: '/login',
    component: LoginView
  },
  {
    path: '/admin',
    component: MainLayout,
    meta: { requiresAuth: true }, // Todo lo que esté aquí dentro requiere sesión
    children: [
      {
        path: '',
        component: CatalogView // 👈 Al entrar logueado, ve directamente al catálogo con el menú de admin
      },
      {
        path: 'catalogo',
        component: CatalogView
      },
      {
        path: 'productos',
        component: () => import('../views/ProductosView.vue')
      },
      {
        path: 'proveedores',
        component: () => import('../views/ProveedoresView.vue')
      },
      {
        path: 'categorias',
        component: () => import('../views/CategoriasView.vue')
      },
      {
        path: 'importaciones',
        component: () => import('../views/ImportacionesView.vue')
      },
      {
        path: 'usuarios',
        component: () => import('../views/UsuariosView.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation Guard correcto
router.beforeEach((to, from) => {
  // Definimos la verificación de autenticación aquí mismo
  const isAuthenticated = !!localStorage.getItem('token') // o el nombre de tu variable en storage

  if (to.meta.requiresAuth && !isAuthenticated) {
    return '/login' // Redirige al login si no está autenticado
  }
})
export default router