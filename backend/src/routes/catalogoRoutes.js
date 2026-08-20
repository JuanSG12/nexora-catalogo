const { Router } = require('express');
const { body } = require('express-validator');
const catalogoController = require('../controllers/catalogoController');
const validate = require('../middlewares/validate');
const { requireAuth } = require('../middlewares/authMiddleware');

const router = Router();

router.get('/marcas', catalogoController.listarMarcas);
router.get('/tipos', catalogoController.listarTipos);

router.post(
  '/marcas',
  requireAuth,
  [body('nombre').trim().notEmpty().withMessage('El nombre de la marca es obligatorio')],
  validate,
  catalogoController.crearMarca
);

router.post(
  '/tipos',
  requireAuth,
  [body('nombre').trim().notEmpty().withMessage('El nombre del tipo es obligatorio')],
  validate,
  catalogoController.crearTipo
);

module.exports = router;
