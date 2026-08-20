const authService = require('../services/authService');
const asyncHandler = require('../utils/asyncHandler');

const login = asyncHandler(async (req, res) => {
  const { usuario, password } = req.body;
  const resultado = await authService.login(usuario, password);
  res.json(resultado);
});

const perfil = asyncHandler(async (req, res) => {
  res.json({ admin: req.admin });
});

module.exports = { login, perfil };
