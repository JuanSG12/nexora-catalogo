const { getConnection } = require('../config/database');

function findByUsuario(usuario) {
  const db = getConnection();
  return db.prepare('SELECT * FROM administradores WHERE usuario = ?').get(usuario) || null;
}

function findById(id) {
  const db = getConnection();
  return db.prepare('SELECT * FROM administradores WHERE id_admin = ?').get(id) || null;
}

function create({ usuario, password_hash, nombre_completo, rol = 'admin' }) {
  const db = getConnection();
  const result = db
    .prepare(
      'INSERT INTO administradores (usuario, password_hash, nombre_completo, rol) VALUES (?, ?, ?, ?)'
    )
    .run(usuario, password_hash, nombre_completo, rol);
  return findById(Number(result.lastInsertRowid));
}

module.exports = { findByUsuario, findById, create };
