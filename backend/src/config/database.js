const path = require('node:path');
const fs = require('node:fs');
const { DatabaseSync } = require('node:sqlite');
const env = require('./env');

let connection = null;

/**
 * Punto único de acceso a la conexión SQLite (patrón Singleton).
 * Todas las capas de repositorio consumen esta misma instancia.
 */
function getConnection() {
  if (connection) return connection;

  const dbPath = path.resolve(__dirname, env.dbPath);
  const dbDir = path.dirname(dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  connection = new DatabaseSync(dbPath);
  connection.exec('PRAGMA foreign_keys = ON;');

  const schemaPath = path.resolve(__dirname, '../../../database/schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
  connection.exec(schemaSql);

  return connection;
}

function closeConnection() {
  if (connection) {
    connection.close();
    connection = null;
  }
}

module.exports = { getConnection, closeConnection };
