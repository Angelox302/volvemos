const express = require('express');
const router = express.Router();
const { getProgreso } = require('../controllers/progresoController');
const { verificarToken } = require('../middleware/authMiddleware');

// GET /api/progreso — cualquier usuario autenticado puede ver el porcentaje
router.get('/', verificarToken, getProgreso);

module.exports = router;
