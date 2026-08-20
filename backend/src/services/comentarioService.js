const comentarioRepository = require('../repositories/comentarioRepository');
const dispositivoService = require('./dispositivoService');
const ApiError = require('../utils/ApiError');

function listarTodos() {
  return comentarioRepository.findAll();
}

function listarPorDispositivo(idDispositivo) {
  dispositivoService.obtenerPorId(idDispositivo);
  return comentarioRepository.findByDispositivo(idDispositivo);
}

function crear(idDispositivo, { nombre_usuario, correo_usuario, comentario, calificacion }) {
  dispositivoService.obtenerPorId(idDispositivo);
  return comentarioRepository.create({
    id_dispositivo: idDispositivo,
    nombre_usuario,
    correo_usuario,
    comentario,
    calificacion,
  });
}

function eliminar(idComentario) {
  const existe = comentarioRepository.findById(idComentario);
  if (!existe) {
    throw ApiError.notFound(`No existe el comentario ${idComentario}`);
  }
  return comentarioRepository.remove(idComentario);
}

module.exports = { listarTodos, listarPorDispositivo, crear, eliminar };
