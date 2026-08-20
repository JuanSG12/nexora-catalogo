const { Router } = require('express');
const { body, param } = require('express-validator');
const dispositivoController = require('../controllers/dispositivoController');
const comentarioController = require('../controllers/comentarioController');
const validate = require('../middlewares/validate');
const { requireAuth } = require('../middlewares/authMiddleware');

const router = Router();

const reglasDispositivo = [
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio'),
  body('id_marca').isInt({ min: 1 }).withMessage('id_marca debe ser un entero válido'),
  body('id_tipo').isInt({ min: 1 }).withMessage('id_tipo debe ser un entero válido'),
  body('fecha_lanzamiento').isISO8601().withMessage('fecha_lanzamiento debe ser una fecha válida (YYYY-MM-DD)'),
  body('precio').isFloat({ min: 0 }).withMessage('precio debe ser un número mayor o igual a 0'),
  body('stock').optional().isInt({ min: 0 }).withMessage('stock debe ser un entero mayor o igual a 0'),
  body('imagenes').optional().isArray().withMessage('imagenes debe ser un arreglo de URLs'),
];

router.get('/', dispositivoController.listar);
router.get('/:id', param('id').isInt(), validate, dispositivoController.obtenerPorId);

router.post('/', requireAuth, reglasDispositivo, validate, dispositivoController.crear);
router.put('/:id', requireAuth, param('id').isInt(), validate, dispositivoController.actualizar);
router.delete('/:id', requireAuth, param('id').isInt(), validate, dispositivoController.eliminar);

// Comentarios anidados bajo un dispositivo
router.get(
  '/:idDispositivo/comentarios',
  param('idDispositivo').isInt(),
  validate,
  comentarioController.listarPorDispositivo
);

router.post(
  '/:idDispositivo/comentarios',
  [
    param('idDispositivo').isInt(),
    body('nombre_usuario').trim().notEmpty().withMessage('El nombre es obligatorio').isLength({ max: 80 }),
    body('correo_usuario').optional({ values: 'falsy' }).isEmail().withMessage('Correo inválido'),
    body('comentario').trim().notEmpty().withMessage('El comentario no puede estar vacío').isLength({ max: 1000 }),
    body('calificacion').isInt({ min: 1, max: 5 }).withMessage('La calificación debe estar entre 1 y 5'),
  ],
  validate,
  comentarioController.crear
);

module.exports = router;
