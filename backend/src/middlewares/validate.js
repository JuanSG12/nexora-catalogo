const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

/**
 * Ejecuta las reglas de express-validator declaradas en la ruta y, si
 * fallan, corta el flujo con un 400 uniforme antes de llegar al controller.
 */
function validate(req, res, next) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const details = result.array().map((e) => ({ campo: e.path, mensaje: e.msg }));
    return next(ApiError.badRequest('Datos de entrada inválidos', details));
  }
  return next();
}

module.exports = validate;
