/**
 * @typedef {Object} Dispositivo
 * @property {number} id_dispositivo
 * @property {string} nombre
 * @property {number} id_marca
 * @property {number} id_tipo
 * @property {string} fecha_lanzamiento  Formato ISO (YYYY-MM-DD)
 * @property {number} precio
 * @property {string|null} imagen_url
 * @property {string|null} descripcion
 * @property {string|null} procesador
 * @property {string|null} ram
 * @property {string|null} almacenamiento
 * @property {string|null} pantalla
 * @property {string|null} bateria
 * @property {string|null} sistema_operativo
 * @property {string|null} camara
 * @property {string|null} color
 * @property {number} stock
 * @property {0|1} activo
 */

const CAMPOS_DISPOSITIVO = [
  'nombre',
  'id_marca',
  'id_tipo',
  'fecha_lanzamiento',
  'precio',
  'imagen_url',
  'descripcion',
  'procesador',
  'ram',
  'almacenamiento',
  'pantalla',
  'bateria',
  'sistema_operativo',
  'camara',
  'color',
  'stock',
  'activo',
];

module.exports = { CAMPOS_DISPOSITIVO };
