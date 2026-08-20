const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const adminRepository = require('../repositories/adminRepository');
const ApiError = require('../utils/ApiError');
const env = require('../config/env');

async function login(usuario, password) {
  const admin = adminRepository.findByUsuario(usuario);
  if (!admin) {
    throw ApiError.unauthorized('Usuario o contraseña incorrectos');
  }

  const passwordValida = await bcrypt.compare(password, admin.password_hash);
  if (!passwordValida) {
    throw ApiError.unauthorized('Usuario o contraseña incorrectos');
  }

  const token = jwt.sign(
    { sub: admin.id_admin, usuario: admin.usuario, rol: admin.rol },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );

  return {
    token,
    admin: { id: admin.id_admin, usuario: admin.usuario, nombre: admin.nombre_completo, rol: admin.rol },
  };
}

module.exports = { login };
