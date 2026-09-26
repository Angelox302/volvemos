const express = require('express');
const router = express.Router();
const { getAcciones, crearAccion, editarAccion, eliminarAccion } = require('../controllers/accionesController');
const { verificarToken, soloAdmin } = require('../middleware/authMiddleware');

// GET /api/acciones — cualquier usuario autenticado puede ver las acciones
router.get('/', verificarToken, getAcciones);

// POST /api/acciones — solo admin puede crear
router.post('/', verificarToken, soloAdmin, crearAccion);

// PUT /api/acciones/:id — solo admin puede editar
router.put('/:id', verificarToken, soloAdmin, editarAccion);

// DELETE /api/acciones/:id — solo admin puede eliminar
router.delete('/:id', verificarToken, soloAdmin, eliminarAccion);

module.exports = router;
