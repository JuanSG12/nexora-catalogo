const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('node:path');
const env = require('./config/env');
const apiRoutes = require('./routes');
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandler');

function createApp() {
  const app = express();

  app.use(cors({ origin: env.corsOrigin }));
  app.use(express.json());
  app.use(morgan(env.nodeEnv === 'development' ? 'dev' : 'combined'));

  // Sirve el front-end estático (frontend/) directamente desde el mismo servidor
  app.use(express.static(path.resolve(__dirname, '../../frontend')));

  app.get('/api/health', (req, res) => res.json({ status: 'ok', servicio: 'nexora-backend' }));
  app.use('/api', apiRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = createApp;
