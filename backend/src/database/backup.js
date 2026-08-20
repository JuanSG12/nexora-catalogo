/**
 * Genera un respaldo (dump) en SQL plano de la base de datos actual:
 * esquema (CREATE TABLE) + datos (INSERT INTO) de todas las tablas.
 * Uso: node src/database/backup.js
 */
const fs = require('node:fs');
const path = require('node:path');
const { getConnection } = require('../config/database');

const db = getConnection();

const TABLAS = [
  'marcas',
  'tipos_dispositivo',
  'dispositivos',
  'imagenes_dispositivo',
  'comentarios',
  'administradores',
];

function escaparValor(valor) {
  if (valor === null || valor === undefined) return 'NULL';
  if (typeof valor === 'number') return String(valor);
  return `'${String(valor).replace(/'/g, "''")}'`;
}

function volcarTabla(nombreTabla) {
  const filas = db.prepare(`SELECT * FROM ${nombreTabla}`).all();
  if (filas.length === 0) return `-- (sin registros en ${nombreTabla})\n`;

  const columnas = Object.keys(filas[0]);
  const lineas = filas.map((fila) => {
    const valores = columnas.map((c) => escaparValor(fila[c])).join(', ');
    return `INSERT INTO ${nombreTabla} (${columnas.join(', ')}) VALUES (${valores});`;
  });
  return lineas.join('\n') + '\n';
}

function generarBackup() {
  const schemaPath = path.resolve(__dirname, '../../../database/schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf-8');

  const fecha = new Date().toISOString();
  let contenido = `-- ============================================================\n`;
  contenido += `-- Respaldo de base de datos — Nexora\n`;
  contenido += `-- Generado: ${fecha}\n`;
  contenido += `-- Este archivo recrea el esquema y restaura los datos sembrados.\n`;
  contenido += `-- ============================================================\n\n`;
  contenido += `BEGIN TRANSACTION;\n\n`;
  contenido += schemaSql + '\n';

  for (const tabla of TABLAS) {
    contenido += `-- Datos: ${tabla}\n`;
    contenido += volcarTabla(tabla);
    contenido += '\n';
  }

  contenido += `COMMIT;\n`;

  const outDir = path.resolve(__dirname, '../../../database/backup');
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, 'nexora_backup.sql');
  fs.writeFileSync(outFile, contenido, 'utf-8');
  console.log(`Respaldo generado en ${outFile}`);
}

generarBackup();
