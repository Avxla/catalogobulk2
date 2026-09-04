import axios from 'axios';

// Creamos la instancia con la URL base de tu backend
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api', // Ajusta según tu puerto
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor de solicitudes: adjunta el token JWT si existe
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // O puedes obtenerlo de tu store de Pinia
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de respuestas: maneja errores globales
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Opcional: limpiar sesión y redirigir al login si no está autorizado
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;