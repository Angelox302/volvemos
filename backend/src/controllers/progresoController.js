const db = require('../config/database');

const PORCENTAJE_BASE = 50; // Punto de partida

// GET /api/progreso — calcula y devuelve el porcentaje actual
const getProgreso = async (req, res) => {
  try {
    const [acciones] = await db.query(
      'SELECT tipo, porcentaje FROM acciones'
    );

    // Calculamos sumando positivos y restando negativos
    let total = PORCENTAJE_BASE;

    acciones.forEach((accion) => {
      if (accion.tipo === 'positivo') {
        total += accion.porcentaje;
      } else {
        total -= accion.porcentaje;
      }
    });

    // Limitamos entre 0 y 100
    if (total > 100) total = 100;
    if (total < 0) total = 0;

    res.json({
      porcentaje: total,
      base: PORCENTAJE_BASE,
      totalAcciones: acciones.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al calcular el progreso' });
  }
};

module.exports = { getProgreso };
