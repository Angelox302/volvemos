const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const accionesRoutes = require('./routes/accionesRoutes');
const progresoRoutes = require('./routes/progresoRoutes');

const app = express();

// Middleware global
app.use(cors());                  // Permite peticiones desde la app móvil
app.use(express.json());          // Permite leer JSON en el body de los requests

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/acciones', accionesRoutes);
app.use('/api/progreso', progresoRoutes);

// Ruta de prueba para verificar que el servidor está vivo
app.get('/', (req, res) => {
  res.json({ mensaje: '¡Servidor Volvemos funcionando! ❤️' });
});

module.exports = app;
