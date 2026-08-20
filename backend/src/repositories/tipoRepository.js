const { getConnection } = require('../config/database');

function findAll() {
  const db = getConnection();
  return db.prepare('SELECT * FROM tipos_dispositivo ORDER BY nombre ASC').all();
}

function findById(id) {
  const db = getConnection();
  return db.prepare('SELECT * FROM tipos_dispositivo WHERE id_tipo = ?').get(id) || null;
}

function findByNombre(nombre) {
  const db = getConnection();
  return db.prepare('SELECT * FROM tipos_dispositivo WHERE nombre = ?').get(nombre) || null;
}

function create({ nombre }) {
  const db = getConnection();
  const result = db.prepare('INSERT INTO tipos_dispositivo (nombre) VALUES (?)').run(nombre);
  return findById(Number(result.lastInsertRowid));
}

module.exports = { findAll, findById, findByNombre, create };
