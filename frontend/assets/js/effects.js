/**
 * Efectos visuales compartidos: partículas en canvas (fondo tipo "órbita",
 * coherente con el logo), scroll-reveal por IntersectionObserver, contador
 * animado y sombra de navbar al hacer scroll. Todo respeta
 * prefers-reduced-motion y se pausa cuando la pestaña no está visible.
 */

const PREFERS_REDUCED_MOTION =
  window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Dibuja un campo de partículas suaves conectadas por líneas, dentro del
 * canvas indicado. `canvas` debe estar posicionado con position:absolute
 * cubriendo a su contenedor (ver .particles-canvas en styles.css).
 */
function initParticles(canvas, { count = 46, colors = ['#ffffff', '#ff6a1a', '#14b8a6'] } = {}) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  let particulas = [];
  let animando = true;

  function crearParticulas() {
    particulas = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.6 + 0.6,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
  }

  function ajustarTamano() {
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    crearParticulas();
  }

  function dibujar() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particulas.length; i += 1) {
      const p = particulas[i];
      for (let j = i + 1; j < particulas.length; j += 1) {
        const q = particulas[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          ctx.strokeStyle = `rgba(255,255,255,${0.08 * (1 - dist / 130)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
    }
    for (const p of particulas) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = 0.55;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  function mover() {
    for (const p of particulas) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
    }
  }

  function loop() {
    if (!animando) return;
    mover();
    dibujar();
    requestAnimationFrame(loop);
  }

  ajustarTamano();
  window.addEventListener('resize', ajustarTamano);
  document.addEventListener('visibilitychange', () => {
    animando = document.visibilityState === 'visible' && !PREFERS_REDUCED_MOTION;
    if (animando) requestAnimationFrame(loop);
  });

  if (PREFERS_REDUCED_MOTION) {
    dibujar();
  } else {
    loop();
  }
}

/**
 * Revela con fade+slide los elementos marcados con [data-reveal] cuando
 * entran en el viewport. Si el usuario prefiere menos movimiento, se
 * muestran de una vez sin animación.
 */
function initScrollReveal() {
  const elementos = document.querySelectorAll('[data-reveal]');
  if (elementos.length === 0) return;

  if (PREFERS_REDUCED_MOTION || !('IntersectionObserver' in window)) {
    elementos.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elementos.forEach((el, index) => {
    el.style.transitionDelay = `${Math.min(index % 6, 6) * 60}ms`;
    observer.observe(el);
  });
}

/** Reobserva elementos añadidos dinámicamente después de una carga async. */
function refreshScrollReveal(root = document) {
  const elementos = root.querySelectorAll('[data-reveal]:not(.is-visible)');
  if (PREFERS_REDUCED_MOTION || !('IntersectionObserver' in window)) {
    elementos.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  elementos.forEach((el, index) => {
    el.style.transitionDelay = `${Math.min(index % 6, 6) * 45}ms`;
    requestAnimationFrame(() => el.classList.add('is-visible'));
  });
}

/** Anima de 0 al valor final los contadores [data-count-to]. */
function initCounters() {
  const contadores = document.querySelectorAll('[data-count-to]');
  contadores.forEach((el) => {
    const destino = Number(el.dataset.countTo);
    if (!Number.isFinite(destino)) return;
    if (PREFERS_REDUCED_MOTION) {
      el.textContent = destino;
      return;
    }
    const duracion = 900;
    const inicio = performance.now();
    function paso(ahora) {
      const progreso = Math.min(1, (ahora - inicio) / duracion);
      const valor = Math.floor(progreso * destino);
      el.textContent = valor;
      if (progreso < 1) requestAnimationFrame(paso);
    }
    requestAnimationFrame(paso);
  });
}

/** Añade sombra/blur al navbar una vez el usuario baja de cierto scroll. */
function initNavbarScrollShadow(selector = '.navbar-nexora') {
  const nav = document.querySelector(selector);
  if (!nav) return;
  const actualizar = () => nav.classList.toggle('is-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', actualizar, { passive: true });
  actualizar();
}
