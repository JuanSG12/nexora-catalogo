const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const env = require('../config/env');

/**
 * Protege rutas de administración exigiendo un Bearer token JWT válido,
 * emitido por authService.login. Adjunta el payload en req.admin.
 */
function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next(ApiError.unauthorized('Token de autenticación no proporcionado'));
  }

  try {
    req.admin = jwt.verify(token, env.jwtSecret);
    return next();
  } catch (err) {
    return next(ApiError.unauthorized('Token inválido o expirado'));
  }
}

module.exports = { requireAuth };
