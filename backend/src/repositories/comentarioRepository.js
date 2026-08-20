const { getConnection } = require('../config/database');

function findAll() {
  const db = getConnection();
  return db
    .prepare(
      `SELECT c.*, d.nombre AS dispositivo_nombre
       FROM comentarios c
       JOIN dispositivos d ON d.id_dispositivo = c.id_dispositivo
       ORDER BY c.fecha_creacion DESC`
    )
    .all();
}

function findByDispositivo(idDispositivo, { soloAprobados = true } = {}) {
  const db = getConnection();
  const sql = soloAprobados
    ? 'SELECT * FROM comentarios WHERE id_dispositivo = ? AND aprobado = 1 ORDER BY fecha_creacion DESC'
    : 'SELECT * FROM comentarios WHERE id_dispositivo = ? ORDER BY fecha_creacion DESC';
  return db.prepare(sql).all(idDispositivo);
}

function findById(id) {
  const db = getConnection();
  return db.prepare('SELECT * FROM comentarios WHERE id_comentario = ?').get(id) || null;
}

function create({ id_dispositivo, nombre_usuario, correo_usuario = null, comentario, calificacion }) {
  const db = getConnection();
  const result = db
    .prepare(
      `INSERT INTO comentarios (id_dispositivo, nombre_usuario, correo_usuario, comentario, calificacion)
       VALUES (?, ?, ?, ?, ?)`
    )
    .run(id_dispositivo, nombre_usuario, correo_usuario, comentario, calificacion);
  return findById(Number(result.lastInsertRowid));
}

function remove(id) {
  const db = getConnection();
  const result = db.prepare('DELETE FROM comentarios WHERE id_comentario = ?').run(id);
  return result.changes > 0;
}

function setAprobado(id, aprobado) {
  const db = getConnection();
  db.prepare('UPDATE comentarios SET aprobado = ? WHERE id_comentario = ?').run(aprobado ? 1 : 0, id);
  return findById(id);
}

module.exports = { findAll, findByDispositivo, findById, create, remove, setAprobado };
