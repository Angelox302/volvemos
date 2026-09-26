const db = require('../config/database');

// GET /api/acciones — devuelve todas las acciones
const getAcciones = async (req, res) => {
  try {
    const [acciones] = await db.query(
      'SELECT * FROM acciones ORDER BY fecha DESC'
    );
    res.json(acciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener las acciones' });
  }
};

// POST /api/acciones — crea una nueva acción (solo admin)
const crearAccion = async (req, res) => {
  const { titulo, descripcion, porcentaje, tipo, fecha } = req.body;

  // Validaciones básicas
  if (!titulo || !porcentaje || !tipo) {
    return res.status(400).json({ mensaje: 'titulo, porcentaje y tipo son obligatorios' });
  }

  if (tipo !== 'positivo' && tipo !== 'negativo') {
    return res.status(400).json({ mensaje: 'tipo debe ser "positivo" o "negativo"' });
  }

  if (porcentaje <= 0) {
    return res.status(400).json({ mensaje: 'porcentaje debe ser un número positivo' });
  }

  try {
    const fechaFinal = fecha || new Date();
    const [resultado] = await db.query(
      'INSERT INTO acciones (titulo, descripcion, porcentaje, tipo, fecha, creado_por) VALUES (?, ?, ?, ?, ?, ?)',
      [titulo, descripcion || null, porcentaje, tipo, fechaFinal, req.usuario.id]
    );

    res.status(201).json({
      mensaje: 'Acción creada correctamente',
      id: resultado.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear la acción' });
  }
};

// PUT /api/acciones/:id — edita una acción existente (solo admin)
const editarAccion = async (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion, porcentaje, tipo, fecha } = req.body;

  if (!titulo || !porcentaje || !tipo) {
    return res.status(400).json({ mensaje: 'titulo, porcentaje y tipo son obligatorios' });
  }

  if (tipo !== 'positivo' && tipo !== 'negativo') {
    return res.status(400).json({ mensaje: 'tipo debe ser "positivo" o "negativo"' });
  }

  try {
    const [resultado] = await db.query(
      'UPDATE acciones SET titulo = ?, descripcion = ?, porcentaje = ?, tipo = ?, fecha = ? WHERE id = ?',
      [titulo, descripcion || null, porcentaje, tipo, fecha || new Date(), id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Acción no encontrada' });
    }

    res.json({ mensaje: 'Acción actualizada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al editar la acción' });
  }
};

// DELETE /api/acciones/:id — elimina una acción (solo admin)
const eliminarAccion = async (req, res) => {
  const { id } = req.params;

  try {
    const [resultado] = await db.query('DELETE FROM acciones WHERE id = ?', [id]);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Acción no encontrada' });
    }

    res.json({ mensaje: 'Acción eliminada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al eliminar la acción' });
  }
};

module.exports = { getAcciones, crearAccion, editarAccion, eliminarAccion };
