const createApp = require('./src/app');
const env = require('./src/config/env');
const { getConnection } = require('./src/config/database');

// Inicializa la conexión y aplica el esquema (schema.sql) antes de escuchar
getConnection();

const app = createApp();

app.listen(env.port, () => {
  console.log(`Nexora backend escuchando en http://localhost:${env.port}`);
  console.log(`Entorno: ${env.nodeEnv}`);
});
