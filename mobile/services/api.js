import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Cambia esta IP por la IP local de tu PC cuando pruebes en el teléfono físico.
// Si usas el emulador de Android, usa 10.0.2.2 en lugar de localhost.
const BASE_URL = 'http://192.168.20.37:3000/api';

// Creamos una instancia de axios con la URL base
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Interceptor: antes de cada request, añade el token automáticamente
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
