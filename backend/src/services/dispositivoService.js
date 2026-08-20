const dispositivoRepository = require('../repositories/dispositivoRepository');
const marcaRepository = require('../repositories/marcaRepository');
const tipoRepository = require('../repositories/tipoRepository');
const imagenRepository = require('../repositories/imagenRepository');
const ApiError = require('../utils/ApiError');

function listar(filtros) {
  return dispositivoRepository.search(filtros);
}

function obtenerPorId(id) {
  const dispositivo = dispositivoRepository.findById(id);
  if (!dispositivo) {
    throw ApiError.notFound(`No existe un dispositivo con id ${id}`);
  }
  return dispositivo;
}

function validarReferencias({ id_marca, id_tipo }) {
  if (!marcaRepository.findById(id_marca)) {
    throw ApiError.badRequest(`La marca ${id_marca} no existe`);
  }
  if (!tipoRepository.findById(id_tipo)) {
    throw ApiError.badRequest(`El tipo ${id_tipo} no existe`);
  }
}

function crear({ imagenes, ...datos }) {
  validarReferencias(datos);
  const dispositivo = dispositivoRepository.create(datos);
  if (imagenes) imagenRepository.reemplazarGaleria(dispositivo.id_dispositivo, imagenes);
  return obtenerPorId(dispositivo.id_dispositivo);
}

function actualizar(id, { imagenes, ...datos }) {
  obtenerPorId(id);
  if (datos.id_marca != null || datos.id_tipo != null) {
    validarReferencias({
      id_marca: datos.id_marca ?? obtenerPorId(id).id_marca,
      id_tipo: datos.id_tipo ?? obtenerPorId(id).id_tipo,
    });
  }
  dispositivoRepository.update(id, datos);
  if (imagenes) imagenRepository.reemplazarGaleria(id, imagenes);
  return obtenerPorId(id);
}

function eliminar(id) {
  obtenerPorId(id);
  return dispositivoRepository.remove(id);
}

module.exports = { listar, obtenerPorId, crear, actualizar, eliminar };
