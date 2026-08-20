-- ============================================================
-- Proyecto: Nexora - Catálogo de Dispositivos Inteligentes
-- Archivo: schema.sql
-- Descripción: Definición de la estructura (DDL) de la base de
--              datos relacional utilizada por el back-end.
-- Motor: SQLite 3 (compatible en su sintaxis base con MySQL/PostgreSQL)
-- ============================================================

PRAGMA foreign_keys = ON;

-- ------------------------------------------------------------
-- Tabla: marcas
-- Catálogo de fabricantes (Samsung, Apple, Lenovo, etc.)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS marcas (
    id_marca      INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre        TEXT NOT NULL UNIQUE,
    logo_url      TEXT,
    created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- Tabla: tipos_dispositivo
-- Catálogo de tipos (Celular, Portátil)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tipos_dispositivo (
    id_tipo       INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre        TEXT NOT NULL UNIQUE,
    created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- Tabla: dispositivos
-- Entidad principal del catálogo
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS dispositivos (
    id_dispositivo      INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre               TEXT NOT NULL,
    id_marca             INTEGER NOT NULL,
    id_tipo              INTEGER NOT NULL,
    fecha_lanzamiento    DATE NOT NULL,
    precio               DECIMAL(12,2) NOT NULL CHECK (precio >= 0),
    imagen_url           TEXT,
    descripcion          TEXT,
    procesador           TEXT,
    ram                  TEXT,
    almacenamiento       TEXT,
    pantalla             TEXT,
    bateria              TEXT,
    sistema_operativo    TEXT,
    camara               TEXT,
    color                TEXT,
    stock                INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    activo               INTEGER NOT NULL DEFAULT 1,
    created_at           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_marca) REFERENCES marcas(id_marca) ON DELETE RESTRICT,
    FOREIGN KEY (id_tipo)  REFERENCES tipos_dispositivo(id_tipo) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_dispositivos_marca ON dispositivos(id_marca);
CREATE INDEX IF NOT EXISTS idx_dispositivos_tipo ON dispositivos(id_tipo);
CREATE INDEX IF NOT EXISTS idx_dispositivos_fecha ON dispositivos(fecha_lanzamiento);
CREATE INDEX IF NOT EXISTS idx_dispositivos_nombre ON dispositivos(nombre);

-- ------------------------------------------------------------
-- Tabla: imagenes_dispositivo
-- Galería de fotos adicionales de un dispositivo (1:N con dispositivos).
-- dispositivos.imagen_url guarda la foto de portada; esta tabla guarda
-- las vistas adicionales (ángulo, posterior, etc.) para la galería.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS imagenes_dispositivo (
    id_imagen         INTEGER PRIMARY KEY AUTOINCREMENT,
    id_dispositivo    INTEGER NOT NULL,
    url               TEXT NOT NULL,
    etiqueta          TEXT,
    orden             INTEGER NOT NULL DEFAULT 0,
    created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_dispositivo) REFERENCES dispositivos(id_dispositivo) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_imagenes_dispositivo ON imagenes_dispositivo(id_dispositivo);

-- ------------------------------------------------------------
-- Tabla: comentarios
-- Opiniones/reseñas de usuarios sobre un dispositivo (1:N con dispositivos)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS comentarios (
    id_comentario     INTEGER PRIMARY KEY AUTOINCREMENT,
    id_dispositivo    INTEGER NOT NULL,
    nombre_usuario     TEXT NOT NULL,
    correo_usuario     TEXT,
    comentario         TEXT NOT NULL,
    calificacion       INTEGER NOT NULL CHECK (calificacion BETWEEN 1 AND 5),
    aprobado           INTEGER NOT NULL DEFAULT 1,
    fecha_creacion     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_dispositivo) REFERENCES dispositivos(id_dispositivo) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_comentarios_dispositivo ON comentarios(id_dispositivo);

-- ------------------------------------------------------------
-- Tabla: administradores
-- Usuarios con acceso al panel de administración
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS administradores (
    id_admin        INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario          TEXT NOT NULL UNIQUE,
    password_hash    TEXT NOT NULL,
    nombre_completo  TEXT NOT NULL,
    rol              TEXT NOT NULL DEFAULT 'admin',
    created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
