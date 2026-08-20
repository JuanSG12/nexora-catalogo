const dispositivoService = require('../services/dispositivoService');
const asyncHandler = require('../utils/asyncHandler');

const listar = asyncHandler(async (req, res) => {
  const { tipo, marca, q, precioMin, precioMax, sort, page, pageSize } = req.query;
  const resultado = dispositivoService.listar({
    tipo,
    marca,
    q,
    precioMin: precioMin != null ? Number(precioMin) : undefined,
    precioMax: precioMax != null ? Number(precioMax) : undefined,
    sort,
    page,
    pageSize,
  });
  res.json(resultado);
});

const obtenerPorId = asyncHandler(async (req, res) => {
  const dispositivo = dispositivoService.obtenerPorId(Number(req.params.id));
  res.json(dispositivo);
});

const crear = asyncHandler(async (req, res) => {
  const dispositivo = dispositivoService.crear(req.body);
  res.status(201).json(dispositivo);
});

const actualizar = asyncHandler(async (req, res) => {
  const dispositivo = dispositivoService.actualizar(Number(req.params.id), req.body);
  res.json(dispositivo);
});

const eliminar = asyncHandler(async (req, res) => {
  dispositivoService.eliminar(Number(req.params.id));
  res.status(204).send();
});

module.exports = { listar, obtenerPorId, crear, actualizar, eliminar };
