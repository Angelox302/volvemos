const jwt = require('jsonwebtoken');

// Verifica que el request tenga un token JWT válido
const verificarToken = (req, res, next) => {
  // El token viene en el header Authorization: Bearer <token>
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ mensaje: 'Acceso denegado: no hay token' });
  }

  try {
    // Verificamos y decodificamos el token
    const datos = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = datos; // { id, nombre, rol }
    next();
  } catch (error) {
    return res.status(401).json({ mensaje: 'Token inválido o expirado' });
  }
};

// Verifica que el usuario autenticado tenga rol "admin"
const soloAdmin = (req, res, next) => {
  if (req.usuario.rol !== 'admin') {
    return res.status(403).json({ mensaje: 'Acceso denegado: se requiere rol admin' });
  }
  next();
};

module.exports = { verificarToken, soloAdmin };
