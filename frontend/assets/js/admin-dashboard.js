if (!getToken()) {
  window.location.replace('login.html');
}

const formatoPrecio = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

let cacheMarcas = [];
let cacheTipos = [];

function mostrarMensaje(idContenedor, texto, tipo = 'success') {
  const el = document.getElementById(idContenedor);
  el.textContent = texto;
  el.className = `alert alert-${tipo}`;
  setTimeout(() => el.classList.add('d-none'), 4000);
}

async function manejarErrorAuth(err) {
  if (err.status === 401) {
    clearToken();
    window.location.replace('login.html');
    return true;
  }
  return false;
}

// -------------------- Navegación entre secciones --------------------
const TITULOS_SECCION = {
  dispositivos: 'Dispositivos',
  comentarios: 'Comentarios',
  catalogo: 'Marcas y tipos',
};

document.querySelectorAll('[data-section]').forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelectorAll('[data-section]').forEach((l) => l.classList.remove('active'));
    link.classList.add('active');

    document.querySelectorAll('main section').forEach((s) => s.classList.add('d-none'));
    document.getElementById(`seccion-${link.dataset.section}`).classList.remove('d-none');
    document.getElementById('tituloSeccion').textContent = TITULOS_SECCION[link.dataset.section];
  });
});

document.getElementById('btnLogout').addEventListener('click', () => {
  clearToken();
  window.location.replace('login.html');
});

// -------------------- Catálogo: marcas y tipos --------------------
async function cargarCatalogo() {
  try {
    [cacheMarcas, cacheTipos] = await Promise.all([api.get('/marcas'), api.get('/tipos')]);
  } catch (err) {
    if (await manejarErrorAuth(err)) return;
  }

  const selMarca = document.getElementById('fMarca');
  selMarca.innerHTML = cacheMarcas
    .map((m) => `<option value="${m.id_marca}">${escapeHtml(m.nombre)}</option>`)
    .join('');

  const selTipo = document.getElementById('fTipo');
  selTipo.innerHTML = cacheTipos
    .map((t) => `<option value="${t.id_tipo}">${escapeHtml(t.nombre)}</option>`)
    .join('');

  document.getElementById('listaMarcas').innerHTML = cacheMarcas
    .map((m) => `<li class="list-group-item">${escapeHtml(m.nombre)}</li>`)
    .join('') || '<li class="list-group-item text-muted">Sin marcas registradas</li>';

  document.getElementById('listaTipos').innerHTML = cacheTipos
    .map((t) => `<li class="list-group-item">${escapeHtml(t.nombre)}</li>`)
    .join('') || '<li class="list-group-item text-muted">Sin tipos registrados</li>';
}

document.getElementById('formMarca').addEventListener('submit', async (e) => {
  e.preventDefault();
  const nombre = document.getElementById('nuevaMarca').value.trim();
  try {
    await api.post('/marcas', { nombre }, { auth: true });
    document.getElementById('nuevaMarca').value = '';
    mostrarMensaje('marcaMensaje', `Marca "${nombre}" agregada.`);
    await cargarCatalogo();
  } catch (err) {
    if (await manejarErrorAuth(err)) return;
    mostrarMensaje('marcaMensaje', err.message, 'danger');
  }
});

document.getElementById('formTipo').addEventListener('submit', async (e) => {
  e.preventDefault();
  const nombre = document.getElementById('nuevoTipo').value.trim();
  try {
    await api.post('/tipos', { nombre }, { auth: true });
    document.getElementById('nuevoTipo').value = '';
    mostrarMensaje('tipoMensaje', `Tipo "${nombre}" agregado.`);
    await cargarCatalogo();
  } catch (err) {
    if (await manejarErrorAuth(err)) return;
    mostrarMensaje('tipoMensaje', err.message, 'danger');
  }
});

// -------------------- Dispositivos --------------------
function filaDispositivo(d) {
  return `
    <tr>
      <td>${escapeHtml(d.nombre)}</td>
      <td>${escapeHtml(d.marca_nombre)}</td>
      <td>${escapeHtml(d.tipo_nombre)}</td>
      <td>${d.fecha_lanzamiento}</td>
      <td>${formatoPrecio.format(d.precio)}</td>
      <td>${d.stock}</td>
      <td class="text-end table-actions">
        <button class="btn btn-sm btn-outline-primary" data-editar="${d.id_dispositivo}">Editar</button>
        <button class="btn btn-sm btn-outline-danger" data-eliminar="${d.id_dispositivo}">Eliminar</button>
      </td>
    </tr>
  `;
}

async function cargarDispositivos() {
  try {
    const { data } = await api.get('/dispositivos?pageSize=48&sort=fecha_desc');
    document.getElementById('tablaDispositivos').innerHTML = data.map(filaDispositivo).join('');
  } catch (err) {
    if (await manejarErrorAuth(err)) return;
    mostrarMensaje('dispositivosMensaje', err.message, 'danger');
  }
}

function limpiarFormularioDispositivo() {
  document.getElementById('formDispositivo').reset();
  document.getElementById('dispositivoId').value = '';
  document.getElementById('modalDispositivoTitulo').textContent = 'Nuevo dispositivo';
  document.getElementById('formDispositivoError').classList.add('d-none');
}

document.getElementById('btnNuevoDispositivo').addEventListener('click', limpiarFormularioDispositivo);

function leerFormularioDispositivo() {
  const galeria = document
    .getElementById('fGaleria')
    .value.split(',')
    .map((url) => url.trim())
    .filter(Boolean);

  return {
    nombre: document.getElementById('fNombre').value.trim(),
    id_marca: Number(document.getElementById('fMarca').value),
    id_tipo: Number(document.getElementById('fTipo').value),
    fecha_lanzamiento: document.getElementById('fFecha').value,
    precio: Number(document.getElementById('fPrecio').value),
    stock: Number(document.getElementById('fStock').value) || 0,
    imagen_url: document.getElementById('fImagen').value.trim() || null,
    imagenes: galeria,
    descripcion: document.getElementById('fDescripcion').value.trim() || null,
    procesador: document.getElementById('fProcesador').value.trim() || null,
    ram: document.getElementById('fRam').value.trim() || null,
    almacenamiento: document.getElementById('fAlmacenamiento').value.trim() || null,
    pantalla: document.getElementById('fPantalla').value.trim() || null,
    bateria: document.getElementById('fBateria').value.trim() || null,
    sistema_operativo: document.getElementById('fSistemaOperativo').value.trim() || null,
    camara: document.getElementById('fCamara').value.trim() || null,
    color: document.getElementById('fColor').value.trim() || null,
  };
}

document.getElementById('formDispositivo').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('dispositivoId').value;
  const cuerpo = leerFormularioDispositivo();
  const errorBox = document.getElementById('formDispositivoError');
  errorBox.classList.add('d-none');

  try {
    if (id) {
      await api.put(`/dispositivos/${id}`, cuerpo, { auth: true });
      mostrarMensaje('dispositivosMensaje', 'Dispositivo actualizado correctamente.');
    } else {
      await api.post('/dispositivos', cuerpo, { auth: true });
      mostrarMensaje('dispositivosMensaje', 'Dispositivo creado correctamente.');
    }
    bootstrap.Modal.getInstance(document.getElementById('modalDispositivo')).hide();
    await cargarDispositivos();
  } catch (err) {
    if (await manejarErrorAuth(err)) return;
    errorBox.textContent = err.message;
    errorBox.classList.remove('d-none');
  }
});

document.getElementById('tablaDispositivos').addEventListener('click', async (e) => {
  const idEditar = e.target.dataset.editar;
  const idEliminar = e.target.dataset.eliminar;

  if (idEditar) {
    try {
      const d = await api.get(`/dispositivos/${idEditar}`);
      document.getElementById('modalDispositivoTitulo').textContent = `Editar: ${d.nombre}`;
      document.getElementById('dispositivoId').value = d.id_dispositivo;
      document.getElementById('fNombre').value = d.nombre;
      document.getElementById('fMarca').value = d.id_marca;
      document.getElementById('fTipo').value = d.id_tipo;
      document.getElementById('fFecha').value = d.fecha_lanzamiento;
      document.getElementById('fPrecio').value = d.precio;
      document.getElementById('fStock').value = d.stock;
      document.getElementById('fImagen').value = d.imagen_url || '';
      const extra = (d.imagenes || []).filter((img) => img.orden > 0).map((img) => img.url);
      document.getElementById('fGaleria').value = extra.join(', ');
      document.getElementById('fDescripcion').value = d.descripcion || '';
      document.getElementById('fProcesador').value = d.procesador || '';
      document.getElementById('fRam').value = d.ram || '';
      document.getElementById('fAlmacenamiento').value = d.almacenamiento || '';
      document.getElementById('fPantalla').value = d.pantalla || '';
      document.getElementById('fBateria').value = d.bateria || '';
      document.getElementById('fSistemaOperativo').value = d.sistema_operativo || '';
      document.getElementById('fCamara').value = d.camara || '';
      document.getElementById('fColor').value = d.color || '';
      new bootstrap.Modal(document.getElementById('modalDispositivo')).show();
    } catch (err) {
      if (await manejarErrorAuth(err)) return;
      mostrarMensaje('dispositivosMensaje', err.message, 'danger');
    }
  }

  if (idEliminar) {
    if (!window.confirm('¿Eliminar este dispositivo? Esta acción no se puede deshacer.')) return;
    try {
      await api.delete(`/dispositivos/${idEliminar}`, { auth: true });
      mostrarMensaje('dispositivosMensaje', 'Dispositivo eliminado.');
      await cargarDispositivos();
    } catch (err) {
      if (await manejarErrorAuth(err)) return;
      mostrarMensaje('dispositivosMensaje', err.message, 'danger');
    }
  }
});

// -------------------- Comentarios --------------------
function filaComentario(c) {
  return `
    <tr>
      <td>${escapeHtml(c.dispositivo_nombre)}</td>
      <td>${escapeHtml(c.nombre_usuario)}</td>
      <td>${'★'.repeat(c.calificacion)}${'☆'.repeat(5 - c.calificacion)}</td>
      <td style="max-width: 320px;">${escapeHtml(c.comentario)}</td>
      <td>${c.fecha_creacion}</td>
      <td class="text-end">
        <button class="btn btn-sm btn-outline-danger" data-eliminar-comentario="${c.id_comentario}">Eliminar</button>
      </td>
    </tr>
  `;
}

async function cargarComentarios() {
  try {
    const comentarios = await api.get('/comentarios', { auth: true });
    document.getElementById('tablaComentarios').innerHTML = comentarios.map(filaComentario).join('');
  } catch (err) {
    if (await manejarErrorAuth(err)) return;
    mostrarMensaje('comentariosMensaje', err.message, 'danger');
  }
}

document.getElementById('tablaComentarios').addEventListener('click', async (e) => {
  const id = e.target.dataset.eliminarComentario;
  if (!id) return;
  if (!window.confirm('¿Eliminar este comentario?')) return;
  try {
    await api.delete(`/comentarios/${id}`, { auth: true });
    mostrarMensaje('comentariosMensaje', 'Comentario eliminado.');
    await cargarComentarios();
  } catch (err) {
    if (await manejarErrorAuth(err)) return;
    mostrarMensaje('comentariosMensaje', err.message, 'danger');
  }
});

// -------------------- Inicialización --------------------
(async function init() {
  try {
    const { admin } = await api.get('/auth/perfil', { auth: true });
    document.getElementById('adminNombre').textContent = admin.usuario;
  } catch (err) {
    await manejarErrorAuth(err);
    return;
  }

  await cargarCatalogo();
  await cargarDispositivos();
  await cargarComentarios();
})();
