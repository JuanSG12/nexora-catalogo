const marcaRepository = require('../repositories/marcaRepository');
const tipoRepository = require('../repositories/tipoRepository');
const ApiError = require('../utils/ApiError');

function listarMarcas() {
  return marcaRepository.findAll();
}

function listarTipos() {
  return tipoRepository.findAll();
}

function crearMarca({ nombre, logo_url }) {
  if (marcaRepository.findByNombre(nombre)) {
    throw ApiError.conflict(`Ya existe la marca "${nombre}"`);
  }
  return marcaRepository.create({ nombre, logo_url });
}

function crearTipo({ nombre }) {
  if (tipoRepository.findByNombre(nombre)) {
    throw ApiError.conflict(`Ya existe el tipo "${nombre}"`);
  }
  return tipoRepository.create({ nombre });
}

module.exports = { listarMarcas, listarTipos, crearMarca, crearTipo };
