const { Router } = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const validate = require('../middlewares/validate');
const { requireAuth } = require('../middlewares/authMiddleware');

const router = Router();

router.post(
  '/login',
  [body('usuario').trim().notEmpty(), body('password').notEmpty()],
  validate,
  authController.login
);

router.get('/perfil', requireAuth, authController.perfil);

module.exports = router;
