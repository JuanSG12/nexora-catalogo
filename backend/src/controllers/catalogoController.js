const catalogoService = require('../services/catalogoService');
const asyncHandler = require('../utils/asyncHandler');

const listarMarcas = asyncHandler(async (req, res) => {
  res.json(catalogoService.listarMarcas());
});

const listarTipos = asyncHandler(async (req, res) => {
  res.json(catalogoService.listarTipos());
});

const crearMarca = asyncHandler(async (req, res) => {
  const marca = catalogoService.crearMarca(req.body);
  res.status(201).json(marca);
});

const crearTipo = asyncHandler(async (req, res) => {
  const tipo = catalogoService.crearTipo(req.body);
  res.status(201).json(tipo);
});

module.exports = { listarMarcas, listarTipos, crearMarca, crearTipo };
