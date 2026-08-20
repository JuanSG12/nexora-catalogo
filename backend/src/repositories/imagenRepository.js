const { getConnection } = require('../config/database');

function findByDispositivo(idDispositivo) {
  const db = getConnection();
  return db
    .prepare('SELECT * FROM imagenes_dispositivo WHERE id_dispositivo = ? ORDER BY orden ASC')
    .all(idDispositivo);
}

function reemplazarGaleria(idDispositivo, imagenes = []) {
  const db = getConnection();
  db.prepare('DELETE FROM imagenes_dispositivo WHERE id_dispositivo = ?').run(idDispositivo);

  const stmt = db.prepare(
    'INSERT INTO imagenes_dispositivo (id_dispositivo, url, etiqueta, orden) VALUES (?, ?, ?, ?)'
  );
  imagenes.forEach((img, index) => {
    const url = typeof img === 'string' ? img : img.url;
    const etiqueta = typeof img === 'string' ? null : img.etiqueta || null;
    if (url) stmt.run(idDispositivo, url, etiqueta, index + 1);
  });

  return findByDispositivo(idDispositivo);
}

module.exports = { findByDispositivo, reemplazarGaleria };
