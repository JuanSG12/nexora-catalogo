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

function estrellas(promedio) {
  if (!promedio) return '<span class="text-muted small">Sin calificaciones</span>';
  const llenas = Math.round(promedio);
  return `<span class="rating-stars">${'★'.repeat(llenas)}${'☆'.repeat(5 - llenas)}</span> <span class="text-muted small">(${promedio})</span>`;
}

function tarjetaDispositivo(d) {
  return `
    <div class="col-12 col-sm-6 col-xl-4" data-reveal>
      <a href="detalle.html?id=${d.id_dispositivo}" class="text-decoration-none text-reset d-block h-100">
        <div class="device-card">
          <div class="device-card__img-wrap">
            <div class="device-card__badges">
              <span class="badge-tipo">${escapeHtml(d.tipo_nombre)}</span>
            </div>
            <img src="${escapeHtml(d.imagen_url || 'assets/img/placeholder.svg')}" alt="${escapeHtml(d.nombre)}" loading="lazy" />
          </div>
          <div class="device-card__body">
            <div class="device-card__brand">${escapeHtml(d.marca_nombre)}</div>
            <div class="device-card__name">${escapeHtml(d.nombre)}</div>
            <div class="device-card__meta">Lanzamiento: ${formatoFecha.format(parsearFechaLocal(d.fecha_lanzamiento))}</div>
            <p class="mb-3">${estrellas(d.calificacion_promedio)}</p>
            <div class="device-card__footer">
              <span class="price-tag">${formatoPrecio.format(d.precio)}</span>
              <span class="btn-view">Ver detalle <i class="bi bi-arrow-right"></i></span>
            </div>
          </div>
        </div>
      </a>
    </div>
  `;
}

function tarjetaEsqueleto() {
  return `
    <div class="col-12 col-sm-6 col-xl-4">
      <div class="skeleton-card">
        <div class="skeleton-block"></div>
        <div class="skeleton-block skeleton-line" style="width: 40%;"></div>
        <div class="skeleton-block skeleton-line" style="width: 75%;"></div>
        <div class="skeleton-block skeleton-line" style="width: 55%; margin-bottom: 1.2rem;"></div>
      </div>
    </div>
  `;
}

const estado = {
  page: 1,
  pageSize: 12,
};

function leerFiltros() {
  return {
    q: document.getElementById('buscar').value.trim() || undefined,
    tipo: document.getElementById('filtroTipo').value || undefined,
    marca: document.getElementById('filtroMarca').value || undefined,
    sort: document.getElementById('ordenar').value || undefined,
    page: estado.page,
    pageSize: estado.pageSize,
  };
}

function construirQuery(filtros) {
  const params = new URLSearchParams();
  Object.entries(filtros).forEach(([clave, valor]) => {
    if (valor !== undefined && valor !== '') params.set(clave, valor);
  });
  return params.toString();
}

async function cargarSelects() {
  const [tipos, marcas] = await Promise.all([api.get('/tipos'), api.get('/marcas')]);

  const selTipo = document.getElementById('filtroTipo');
  tipos.forEach((t) => {
    const opt = document.createElement('option');
    opt.value = t.nombre;
    opt.textContent = t.nombre;
    selTipo.appendChild(opt);
  });

  const selMarca = document.getElementById('filtroMarca');
  marcas.forEach((m) => {
    const opt = document.createElement('option');
    opt.value = m.nombre;
    opt.textContent = m.nombre;
    selMarca.appendChild(opt);
  });

  const params = new URLSearchParams(window.location.search);
  if (params.get('tipo')) selTipo.value = params.get('tipo');
  if (params.get('marca')) selMarca.value = params.get('marca');
}

function renderPaginacion(paginacion) {
  const contenedor = document.getElementById('paginacion');
  contenedor.innerHTML = '';
  const { page, totalPages } = paginacion;
  if (totalPages <= 1) return;

  const crearItem = (numero, etiqueta = numero, deshabilitado = false, activo = false) => {
    const li = document.createElement('li');
    li.className = `page-item ${deshabilitado ? 'disabled' : ''} ${activo ? 'active' : ''}`;
    const a = document.createElement('a');
    a.className = 'page-link';
    a.href = '#';
    a.textContent = etiqueta;
    a.addEventListener('click', (e) => {
      e.preventDefault();
      if (!deshabilitado) {
        estado.page = numero;
        cargarDispositivos();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
    li.appendChild(a);
    return li;
  };

  contenedor.appendChild(crearItem(page - 1, '«', page <= 1));
  for (let i = 1; i <= totalPages; i += 1) {
    contenedor.appendChild(crearItem(i, String(i), false, i === page));
  }
  contenedor.appendChild(crearItem(page + 1, '»', page >= totalPages));
}

async function cargarDispositivos() {
  const listado = document.getElementById('listadoDispositivos');
  const cargando = document.getElementById('estadoCarga');
  const sinResultados = document.getElementById('sinResultados');

  cargando.innerHTML = Array.from({ length: 6 }, tarjetaEsqueleto).join('');
  listado.innerHTML = '';
  sinResultados.classList.add('d-none');

  try {
    const query = construirQuery(leerFiltros());
    const { data, pagination } = await api.get(`/dispositivos?${query}`);

    document.getElementById('resultadosConteo').textContent = `${pagination.total} resultado(s)`;
    const heroTotal = document.getElementById('heroTotalDispositivos');
    if (heroTotal && heroTotal.textContent === '—') heroTotal.textContent = pagination.total;

    if (data.length === 0) {
      sinResultados.classList.remove('d-none');
    } else {
      listado.innerHTML = data.map(tarjetaDispositivo).join('');
      requestAnimationFrame(() => refreshScrollReveal());
    }
    renderPaginacion(pagination);
  } catch (err) {
    listado.innerHTML = `<div class="col-12 alert alert-danger">Error cargando dispositivos: ${err.message}</div>`;
  } finally {
    cargando.innerHTML = '';
  }
}

document.getElementById('filtrosForm').addEventListener('submit', (e) => {
  e.preventDefault();
  estado.page = 1;
  cargarDispositivos();
});

document.getElementById('limpiarFiltros').addEventListener('click', () => {
  document.getElementById('buscar').value = '';
  document.getElementById('filtroTipo').value = '';
  document.getElementById('filtroMarca').value = '';
  document.getElementById('ordenar').value = 'fecha_desc';
  estado.page = 1;
  cargarDispositivos();
});

(async function init() {
  await cargarSelects();
  await cargarDispositivos();
})();
