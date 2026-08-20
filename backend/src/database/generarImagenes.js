/**
 * Genera renders ilustrados (SVG) de cada dispositivo sembrado, en tres
 * vistas — frontal, ángulo y posterior — para alimentar la galería estilo
 * "marketplace" de la página de detalle. No son fotografías reales (esta
 * actividad no tiene licencia sobre fotografía de producto de terceros):
 * son renders vectoriales generados con gradientes, brillo de pantalla y
 * sombra de suelo para simular profundidad.
 *
 * Uso: node src/database/generarImagenes.js
 */
const fs = require('node:fs');
const path = require('node:path');

const outDir = path.resolve(__dirname, '../../../frontend/assets/img/devices');
fs.mkdirSync(outDir, { recursive: true });

function oscurecer(hex, porcentaje) {
  const n = hex.replace('#', '');
  const r = Math.max(0, parseInt(n.slice(0, 2), 16) * (1 - porcentaje));
  const g = Math.max(0, parseInt(n.slice(2, 4), 16) * (1 - porcentaje));
  const b = Math.max(0, parseInt(n.slice(4, 6), 16) * (1 - porcentaje));
  return `rgb(${r.toFixed(0)}, ${g.toFixed(0)}, ${b.toFixed(0)})`;
}

function aclarar(hex, porcentaje) {
  const n = hex.replace('#', '');
  const r = Math.min(255, parseInt(n.slice(0, 2), 16) + (255 - parseInt(n.slice(0, 2), 16)) * porcentaje);
  const g = Math.min(255, parseInt(n.slice(2, 4), 16) + (255 - parseInt(n.slice(2, 4), 16)) * porcentaje);
  const b = Math.min(255, parseInt(n.slice(4, 6), 16) + (255 - parseInt(n.slice(4, 6), 16)) * porcentaje);
  return `rgb(${r.toFixed(0)}, ${g.toFixed(0)}, ${b.toFixed(0)})`;
}

const DISPOSITIVOS = [
  { slug: 'galaxy-s24-ultra', nombre: 'Galaxy S24 Ultra', tipo: 'celular', color: '#5b6ee1' },
  { slug: 'galaxy-a55', nombre: 'Galaxy A55', tipo: 'celular', color: '#2f5fd6' },
  { slug: 'iphone-15-pro-max', nombre: 'iPhone 15 Pro Max', tipo: 'celular', color: '#4b5563' },
  { slug: 'iphone-14', nombre: 'iPhone 14', tipo: 'celular', color: '#1f2937' },
  { slug: 'redmi-note-13-pro', nombre: 'Redmi Note 13 Pro', tipo: 'celular', color: '#f97316' },
  { slug: 'xiaomi-14', nombre: 'Xiaomi 14', tipo: 'celular', color: '#ea580c' },
  { slug: 'moto-edge-40', nombre: 'Moto Edge 40', tipo: 'celular', color: '#16a34a' },
  { slug: 'pixel-8', nombre: 'Pixel 8', tipo: 'celular', color: '#0891b2' },
  { slug: 'macbook-air-m3', nombre: 'MacBook Air M3', tipo: 'portatil', color: '#94a3b8' },
  { slug: 'macbook-pro-14', nombre: 'MacBook Pro 14"', tipo: 'portatil', color: '#334155' },
  { slug: 'thinkpad-x1-carbon', nombre: 'ThinkPad X1 Carbon', tipo: 'portatil', color: '#dc2626' },
  { slug: 'ideapad-slim-5', nombre: 'IdeaPad Slim 5', tipo: 'portatil', color: '#7c3aed' },
  { slug: 'hp-pavilion-15', nombre: 'HP Pavilion 15', tipo: 'portatil', color: '#0369a1' },
  { slug: 'asus-zenbook-14', nombre: 'ZenBook 14 OLED', tipo: 'portatil', color: '#059669' },
  { slug: 'dell-xps-13', nombre: 'Dell XPS 13', tipo: 'portatil', color: '#1e40af' },
];

function lienzo(idGrad, cuerpo) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 320">
  <defs>
    <radialGradient id="sombra-${idGrad}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#0a0e1a" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#0a0e1a" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="400" height="320" fill="none"/>
  <ellipse cx="200" cy="278" rx="120" ry="18" fill="url(#sombra-${idGrad})"/>
  ${cuerpo}
</svg>`;
}

// ---------------------------------------------------------------------
// CELULAR
// ---------------------------------------------------------------------
function celularFrente(d, idGrad) {
  const claro = aclarar(d.color, 0.35);
  const oscuro = oscurecer(d.color, 0.35);
  return lienzo(idGrad, `
    <defs>
      <linearGradient id="borde-${idGrad}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${claro}"/>
        <stop offset="100%" stop-color="${oscuro}"/>
      </linearGradient>
      <linearGradient id="pantalla-${idGrad}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#151a2b"/>
        <stop offset="100%" stop-color="#05070d"/>
      </linearGradient>
      <linearGradient id="brillo-${idGrad}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="30%" stop-color="#ffffff" stop-opacity="0"/>
        <stop offset="48%" stop-color="#ffffff" stop-opacity="0.16"/>
        <stop offset="60%" stop-color="#ffffff" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <rect x="140" y="30" width="120" height="240" rx="26" fill="url(#borde-${idGrad})"/>
    <rect x="148" y="38" width="104" height="224" rx="19" fill="url(#pantalla-${idGrad})"/>
    <circle cx="200" cy="50" r="3.4" fill="#0a0e1a" opacity="0.55"/>
    <rect x="182" y="240" width="36" height="4" rx="2" fill="#ffffff" opacity="0.35"/>
    <rect x="148" y="38" width="104" height="224" rx="19" fill="url(#brillo-${idGrad})"/>
    <circle cx="222" cy="60" r="9" fill="#0a0e1a" opacity="0.5"/>
    <circle cx="222" cy="60" r="5" fill="#38bdf8" opacity="0.6"/>
  `);
}

function celularAngulo(d, idGrad) {
  const claro = aclarar(d.color, 0.3);
  const oscuro = oscurecer(d.color, 0.4);
  return lienzo(idGrad, `
    <defs>
      <linearGradient id="borde-${idGrad}" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="${oscuro}"/>
        <stop offset="55%" stop-color="${claro}"/>
        <stop offset="100%" stop-color="${oscuro}"/>
      </linearGradient>
      <linearGradient id="canto-${idGrad}" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="${oscurecer(d.color, 0.55)}"/>
        <stop offset="100%" stop-color="${oscurecer(d.color, 0.15)}"/>
      </linearGradient>
      <linearGradient id="pantalla-${idGrad}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#1b2236"/>
        <stop offset="100%" stop-color="#05070d"/>
      </linearGradient>
    </defs>
    <g transform="translate(150,150) rotate(-13) translate(-150,-150)">
      <rect x="90" y="20" width="118" height="236" rx="24" fill="url(#canto-${idGrad})"/>
      <rect x="86" y="20" width="112" height="236" rx="24" fill="url(#borde-${idGrad})"/>
      <rect x="94" y="28" width="96" height="220" rx="17" fill="url(#pantalla-${idGrad})"/>
      <rect x="94" y="28" width="30" height="220" rx="17" fill="#ffffff" opacity="0.08"/>
      <circle cx="142" cy="40" r="3" fill="#0a0e1a" opacity="0.5"/>
    </g>
  `);
}

function celularAtras(d, idGrad) {
  const claro = aclarar(d.color, 0.18);
  const oscuro = oscurecer(d.color, 0.3);
  return lienzo(idGrad, `
    <defs>
      <linearGradient id="cuerpo-${idGrad}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${claro}"/>
        <stop offset="55%" stop-color="${d.color}"/>
        <stop offset="100%" stop-color="${oscuro}"/>
      </linearGradient>
    </defs>
    <rect x="140" y="30" width="120" height="240" rx="26" fill="url(#cuerpo-${idGrad})"/>
    <rect x="150" y="45" width="60" height="60" rx="16" fill="#05070d" opacity="0.28"/>
    <circle cx="167" cy="62" r="10" fill="#05070d" opacity="0.55"/>
    <circle cx="167" cy="62" r="5.5" fill="#7dd3fc" opacity="0.5"/>
    <circle cx="193" cy="62" r="10" fill="#05070d" opacity="0.55"/>
    <circle cx="193" cy="62" r="5.5" fill="#7dd3fc" opacity="0.5"/>
    <circle cx="167" cy="88" r="10" fill="#05070d" opacity="0.55"/>
    <circle cx="167" cy="88" r="5.5" fill="#7dd3fc" opacity="0.5"/>
    <circle cx="200" cy="150" r="10" fill="#ffffff" opacity="0.14"/>
    <rect x="146" y="35" width="30" height="230" rx="20" fill="#ffffff" opacity="0.1"/>
  `);
}

// ---------------------------------------------------------------------
// PORTÁTIL
// ---------------------------------------------------------------------
function portatilFrente(d, idGrad) {
  const claro = aclarar(d.color, 0.3);
  const oscuro = oscurecer(d.color, 0.35);
  return lienzo(idGrad, `
    <defs>
      <linearGradient id="tapa-${idGrad}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${claro}"/>
        <stop offset="100%" stop-color="${oscuro}"/>
      </linearGradient>
      <linearGradient id="fondo-pantalla-${idGrad}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${aclarar(d.color, 0.15)}"/>
        <stop offset="100%" stop-color="${oscurecer(d.color, 0.45)}"/>
      </linearGradient>
      <linearGradient id="base-${idGrad}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${aclarar(d.color, 0.08)}"/>
        <stop offset="100%" stop-color="${oscurecer(d.color, 0.25)}"/>
      </linearGradient>
    </defs>
    <rect x="65" y="42" width="270" height="172" rx="10" fill="url(#tapa-${idGrad})"/>
    <rect x="77" y="54" width="246" height="148" rx="4" fill="url(#fondo-pantalla-${idGrad})"/>
    <rect x="77" y="54" width="246" height="20" fill="#ffffff" opacity="0.08"/>
    <circle cx="90" cy="63" r="3" fill="#ef4444" opacity="0.7"/>
    <circle cx="100" cy="63" r="3" fill="#f59e0b" opacity="0.7"/>
    <circle cx="110" cy="63" r="3" fill="#22c55e" opacity="0.7"/>
    <rect x="95" y="90" width="90" height="10" rx="3" fill="#ffffff" opacity="0.35"/>
    <rect x="95" y="108" width="140" height="8" rx="3" fill="#ffffff" opacity="0.2"/>
    <rect x="95" y="124" width="110" height="8" rx="3" fill="#ffffff" opacity="0.2"/>
    <path d="M55,214 L345,214 L365,246 L35,246 Z" fill="url(#base-${idGrad})"/>
    <rect x="150" y="230" width="100" height="6" rx="3" fill="#05070d" opacity="0.18"/>
  `);
}

function portatilAngulo(d, idGrad) {
  const claro = aclarar(d.color, 0.25);
  const oscuro = oscurecer(d.color, 0.4);
  return lienzo(idGrad, `
    <defs>
      <linearGradient id="tapa-${idGrad}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${claro}"/>
        <stop offset="100%" stop-color="${oscuro}"/>
      </linearGradient>
      <linearGradient id="pantalla-${idGrad}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${aclarar(d.color, 0.1)}"/>
        <stop offset="100%" stop-color="${oscurecer(d.color, 0.5)}"/>
      </linearGradient>
    </defs>
    <g transform="translate(200,150) rotate(-6) translate(-200,-150)">
      <path d="M70,60 L300,50 L320,190 L60,206 Z" fill="url(#tapa-${idGrad})"/>
      <path d="M84,68 L288,60 L302,178 L76,192 Z" fill="url(#pantalla-${idGrad})"/>
      <path d="M84,68 L140,64 L136,186 L76,192 Z" fill="#ffffff" opacity="0.1"/>
      <path d="M40,206 L330,192 L360,234 L15,250 Z" fill="${oscurecer(d.color, 0.2)}"/>
      <path d="M40,206 L330,192 L338,204 L48,218 Z" fill="#ffffff" opacity="0.12"/>
    </g>
  `);
}

function portatilAtras(d, idGrad) {
  const claro = aclarar(d.color, 0.22);
  const oscuro = oscurecer(d.color, 0.32);
  return lienzo(idGrad, `
    <defs>
      <linearGradient id="tapa-${idGrad}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${claro}"/>
        <stop offset="100%" stop-color="${oscuro}"/>
      </linearGradient>
    </defs>
    <path d="M60,50 L340,50 L352,222 L48,222 Z" fill="url(#tapa-${idGrad})"/>
    <circle cx="200" cy="130" r="16" fill="#ffffff" opacity="0.16"/>
    <circle cx="200" cy="130" r="6" fill="#ffffff" opacity="0.4"/>
    <rect x="60" y="50" width="280" height="26" fill="#ffffff" opacity="0.08"/>
    <path d="M40,222 L360,222 L372,248 L28,248 Z" fill="${oscurecer(d.color, 0.4)}"/>
  `);
}

const RENDER = {
  celular: { front: celularFrente, angle: celularAngulo, back: celularAtras },
  portatil: { front: portatilFrente, angle: portatilAngulo, back: portatilAtras },
};

let contador = 0;
for (const d of DISPOSITIVOS) {
  const render = RENDER[d.tipo];
  const vistas = [
    ['front', render.front],
    ['angle', render.angle],
    ['back', render.back],
  ];
  for (const [vista, fn] of vistas) {
    const idGrad = `${d.slug}-${vista}`;
    const svg = fn(d, idGrad);
    const nombreArchivo = vista === 'front' ? `${d.slug}.svg` : `${d.slug}-${vista}.svg`;
    fs.writeFileSync(path.join(outDir, nombreArchivo), svg, 'utf-8');
    contador += 1;
  }
}

console.log(`Generados ${contador} renders SVG (3 vistas x ${DISPOSITIVOS.length} dispositivos) en ${outDir}`);
