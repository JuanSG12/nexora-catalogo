const { getConnection } = require('../config/database');

const BASE_SELECT = `
  SELECT
    d.*,
    m.nombre AS marca_nombre,
    t.nombre AS tipo_nombre,
    (SELECT ROUND(AVG(c.calificacion), 2) FROM comentarios c WHERE c.id_dispositivo = d.id_dispositivo AND c.aprobado = 1) AS calificacion_promedio,
    (SELECT COUNT(*) FROM comentarios c WHERE c.id_dispositivo = d.id_dispositivo AND c.aprobado = 1) AS total_comentarios
  FROM dispositivos d
  JOIN marcas m ON m.id_marca = d.id_marca
  JOIN tipos_dispositivo t ON t.id_tipo = d.id_tipo
`;

const SORT_COLUMNS = {
  fecha_desc: 'd.fecha_lanzamiento DESC',
  fecha_asc: 'd.fecha_lanzamiento ASC',
  precio_desc: 'd.precio DESC',
  precio_asc: 'd.precio ASC',
  nombre_asc: 'd.nombre ASC',
};

/**
 * Búsqueda paginada con filtros combinables: tipo, marca, texto libre,
 * rango de precio y orden. Pensada para alimentar el listado del home.
 */
function search({
  tipo,
  marca,
  q,
  precioMin,
  precioMax,
  soloActivos = true,
  sort = 'fecha_desc',
  page = 1,
  pageSize = 12,
} = {}) {
  const db = getConnection();
  const where = [];
  const params = {};

  if (soloActivos) where.push('d.activo = 1');
  if (tipo) {
    where.push('t.nombre = :tipo');
    params.tipo = tipo;
  }
  if (marca) {
    where.push('m.nombre = :marca');
    params.marca = marca;
  }
  if (q) {
    where.push('(d.nombre LIKE :q OR d.descripcion LIKE :q OR m.nombre LIKE :q)');
    params.q = `%${q}%`;
  }
  if (precioMin != null) {
    where.push('d.precio >= :precioMin');
    params.precioMin = precioMin;
  }
  if (precioMax != null) {
    where.push('d.precio <= :precioMax');
    params.precioMax = precioMax;
  }

  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const orderSql = SORT_COLUMNS[sort] || SORT_COLUMNS.fecha_desc;
  const limit = Math.max(1, Math.min(48, Number(pageSize) || 12));
  const offset = Math.max(0, (Number(page) || 1) - 1) * limit;

  const rows = db
    .prepare(`${BASE_SELECT} ${whereSql} ORDER BY ${orderSql} LIMIT :limit OFFSET :offset`)
    .all({ ...params, limit, offset });

  const { total } = db
    .prepare(
      `SELECT COUNT(*) AS total FROM dispositivos d
       JOIN marcas m ON m.id_marca = d.id_marca
       JOIN tipos_dispositivo t ON t.id_tipo = d.id_tipo
       ${whereSql}`
    )
    .get(params);

  return {
    data: rows,
    pagination: {
      page: Number(page) || 1,
      pageSize: limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  };
}

function findById(id) {
  const db = getConnection();
  const dispositivo = db.prepare(`${BASE_SELECT} WHERE d.id_dispositivo = ?`).get(id);
  if (!dispositivo) return null;

  const extra = db
    .prepare('SELECT url, etiqueta, orden FROM imagenes_dispositivo WHERE id_dispositivo = ? ORDER BY orden ASC')
    .all(id);

  const esFotoReal = dispositivo.imagen_url && !dispositivo.imagen_url.endsWith('.svg');
  dispositivo.imagenes = [
    {
      url: dispositivo.imagen_url,
      etiqueta: esFotoReal ? 'Frontal (foto real)' : 'Frontal (render ilustrado)',
      orden: 0,
    },
    ...extra,
  ].filter((img) => img.url);

  return dispositivo;
}

function create(data) {
  const db = getConnection();
  const result = db
    .prepare(
      `INSERT INTO dispositivos
        (nombre, id_marca, id_tipo, fecha_lanzamiento, precio, imagen_url, descripcion,
         procesador, ram, almacenamiento, pantalla, bateria, sistema_operativo, camara, color, stock, activo)
       VALUES
        (:nombre, :id_marca, :id_tipo, :fecha_lanzamiento, :precio, :imagen_url, :descripcion,
         :procesador, :ram, :almacenamiento, :pantalla, :bateria, :sistema_operativo, :camara, :color, :stock, :activo)`
    )
    .run({
      imagen_url: null,
      descripcion: null,
      procesador: null,
      ram: null,
      almacenamiento: null,
      pantalla: null,
      bateria: null,
      sistema_operativo: null,
      camara: null,
      color: null,
      stock: 0,
      activo: 1,
      ...data,
    });
  return findById(Number(result.lastInsertRowid));
}

function update(id, data) {
  const db = getConnection();
  const current = findById(id);
  if (!current) return null;

  const merged = { ...current, ...data };
  db.prepare(
    `UPDATE dispositivos SET
      nombre = :nombre,
      id_marca = :id_marca,
      id_tipo = :id_tipo,
      fecha_lanzamiento = :fecha_lanzamiento,
      precio = :precio,
      imagen_url = :imagen_url,
      descripcion = :descripcion,
      procesador = :procesador,
      ram = :ram,
      almacenamiento = :almacenamiento,
      pantalla = :pantalla,
      bateria = :bateria,
      sistema_operativo = :sistema_operativo,
      camara = :camara,
      color = :color,
      stock = :stock,
      activo = :activo,
      updated_at = CURRENT_TIMESTAMP
     WHERE id_dispositivo = :id`
  ).run({
    id,
    nombre: merged.nombre,
    id_marca: merged.id_marca,
    id_tipo: merged.id_tipo,
    fecha_lanzamiento: merged.fecha_lanzamiento,
    precio: merged.precio,
    imagen_url: merged.imagen_url,
    descripcion: merged.descripcion,
    procesador: merged.procesador,
    ram: merged.ram,
    almacenamiento: merged.almacenamiento,
    pantalla: merged.pantalla,
    bateria: merged.bateria,
    sistema_operativo: merged.sistema_operativo,
    camara: merged.camara,
    color: merged.color,
    stock: merged.stock,
    activo: merged.activo,
  });

  return findById(id);
}

function remove(id) {
  const db = getConnection();
  const result = db.prepare('DELETE FROM dispositivos WHERE id_dispositivo = ?').run(id);
  return result.changes > 0;
}

module.exports = { search, findById, create, update, remove };
