/**
 * Script de siembra (seed) de datos base para el catálogo.
 * Uso: npm run seed  (desde backend/)
 *
 * NOTA ACADÉMICA: nombres, especificaciones y precios son ilustrativos,
 * construidos para fines de esta actividad, no reflejan catálogos ni
 * precios comerciales reales vigentes.
 */
const fs = require('node:fs');
const path = require('node:path');
const bcrypt = require('bcryptjs');
const { getConnection } = require('../config/database');

const db = getConnection();

const DIR_IMAGENES = path.resolve(__dirname, '../../../frontend/assets/img/devices');
const EXTENSIONES_FOTO = ['.jpg', '.jpeg', '.png', '.webp'];

/**
 * Usa una foto real (Wikimedia Commons) como portada si existe para el slug,
 * o el render ilustrado (.svg) como respaldo. Así, descargar una foto real y
 * nombrarla "<slug>.jpg" basta para que el seed la use automáticamente,
 * sin tener que editar cada dispositivo a mano.
 */
function resolverImagenPortada(slug) {
  for (const ext of EXTENSIONES_FOTO) {
    if (fs.existsSync(path.join(DIR_IMAGENES, `${slug}${ext}`))) {
      return `assets/img/devices/${slug}${ext}`;
    }
  }
  return `assets/img/devices/${slug}.svg`;
}

function limpiarTablas() {
  db.exec(`
    DELETE FROM comentarios;
    DELETE FROM imagenes_dispositivo;
    DELETE FROM dispositivos;
    DELETE FROM marcas;
    DELETE FROM tipos_dispositivo;
    DELETE FROM administradores;
    DELETE FROM sqlite_sequence WHERE name IN
      ('comentarios','imagenes_dispositivo','dispositivos','marcas','tipos_dispositivo','administradores');
  `);
}

function insertarTipos() {
  const stmt = db.prepare('INSERT INTO tipos_dispositivo (nombre) VALUES (?)');
  const ids = {};
  ids.Celular = Number(stmt.run('Celular').lastInsertRowid);
  ids.Portátil = Number(stmt.run('Portátil').lastInsertRowid);
  return ids;
}

function insertarMarcas() {
  const stmt = db.prepare('INSERT INTO marcas (nombre, logo_url) VALUES (?, ?)');
  const nombres = ['Samsung', 'Apple', 'Xiaomi', 'Motorola', 'Google', 'Lenovo', 'HP', 'Asus', 'Dell'];
  const ids = {};
  for (const nombre of nombres) {
    ids[nombre] = Number(stmt.run(nombre, null).lastInsertRowid);
  }
  return ids;
}

function insertarDispositivos(marca, tipo) {
  const stmt = db.prepare(`
    INSERT INTO dispositivos
      (nombre, id_marca, id_tipo, fecha_lanzamiento, precio, imagen_url, descripcion,
       procesador, ram, almacenamiento, pantalla, bateria, sistema_operativo, camara, color, stock, activo)
    VALUES
      (:nombre, :id_marca, :id_tipo, :fecha_lanzamiento, :precio, :imagen_url, :descripcion,
       :procesador, :ram, :almacenamiento, :pantalla, :bateria, :sistema_operativo, :camara, :color, :stock, 1)
  `);

  const dispositivos = [
    {
      nombre: 'Galaxy S24 Ultra',
      id_marca: marca.Samsung,
      id_tipo: tipo.Celular,
      fecha_lanzamiento: '2024-01-17',
      precio: 5999000,
      slug: 'galaxy-s24-ultra',
      descripcion: 'Buque insignia de Samsung con S Pen integrado, pantalla Dynamic AMOLED 2X y cámara de 200MP.',
      procesador: 'Snapdragon 8 Gen 3',
      ram: '12 GB',
      almacenamiento: '256 GB',
      pantalla: '6.8" QHD+ 120Hz',
      bateria: '5000 mAh',
      sistema_operativo: 'Android 14',
      camara: '200MP + 12MP + 50MP + 10MP',
      color: 'Titanio Gris',
      stock: 18,
    },
    {
      nombre: 'Galaxy A55',
      id_marca: marca.Samsung,
      id_tipo: tipo.Celular,
      fecha_lanzamiento: '2024-03-11',
      precio: 1699000,
      slug: 'galaxy-a55',
      descripcion: 'Gama media con cuerpo de aluminio, protección IP67 y pantalla Super AMOLED.',
      procesador: 'Exynos 1480',
      ram: '8 GB',
      almacenamiento: '256 GB',
      pantalla: '6.6" FHD+ 120Hz',
      bateria: '5000 mAh',
      sistema_operativo: 'Android 14',
      camara: '50MP + 12MP + 5MP',
      color: 'Azul Marino',
      stock: 30,
    },
    {
      nombre: 'iPhone 15 Pro Max',
      id_marca: marca.Apple,
      id_tipo: tipo.Celular,
      fecha_lanzamiento: '2023-09-22',
      precio: 6999000,
      slug: 'iphone-15-pro-max',
      descripcion: 'Chasis de titanio, chip A17 Pro y sistema de cámaras Pro con zoom óptico 5x.',
      procesador: 'Apple A17 Pro',
      ram: '8 GB',
      almacenamiento: '256 GB',
      pantalla: '6.7" Super Retina XDR 120Hz',
      bateria: '4441 mAh',
      sistema_operativo: 'iOS 17',
      camara: '48MP + 12MP + 12MP',
      color: 'Titanio Natural',
      stock: 12,
    },
    {
      nombre: 'iPhone 14',
      id_marca: marca.Apple,
      id_tipo: tipo.Celular,
      fecha_lanzamiento: '2022-09-16',
      precio: 3599000,
      slug: 'iphone-14',
      descripcion: 'Chip A15 Bionic, Detección de Choques y excelente cámara principal de 12MP.',
      procesador: 'Apple A15 Bionic',
      ram: '6 GB',
      almacenamiento: '128 GB',
      pantalla: '6.1" Super Retina XDR',
      bateria: '3279 mAh',
      sistema_operativo: 'iOS 16',
      camara: '12MP + 12MP',
      color: 'Medianoche',
      stock: 20,
    },
    {
      nombre: 'Redmi Note 13 Pro',
      id_marca: marca.Xiaomi,
      id_tipo: tipo.Celular,
      fecha_lanzamiento: '2024-01-08',
      precio: 1299000,
      slug: 'redmi-note-13-pro',
      descripcion: 'Excelente relación precio/rendimiento con cámara principal de 200MP y carga rápida de 67W.',
      procesador: 'Snapdragon 7s Gen 2',
      ram: '8 GB',
      almacenamiento: '256 GB',
      pantalla: '6.67" AMOLED 120Hz',
      bateria: '5100 mAh',
      sistema_operativo: 'Android 13 (HyperOS)',
      camara: '200MP + 8MP + 2MP',
      color: 'Negro Medianoche',
      stock: 25,
    },
    {
      nombre: 'Xiaomi 14',
      id_marca: marca.Xiaomi,
      id_tipo: tipo.Celular,
      fecha_lanzamiento: '2024-02-25',
      precio: 3499000,
      slug: 'xiaomi-14',
      descripcion: 'Cámaras Leica, compacto y potente con Snapdragon 8 Gen 3.',
      procesador: 'Snapdragon 8 Gen 3',
      ram: '12 GB',
      almacenamiento: '512 GB',
      pantalla: '6.36" LTPO AMOLED 120Hz',
      bateria: '4610 mAh',
      sistema_operativo: 'Android 14 (HyperOS)',
      camara: '50MP + 50MP + 50MP',
      color: 'Blanco',
      stock: 10,
    },
    {
      nombre: 'Moto Edge 40',
      id_marca: marca.Motorola,
      id_tipo: tipo.Celular,
      fecha_lanzamiento: '2023-06-01',
      precio: 1899000,
      slug: 'moto-edge-40',
      descripcion: 'Diseño curvo con acabado en piel vegana y pantalla POLED de 144Hz.',
      procesador: 'MediaTek Dimensity 8020',
      ram: '8 GB',
      almacenamiento: '256 GB',
      pantalla: '6.55" POLED 144Hz',
      bateria: '4400 mAh',
      sistema_operativo: 'Android 13',
      camara: '50MP + 13MP',
      color: 'Verde Menta',
      stock: 14,
    },
    {
      nombre: 'Pixel 8',
      id_marca: marca.Google,
      id_tipo: tipo.Celular,
      fecha_lanzamiento: '2023-10-12',
      precio: 3299000,
      slug: 'pixel-8',
      descripcion: 'IA generativa integrada, cámara computacional insignia y 7 años de actualizaciones.',
      procesador: 'Google Tensor G3',
      ram: '8 GB',
      almacenamiento: '128 GB',
      pantalla: '6.2" OLED 120Hz',
      bateria: '4575 mAh',
      sistema_operativo: 'Android 14',
      camara: '50MP + 12MP',
      color: 'Obsidiana',
      stock: 16,
    },
    {
      nombre: 'MacBook Air M3',
      id_marca: marca.Apple,
      id_tipo: tipo.Portátil,
      fecha_lanzamiento: '2024-03-08',
      precio: 6499000,
      slug: 'macbook-air-m3',
      descripcion: 'Ultraliviano, silencioso (sin ventilador) y con hasta 18 horas de batería.',
      procesador: 'Apple M3 (8 núcleos)',
      ram: '16 GB',
      almacenamiento: 'SSD 512 GB',
      pantalla: '13.6" Liquid Retina',
      bateria: 'Hasta 18 horas',
      sistema_operativo: 'macOS Sonoma',
      camara: '1080p FaceTime HD',
      color: 'Gris Espacial',
      stock: 9,
    },
    {
      nombre: 'MacBook Pro 14" M3 Pro',
      id_marca: marca.Apple,
      id_tipo: tipo.Portátil,
      fecha_lanzamiento: '2023-11-07',
      precio: 11999000,
      slug: 'macbook-pro-14',
      descripcion: 'Rendimiento profesional para edición y desarrollo, pantalla Liquid Retina XDR.',
      procesador: 'Apple M3 Pro (11 núcleos)',
      ram: '18 GB',
      almacenamiento: 'SSD 512 GB',
      pantalla: '14.2" Liquid Retina XDR 120Hz',
      bateria: 'Hasta 18 horas',
      sistema_operativo: 'macOS Sonoma',
      camara: '1080p FaceTime HD',
      color: 'Negro Espacial',
      stock: 6,
    },
    {
      nombre: 'ThinkPad X1 Carbon Gen 11',
      id_marca: marca.Lenovo,
      id_tipo: tipo.Portátil,
      fecha_lanzamiento: '2023-05-15',
      precio: 8999000,
      slug: 'thinkpad-x1-carbon',
      descripcion: 'Portátil empresarial ultraligero en fibra de carbono, certificado MIL-STD-810H.',
      procesador: 'Intel Core i7-1355U',
      ram: '16 GB',
      almacenamiento: 'SSD 512 GB',
      pantalla: '14" WUXGA IPS',
      bateria: 'Hasta 15 horas',
      sistema_operativo: 'Windows 11 Pro',
      camara: '1080p con obturador de privacidad',
      color: 'Negro',
      stock: 11,
    },
    {
      nombre: 'IdeaPad Slim 5',
      id_marca: marca.Lenovo,
      id_tipo: tipo.Portátil,
      fecha_lanzamiento: '2023-08-20',
      precio: 3799000,
      slug: 'ideapad-slim-5',
      descripcion: 'Portátil versátil para estudio y trabajo, buena autonomía y chasis en aluminio.',
      procesador: 'AMD Ryzen 5 7530U',
      ram: '16 GB',
      almacenamiento: 'SSD 512 GB',
      pantalla: '14" FHD IPS',
      bateria: 'Hasta 12 horas',
      sistema_operativo: 'Windows 11 Home',
      camara: '720p',
      color: 'Gris Tormenta',
      stock: 22,
    },
    {
      nombre: 'Pavilion 15',
      id_marca: marca.HP,
      id_tipo: tipo.Portátil,
      fecha_lanzamiento: '2023-04-10',
      precio: 3299000,
      slug: 'hp-pavilion-15',
      descripcion: 'Equipo multipropósito con buen balance entre rendimiento y portabilidad.',
      procesador: 'Intel Core i5-1335U',
      ram: '8 GB',
      almacenamiento: 'SSD 512 GB',
      pantalla: '15.6" FHD IPS',
      bateria: 'Hasta 10 horas',
      sistema_operativo: 'Windows 11 Home',
      camara: '720p',
      color: 'Plata Natural',
      stock: 19,
    },
    {
      nombre: 'ZenBook 14 OLED',
      id_marca: marca.Asus,
      id_tipo: tipo.Portátil,
      fecha_lanzamiento: '2023-07-01',
      precio: 5299000,
      slug: 'asus-zenbook-14',
      descripcion: 'Pantalla OLED 2.8K vibrante en un chasis ultradelgado de aleación de aluminio.',
      procesador: 'Intel Core i7-1355U',
      ram: '16 GB',
      almacenamiento: 'SSD 1 TB',
      pantalla: '14" 2.8K OLED 90Hz',
      bateria: 'Hasta 14 horas',
      sistema_operativo: 'Windows 11 Home',
      camara: '1080p',
      color: 'Azul Ponder',
      stock: 8,
    },
    {
      nombre: 'XPS 13',
      id_marca: marca.Dell,
      id_tipo: tipo.Portátil,
      fecha_lanzamiento: '2023-02-14',
      precio: 7499000,
      slug: 'dell-xps-13',
      descripcion: 'Diseño premium con bordes InfinityEdge y acabado en fibra de carbono.',
      procesador: 'Intel Core i7-1360P',
      ram: '16 GB',
      almacenamiento: 'SSD 512 GB',
      pantalla: '13.4" FHD+ InfinityEdge',
      bateria: 'Hasta 12 horas',
      sistema_operativo: 'Windows 11 Pro',
      camara: '720p',
      color: 'Platino',
      stock: 7,
    },
  ];

  const ids = [];
  for (const { slug, ...datos } of dispositivos) {
    const imagen_url = resolverImagenPortada(slug);
    const result = stmt.run({ ...datos, imagen_url });
    ids.push({ id: Number(result.lastInsertRowid), slug });
  }
  return ids;
}

function insertarGaleria(dispositivosInsertados) {
  const stmt = db.prepare(
    'INSERT INTO imagenes_dispositivo (id_dispositivo, url, etiqueta, orden) VALUES (?, ?, ?, ?)'
  );
  for (const { id, slug } of dispositivosInsertados) {
    stmt.run(id, `assets/img/devices/${slug}-angle.svg`, 'Ángulo (render ilustrado)', 1);
    stmt.run(id, `assets/img/devices/${slug}-back.svg`, 'Posterior (render ilustrado)', 2);
  }
}

function insertarComentarios(idsDispositivos) {
  const stmt = db.prepare(`
    INSERT INTO comentarios (id_dispositivo, nombre_usuario, correo_usuario, comentario, calificacion)
    VALUES (?, ?, ?, ?, ?)
  `);

  const muestras = [
    ['Camila Rojas', 'camila.rojas@example.com', 'Excelente cámara y muy buena duración de batería. Lo recomiendo totalmente.', 5],
    ['Andrés Pérez', 'andres.perez@example.com', 'Buen rendimiento general, aunque el precio es un poco alto para lo que ofrece.', 4],
    ['Laura Gómez', null, 'Cumple con lo esperado, la pantalla se ve espectacular.', 5],
    ['Sebastián Torres', 'sebastian.t@example.com', 'Se calienta un poco al jugar por periodos largos, pero en el día a día funciona bien.', 3],
  ];

  idsDispositivos.slice(0, 8).forEach(({ id }, index) => {
    const [nombre, correo, comentario, calificacion] = muestras[index % muestras.length];
    stmt.run(id, nombre, correo, comentario, calificacion);
  });
}

async function insertarAdmin() {
  const passwordHash = await bcrypt.hash('Admin123!', 10);
  db.prepare(
    'INSERT INTO administradores (usuario, password_hash, nombre_completo, rol) VALUES (?, ?, ?, ?)'
  ).run('admin', passwordHash, 'Administrador Nexora', 'admin');
}

async function main() {
  console.log('Limpiando tablas...');
  limpiarTablas();

  console.log('Insertando tipos de dispositivo...');
  const tipo = insertarTipos();

  console.log('Insertando marcas...');
  const marca = insertarMarcas();

  console.log('Insertando dispositivos...');
  const idsDispositivos = insertarDispositivos(marca, tipo);

  console.log('Insertando galería de imágenes (ángulo/posterior)...');
  insertarGaleria(idsDispositivos);

  console.log('Insertando comentarios de ejemplo...');
  insertarComentarios(idsDispositivos);

  console.log('Creando usuario administrador...');
  await insertarAdmin();

  console.log('\nSeed completado con éxito.');
  console.log('Credenciales de administrador -> usuario: admin | password: Admin123!');
}

main()
  .catch((err) => {
    console.error('Error ejecutando el seed:', err);
    process.exitCode = 1;
  });
