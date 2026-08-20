# Nexora — Catálogo de dispositivos inteligentes

Actividad AA2 — Creación de un sitio Front-end + Back-end para explorar celulares y
portátiles: listado con filtros y búsqueda, detalle con especificaciones y reseñas
de usuarios, y un panel de administración para gestionar el catálogo.

> **Nota académica:** nombres de dispositivos, especificaciones, precios e imágenes
> son ilustrativos y fueron construidos para esta actividad. No representan
> catálogos ni precios comerciales reales vigentes. Las fotos de portada de la
> mayoría de dispositivos son fotografías reales con licencia libre de
> Wikimedia Commons (ver CREDITS.md para la atribución); las vistas de
> ángulo/posterior y algunas portadas son renders vectoriales ilustrados, ya
> que no existe una fotografía real con licencia libre disponible para esos
> casos.

## Arquitectura

Arquitectura por capas, separada en tres carpetas independientes:

```
AA2_Sanchez_Gonzalez_JuanFelipe/
├── frontend/     → HTML + Bootstrap 5 + JavaScript (consume la API REST)
├── backend/      → Node.js + Express, arquitectura por capas
│   └── src/
│       ├── routes/         (capa de enrutamiento HTTP)
│       ├── controllers/    (capa de presentación/HTTP)
│       ├── services/       (capa de lógica de negocio y validación)
│       ├── repositories/   (capa de acceso a datos / SQL)
│       ├── middlewares/    (auth JWT, manejo de errores, validación)
│       └── config/         (conexión a base de datos, variables de entorno)
└── database/     → Diseño de la base de datos (DDL, modelo E-R, backup)
```

Flujo de una petición: `routes → controllers → services → repositories → SQLite`.
Cada capa solo conoce a la inmediatamente inferior, lo que permite cambiar el motor
de base de datos o la interfaz HTTP sin reescribir la lógica de negocio.

## Stack técnico

- **Back-end:** Node.js (≥ 22.5) + Express 4
- **Base de datos:** SQLite 3, mediante el módulo nativo `node:sqlite` (sin
  dependencias nativas que compilar)
- **Autenticación:** JWT + contraseñas con hash `bcrypt`
- **Validación:** `express-validator`
- **Front-end:** HTML5 + Bootstrap 5 + JavaScript (Fetch API, sin frameworks)

## Puesta en marcha

```bash
cd backend
npm install
cp .env.example .env
npm run seed      # crea el esquema y carga datos de ejemplo + usuario admin
npm start          # http://localhost:3000
```

El propio backend sirve el front-end de forma estática, así que basta con abrir
`http://localhost:3000` en el navegador. No se requiere un servidor aparte para el
front-end.

### Scripts disponibles (`backend/`)

| Script          | Descripción                                                |
|-----------------|-------------------------------------------------------------|
| `npm start`     | Inicia el servidor Express                                  |
| `npm run dev`   | Igual que `start`, reiniciando automáticamente ante cambios  |
| `npm run seed`  | Reinicia el catálogo con datos de ejemplo y crea el admin    |
| `npm run backup`| Genera un respaldo SQL en `database/backup/`                 |

### Credenciales de administrador (demo)

```
Usuario:    admin
Contraseña: Admin123!
```

Panel: `http://localhost:3000/admin/login.html`

## Funcionalidades

- **Catálogo público** (`/index.html`): listado de dispositivos con filtros por
  tipo, marca, orden (fecha, precio, nombre) y búsqueda de texto libre.
- **Detalle de dispositivo** (`/detalle.html?id=`): especificaciones completas,
  precio, disponibilidad, reseñas de usuarios y una **galería de 3 vistas**
  (frontal, ángulo, posterior) al estilo marketplace, con miniaturas seleccionables.
- **Comentarios**: cualquier visitante puede dejar una opinión con calificación
  (1 a 5 estrellas) sobre un dispositivo.
- **Panel de administración** (`/admin`): CRUD de dispositivos, moderación de
  comentarios (eliminar) y administración de marcas/tipos. Protegido con JWT.

## Regenerar renders de dispositivos

```bash
cd backend
node src/database/generarImagenes.js   # regenera las 3 vistas SVG de cada dispositivo
npm run seed                            # vuelve a poblar catálogo + galería
```

## Base de datos

Ver la carpeta [`database/`](database/):

- [`schema.sql`](database/schema.sql) — definición DDL de las tablas.
- [`modelo-entidad-relacion.md`](database/modelo-entidad-relacion.md) — descripción
  del modelo E-R.
- [`diagrama-er.svg`](database/diagrama-er.svg) — diagrama visual del modelo.
- [`backup/nexora_backup.sql`](database/backup/nexora_backup.sql) — respaldo
  (esquema + datos) generado con `npm run backup`.
- `nexora.sqlite` — archivo de base de datos SQLite generado al ejecutar el seed.

## Seguridad implementada

- Contraseñas de administrador con hash `bcrypt` (nunca en texto plano).
- Rutas de escritura (crear/editar/eliminar dispositivos, marcas, tipos,
  comentarios) protegidas con JWT (`Authorization: Bearer <token>`).
- Validación de entrada en el servidor con `express-validator` (tipos, longitudes,
  rangos) para todos los endpoints que reciben datos.
- Escape de contenido generado por usuarios (comentarios) antes de insertarlo en el
  DOM, para prevenir XSS.
- Consultas SQL parametrizadas en toda la capa de repositorios (sin concatenación
  de strings), para prevenir inyección SQL.
