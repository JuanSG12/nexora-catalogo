const { getConnection } = require('../config/database');

function findAll() {
  const db = getConnection();
  return db.prepare('SELECT * FROM marcas ORDER BY nombre ASC').all();
}

function findById(id) {
  const db = getConnection();
  return db.prepare('SELECT * FROM marcas WHERE id_marca = ?').get(id) || null;
}

function findByNombre(nombre) {
  const db = getConnection();
  return db.prepare('SELECT * FROM marcas WHERE nombre = ?').get(nombre) || null;
}

function create({ nombre, logo_url = null }) {
  const db = getConnection();
  const result = db
    .prepare('INSERT INTO marcas (nombre, logo_url) VALUES (?, ?)')
    .run(nombre, logo_url);
  return findById(Number(result.lastInsertRowid));
}

module.exports = { findAll, findById, findByNombre, create };
