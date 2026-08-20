const formatoPrecio = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

const formatoFecha = new Intl.DateTimeFormat('es-CO', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

const formatoFechaCorta = new Intl.DateTimeFormat('es-CO', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

function parsearFechaLocal(fechaISO) {
  const [anio, mes, dia] = fechaISO.split('-').map(Number);
  return new Date(anio, mes - 1, dia);
}

function iniciales(nombre) {
  return nombre
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();
}

function obtenerIdDispositivo() {
  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get('id'));
  return Number.isInteger(id) && id > 0 ? id : null;
}

function estrellas(promedio) {
  if (!promedio) return '<span class="text-muted">Sin calificaciones aún</span>';
  const llenas = Math.round(promedio);
  return `<span class="rating-stars">${'★'.repeat(llenas)}${'☆'.repeat(5 - llenas)}</span> <span class="text-muted">${promedio} / 5</span>`;
}

const SPEC_CHIPS = [
  { campo: 'ram', etiqueta: 'RAM' },
  { campo: 'almacenamiento', etiqueta: 'Almacenamiento' },
  { campo: 'pantalla', etiqueta: 'Pantalla' },
  { campo: 'bateria', etiqueta: 'Batería' },
];

const SPECS_LABELS = {
  procesador: 'Procesador',
  ram: 'Memoria RAM',
  almacenamiento: 'Almacenamiento',
  pantalla: 'Pantalla',
  bateria: 'Batería',
  sistema_operativo: 'Sistema operativo',
  camara: 'Cámara',
  color: 'Color',
};

function renderGaleria(d) {
  const imagenPrincipal = document.getElementById('detalleImagen');
  const contenedorThumbs = document.getElementById('galeriaThumbs');
  const imagenes = d.imagenes && d.imagenes.length ? d.imagenes : [{ url: d.imagen_url, etiqueta: 'Frontal' }];

  imagenPrincipal.src = imagenes[0].url || 'assets/img/placeholder.svg';
  imagenPrincipal.alt = `${d.nombre} — ${imagenes[0].etiqueta || 'vista frontal'}`;

  if (imagenes.length <= 1) {
    contenedorThumbs.innerHTML = '';
    return;
  }

  contenedorThumbs.innerHTML = imagenes
    .map(
      (img, i) => `
        <button type="button" class="gallery-thumb ${i === 0 ? 'active' : ''}" data-src="${escapeHtml(img.url)}" data-alt="${escapeHtml(img.etiqueta || '')}" aria-label="Ver vista ${escapeHtml(img.etiqueta || i + 1)}">
          <img src="${escapeHtml(img.url)}" alt="" loading="lazy" />
        </button>
      `
    )
    .join('');

  contenedorThumbs.querySelectorAll('.gallery-thumb').forEach((thumb) => {
    thumb.addEventListener('click', () => {
      contenedorThumbs.querySelectorAll('.gallery-thumb').forEach((t) => t.classList.remove('active'));
      thumb.classList.add('active');
      imagenPrincipal.style.opacity = 0;
      setTimeout(() => {
        imagenPrincipal.src = thumb.dataset.src;
        imagenPrincipal.alt = `${d.nombre} — ${thumb.dataset.alt}`;
        imagenPrincipal.style.opacity = 1;
      }, 120);
    });
  });
}

function renderDispositivo(d) {
  document.getElementById('breadcrumbNombre').textContent = d.nombre;
  renderGaleria(d);
  document.getElementById('detalleTipo').textContent = d.tipo_nombre;
  document.getElementById('detalleNombre').textContent = d.nombre;
  document.getElementById('detalleMarcaFecha').textContent =
    `${d.marca_nombre} · Lanzamiento: ${formatoFecha.format(parsearFechaLocal(d.fecha_lanzamiento))}`;
  document.getElementById('detalleRating').innerHTML = estrellas(d.calificacion_promedio);
  document.getElementById('detallePrecio').textContent = formatoPrecio.format(d.precio);
  document.getElementById('detalleDescripcion').textContent = d.descripcion || '';

  document.getElementById('detalleSpecChips').innerHTML = SPEC_CHIPS.filter(({ campo }) => d[campo])
    .map(({ campo, etiqueta }) => `<div class="spec-chip"><strong>${etiqueta}</strong>${escapeHtml(d[campo])}</div>`)
    .join('');

  const stockBadge = document.getElementById('detalleStock');
  if (d.stock > 0) {
    stockBadge.textContent = `${d.stock} unidades disponibles`;
    stockBadge.className = 'badge bg-success rounded-pill px-3 py-2';
  } else {
    stockBadge.textContent = 'Sin stock disponible';
    stockBadge.className = 'badge bg-secondary rounded-pill px-3 py-2';
  }

  const specsBody = document.getElementById('detalleSpecs');
  specsBody.innerHTML = Object.entries(SPECS_LABELS)
    .filter(([campo]) => d[campo])
    .map(([campo, etiqueta]) => `<tr><th>${etiqueta}</th><td>${escapeHtml(d[campo])}</td></tr>`)
    .join('');
}

function renderResumenReseñas(comentarios) {
  const total = comentarios.length;
  document.getElementById('reviewCount').textContent =
    total === 0 ? 'Sin opiniones aún' : `Basado en ${total} opinión${total === 1 ? '' : 'es'}`;

  if (total === 0) {
    document.getElementById('reviewScore').textContent = '—';
    document.getElementById('reviewStars').innerHTML = '';
    return;
  }

  const promedio = comentarios.reduce((acc, c) => acc + c.calificacion, 0) / total;
  const redondeado = Math.round(promedio * 10) / 10;
  document.getElementById('reviewScore').textContent = redondeado;
  const llenas = Math.round(promedio);
  document.getElementById('reviewStars').innerHTML = `${'★'.repeat(llenas)}${'☆'.repeat(5 - llenas)}`;
}

function tarjetaComentario(c) {
  const llenas = c.calificacion;
  return `
    <div class="comment-card">
      <div class="d-flex gap-3">
        <div class="avatar-circle">${escapeHtml(iniciales(c.nombre_usuario))}</div>
        <div class="flex-fill">
          <div class="d-flex justify-content-between align-items-start">
            <strong>${escapeHtml(c.nombre_usuario)}</strong>
            <span class="rating-stars small">${'★'.repeat(llenas)}${'☆'.repeat(5 - llenas)}</span>
          </div>
          <p class="mb-1 mt-1">${escapeHtml(c.comentario)}</p>
          <span class="text-muted small">${formatoFechaCorta.format(new Date(c.fecha_creacion))}</span>
        </div>
      </div>
    </div>
  `;
}

async function cargarComentarios(idDispositivo) {
  const comentarios = await api.get(`/dispositivos/${idDispositivo}/comentarios`);
  renderResumenReseñas(comentarios);

  const lista = document.getElementById('listaComentarios');
  const vacio = document.getElementById('sinComentarios');

  if (comentarios.length === 0) {
    lista.innerHTML = '';
    vacio.classList.remove('d-none');
  } else {
    vacio.classList.add('d-none');
    lista.innerHTML = comentarios.map(tarjetaComentario).join('');
  }
}

async function init() {
  const idDispositivo = obtenerIdDispositivo();
  const cargando = document.getElementById('estadoCarga');
  const errorBox = document.getElementById('errorDispositivo');

  if (!idDispositivo) {
    cargando.classList.add('d-none');
    errorBox.textContent = 'El identificador del dispositivo no es válido.';
    errorBox.classList.remove('d-none');
    return;
  }

  try {
    const dispositivo = await api.get(`/dispositivos/${idDispositivo}`);
    renderDispositivo(dispositivo);
    await cargarComentarios(idDispositivo);
    document.getElementById('contenidoDetalle').classList.remove('d-none');
    initScrollReveal();
    requestAnimationFrame(() => refreshScrollReveal());
  } catch (err) {
    errorBox.textContent = `No fue posible cargar el dispositivo: ${err.message}`;
    errorBox.classList.remove('d-none');
    return;
  } finally {
    cargando.classList.add('d-none');
  }

  document.getElementById('formComentario').addEventListener('submit', async (e) => {
    e.preventDefault();
    const mensaje = document.getElementById('comentarioMensaje');
    mensaje.textContent = '';
    mensaje.className = 'ms-2 small';

    const cuerpo = {
      nombre_usuario: document.getElementById('comentarioNombre').value.trim(),
      correo_usuario: document.getElementById('comentarioCorreo').value.trim() || undefined,
      calificacion: Number(document.getElementById('comentarioCalificacion').value),
      comentario: document.getElementById('comentarioTexto').value.trim(),
    };

    try {
      await api.post(`/dispositivos/${idDispositivo}/comentarios`, cuerpo);
      document.getElementById('formComentario').reset();
      mensaje.textContent = '¡Gracias por tu opinión!';
      mensaje.classList.add('text-success');
      await cargarComentarios(idDispositivo);
    } catch (err) {
      mensaje.textContent = err.message;
      mensaje.classList.add('text-danger');
    }
  });
}

init();
