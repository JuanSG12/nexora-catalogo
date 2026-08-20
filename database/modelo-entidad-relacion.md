# Modelo Entidad-Relación — Nexora

Catálogo de dispositivos inteligentes (celulares y portátiles). Motor: **SQLite 3**
(sintaxis DDL compatible en su base con MySQL/PostgreSQL, ver [`schema.sql`](schema.sql)).

Diagrama visual: [`diagrama-er.svg`](diagrama-er.svg)

## Entidades

### MARCAS
Catálogo de fabricantes (Samsung, Apple, Xiaomi, etc.)

| Campo      | Tipo         | Restricciones          |
|------------|--------------|-------------------------|
| id_marca   | INTEGER      | PK, AUTOINCREMENT       |
| nombre     | TEXT         | NOT NULL, UNIQUE        |
| logo_url   | TEXT         |                         |
| created_at | DATETIME     | NOT NULL, DEFAULT NOW   |

### TIPOS_DISPOSITIVO
Catálogo de tipos de dispositivo (Celular, Portátil).

| Campo      | Tipo         | Restricciones          |
|------------|--------------|-------------------------|
| id_tipo    | INTEGER      | PK, AUTOINCREMENT       |
| nombre     | TEXT         | NOT NULL, UNIQUE        |
| created_at | DATETIME     | NOT NULL, DEFAULT NOW   |

### DISPOSITIVOS
Entidad principal del catálogo.

| Campo             | Tipo          | Restricciones                                  |
|-------------------|---------------|--------------------------------------------------|
| id_dispositivo    | INTEGER       | PK, AUTOINCREMENT                                |
| nombre            | TEXT          | NOT NULL                                         |
| id_marca          | INTEGER       | FK → marcas(id_marca), NOT NULL                  |
| id_tipo           | INTEGER       | FK → tipos_dispositivo(id_tipo), NOT NULL        |
| fecha_lanzamiento | DATE          | NOT NULL                                         |
| precio            | DECIMAL(12,2) | NOT NULL, CHECK (precio >= 0)                    |
| imagen_url        | TEXT          |                                                   |
| descripcion       | TEXT          |                                                   |
| procesador        | TEXT          |                                                   |
| ram               | TEXT          |                                                   |
| almacenamiento    | TEXT          |                                                   |
| pantalla          | TEXT          |                                                   |
| bateria           | TEXT          |                                                   |
| sistema_operativo | TEXT          |                                                   |
| camara            | TEXT          |                                                   |
| color             | TEXT          |                                                   |
| stock             | INTEGER       | NOT NULL, DEFAULT 0, CHECK (stock >= 0)          |
| activo            | INTEGER       | NOT NULL, DEFAULT 1 (borrado lógico)             |
| created_at        | DATETIME      | NOT NULL, DEFAULT NOW                            |
| updated_at        | DATETIME      | NOT NULL, DEFAULT NOW                            |

Índices: `id_marca`, `id_tipo`, `fecha_lanzamiento`, `nombre` (soportan los filtros y
la búsqueda del listado principal).

### IMAGENES_DISPOSITIVO
Galería de vistas adicionales de un dispositivo (frontal, ángulo, posterior),
como en un marketplace. `dispositivos.imagen_url` guarda la foto de portada;
esta tabla guarda las vistas adicionales que se muestran en el carrusel/galería
de la página de detalle.

| Campo           | Tipo      | Restricciones                                       |
|------------------|-----------|------------------------------------------------------|
| id_imagen        | INTEGER   | PK, AUTOINCREMENT                                    |
| id_dispositivo   | INTEGER   | FK → dispositivos(id_dispositivo), NOT NULL, ON DELETE CASCADE |
| url              | TEXT      | NOT NULL                                             |
| etiqueta         | TEXT      | Ej: "Ángulo", "Posterior"                            |
| orden            | INTEGER   | NOT NULL, DEFAULT 0 (orden de aparición en la galería)|
| created_at       | DATETIME  | NOT NULL, DEFAULT NOW                                |

### COMENTARIOS
Opiniones/reseñas de usuarios sobre un dispositivo.

| Campo           | Tipo      | Restricciones                                       |
|------------------|-----------|------------------------------------------------------|
| id_comentario    | INTEGER   | PK, AUTOINCREMENT                                    |
| id_dispositivo   | INTEGER   | FK → dispositivos(id_dispositivo), NOT NULL, ON DELETE CASCADE |
| nombre_usuario   | TEXT      | NOT NULL                                             |
| correo_usuario   | TEXT      |                                                       |
| comentario       | TEXT      | NOT NULL                                             |
| calificacion     | INTEGER   | NOT NULL, CHECK (calificacion BETWEEN 1 AND 5)       |
| aprobado         | INTEGER   | NOT NULL, DEFAULT 1 (moderación desde el panel admin)|
| fecha_creacion   | DATETIME  | NOT NULL, DEFAULT NOW                                |

### ADMINISTRADORES
Usuarios con acceso al panel de administración. Entidad independiente (no participa
en relaciones con las demás tablas), usada exclusivamente para autenticación.

| Campo           | Tipo      | Restricciones                    |
|------------------|-----------|------------------------------------|
| id_admin         | INTEGER   | PK, AUTOINCREMENT                  |
| usuario          | TEXT      | NOT NULL, UNIQUE                   |
| password_hash    | TEXT      | NOT NULL (hash bcrypt, nunca plano)|
| nombre_completo  | TEXT      | NOT NULL                           |
| rol              | TEXT      | NOT NULL, DEFAULT 'admin'          |
| created_at       | DATETIME  | NOT NULL, DEFAULT NOW              |

## Relaciones

| Relación                             | Cardinalidad | Descripción                                             |
|---------------------------------------|--------------|----------------------------------------------------------|
| MARCAS → DISPOSITIVOS                 | 1 : N        | Una marca puede tener muchos dispositivos.               |
| TIPOS_DISPOSITIVO → DISPOSITIVOS      | 1 : N        | Un tipo (Celular/Portátil) agrupa muchos dispositivos.   |
| DISPOSITIVOS → COMENTARIOS            | 1 : N        | Un dispositivo puede recibir muchas opiniones de usuarios.|
| DISPOSITIVOS → IMAGENES_DISPOSITIVO    | 1 : N        | Un dispositivo puede tener varias vistas/fotos en su galería.|

No existen relaciones muchos-a-muchos en este modelo; las cuatro relaciones son
uno-a-muchos, resueltas con llaves foráneas simples (sin tablas intermedias).

## Decisiones de diseño

- **Borrado lógico en `dispositivos`** (`activo`): permite descontinuar un producto
  sin perder su historial de comentarios ni romper integridad referencial.
- **Borrado en cascada en `comentarios`**: si un dispositivo se elimina físicamente,
  sus comentarios se eliminan junto con él (`ON DELETE CASCADE`).
- **`calificacion_promedio` no se almacena**: se calcula en tiempo de consulta con
  `AVG()` sobre `comentarios` (ver `dispositivoRepository.js`), evitando datos
  denormalizados que puedan desincronizarse.
- **Contraseñas de administrador**: se almacenan como hash `bcrypt`, nunca en texto
  plano (ver `authService.js`).
