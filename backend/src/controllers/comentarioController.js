const comentarioService = require('../services/comentarioService');
const asyncHandler = require('../utils/asyncHandler');

const listarTodos = asyncHandler(async (req, res) => {
  res.json(comentarioService.listarTodos());
});

const listarPorDispositivo = asyncHandler(async (req, res) => {
  const comentarios = comentarioService.listarPorDispositivo(Number(req.params.idDispositivo));
  res.json(comentarios);
});

const crear = asyncHandler(async (req, res) => {
  const comentario = comentarioService.crear(Number(req.params.idDispositivo), req.body);
  res.status(201).json(comentario);
});

const eliminar = asyncHandler(async (req, res) => {
  comentarioService.eliminar(Number(req.params.id));
  res.status(204).send();
});

module.exports = { listarTodos, listarPorDispositivo, crear, eliminar };
