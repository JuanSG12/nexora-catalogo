const { Router } = require('express');
const dispositivoRoutes = require('./dispositivoRoutes');
const comentarioRoutes = require('./comentarioRoutes');
const catalogoRoutes = require('./catalogoRoutes');
const authRoutes = require('./authRoutes');

const router = Router();

router.use('/dispositivos', dispositivoRoutes);
router.use('/comentarios', comentarioRoutes);
router.use('/auth', authRoutes);
router.use('/', catalogoRoutes); // /marcas, /tipos

module.exports = router;
