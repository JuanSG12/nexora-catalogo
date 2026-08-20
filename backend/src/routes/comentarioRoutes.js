const { Router } = require('express');
const { param } = require('express-validator');
const comentarioController = require('../controllers/comentarioController');
const validate = require('../middlewares/validate');
const { requireAuth } = require('../middlewares/authMiddleware');

const router = Router();

// Listado global de comentarios (moderación desde el panel admin)
router.get('/', requireAuth, comentarioController.listarTodos);

// Eliminación de un comentario puntual (moderación desde el panel admin)
router.delete('/:id', requireAuth, param('id').isInt(), validate, comentarioController.eliminar);

module.exports = router;
