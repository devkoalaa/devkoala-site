import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import {
  createIcons, createElement, MapPin, ArrowDown, Terminal, Gauge, Map, Shield, Bot, MousePointer2, Gamepad2, Flame, ChartLine,
  Send, CalendarCheck, Video, BellRing, HeartHandshake, BrainCircuit, Github, X, Music, MessageCircle, Crosshair,
  ShoppingBag, Sparkles, ArrowUpRight, RefreshCw, Mail, Copy, Linkedin,
} from 'lucide';
import { createParticles } from './particles.js';
import { createTerminal } from './terminal.js';
import { RESOURCES } from './resources.js';

gsap.registerPlugin(ScrollTrigger);

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/* ---------------- content ---------------- */

const STACK = ['TypeScript', 'Next.js', 'NestJS', 'React Native', 'Three.js', 'Lua · FiveM', 'Prisma', 'Drizzle', 'SQL Server',
  'Postgres', 'Docker', 'Caddy', 'Keycloak', 'GitHub Actions', 'GitLab CI', 'Socket.IO', 'Blender', 'Claude Code · MCP'];

const CARDS = [
  { icon: 'music', title: 'Clodoaldo', desc: 'Bot de música para Discord, na pele de um pinguim muito mal-humorado. Fila, loop, rádios e um comando para xingar o amigo.', tags: 'Node · discord.js · Docker' },
  { icon: 'bot', title: 'Bot Automotiva', desc: 'Allowlist com formulário, tickets com transcrição e liberação de ID direto no banco do jogo.', tags: 'discord.js · MySQL' },
  { icon: 'gauge', title: 'Brasília Dyno', desc: 'Simulador de preparação de motor: escolha peças e veja a curva de potência e o limite do bloco em tempo real.', tags: 'Next.js · Tailwind', href: 'https://brasilia-dyno.vercel.app' },
  { icon: 'message-circle', title: 'Dialogus', desc: 'SaaS de mediação entre psicólogos e pacientes, com sessões, agenda, anotações privadas e assinatura.', tags: 'Turborepo · NestJS · Next.js', href: 'https://dialogus-api.vercel.app' },
  { icon: 'send', title: 'Bot do koala-server', desc: 'Opera o servidor pelo Telegram: status, logs, restart com confirmação e perguntas ao Claude Code em modo leitura.', tags: 'TypeScript · Docker · systemd' },
  { icon: 'shopping-bag', title: 'Visão de Rua', desc: 'Loja de streetwear com front e back próprios, feita para uma marca nascida no asfalto.', tags: 'Next.js · Node', href: 'https://visaoderua-front.vercel.app' },
  { icon: 'crosshair', title: 'CS2 Smokes Hub', desc: 'Catálogo de smokes do Counter-Strike 2 por mapa, com API própria.', tags: 'Next.js · API', href: 'https://cs2smokeshub.vercel.app' },
  { icon: 'sparkles', title: 'Este site', desc: 'Partículas em shader escrito à mão, scroll coreografado e um terminal de verdade. Aperte ⌘K.', tags: 'Vite · Three.js · GSAP' },
];

const PHRASES = ['sistemas de segurança pública', 'servidores de GTA RP', 'jogos que rodam no navegador', 'apps que eu mesmo uso', 'a infra que roda tudo isso'];

const CONTAINERS = [
  ['koala-fit', 'koala-fit:latest', 'Up 6 days'],
  ['favela-relay', 'favela-relay-relay', 'Up 4 days'],
  ['clodoaldo', 'clodoaldo:latest', 'Up 5 days'],
  ['koala-server-telegram-bot', 'koala-server-telegram-bot', 'Up 2 weeks'],
  ['uptime-kuma', 'louislam/uptime-kuma:2', 'Up 3 weeks'],
  ['beszel', 'henrygd/beszel:latest', 'Up 3 weeks'],
  ['beszel-agent', 'henrygd/beszel-agent', 'Up 3 weeks'],
  ['postgres', 'postgres:18-alpine', 'Up 3 weeks'],
];

/* ---------------- static DOM ---------------- */

$('#marquee').innerHTML = [...STACK, ...STACK].map((s) => `<span>${s}</span>`).join('');

$('#cards').innerHTML = CARDS.map((c) => {
  const tag = c.href ? 'a' : 'div';
  const attrs = c.href ? ` href="${c.href}" target="_blank" rel="noopener" data-cursor="abrir"` : '';
  return `<${tag} class="card" data-tilt${attrs}>
    <span class="card__icon"><i data-lucide="${c.icon}"></i></span>
    ${c.href ? '<i class="card__go" data-lucide="arrow-up-right"></i>' : ''}
    <h5>${c.title}</h5><p>${c.desc}</p><span class="card__tags mono">${c.tags}</span>
  </${tag}>`;
}).join('');

$('#resWall').innerHTML = RESOURCES.map((r) => `<span>automotiva_${r}</span>`).join('');
$('#year').textContent = new Date().getFullYear();

createIcons({
  icons: { MapPin, ArrowDown, Terminal, Gauge, Map, Shield, Bot, MousePointer2, Gamepad2, Flame, ChartLine, Send,
    CalendarCheck, Video, BellRing, HeartHandshake, BrainCircuit, Github, X, Music, MessageCircle, Crosshair,
    ShoppingBag, Sparkles, ArrowUpRight, RefreshCw, Mail, Copy, Linkedin },
});

// split text into chars / words
$$('.split').forEach((el) => {
  el.innerHTML = [...el.textContent].map((c) => (c === ' ' ? ' ' : `<span class="ch">${c}</span>`)).join('');
});
$$('.reveal-words').forEach((el) => {
  el.innerHTML = el.textContent.trim().split(/\s+/).map((w) => `<span class="w">${w}</span>`).join(' ');
});

/* ---------------- particles + smooth scroll ---------------- */

let particles = null;
try {
  particles = createParticles($('#gl'), { reduced });
} catch (err) {
  // no WebGL: the page still works, just without the background
  $('#gl').remove();
}

const lenis = reduced ? null : new Lenis({ duration: 1.15, smoothWheel: true });
if (lenis) {
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
const goTo = (target) => {
  if (lenis) lenis.scrollTo(target, { offset: -40, duration: 1.6 });
  else document.querySelector(target)?.scrollIntoView();
};
$$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
  e.preventDefault();
  goTo(a.getAttribute('href'));
}));

ScrollTrigger.create({
  start: 0, end: 'max',
  onUpdate: (self) => {
    gsap.set('.progress span', { scaleX: self.progress });
    particles?.setScroll(self.scroll());
  },
});

$$('[data-shape]').forEach((sec) => {
  const shape = Number(sec.dataset.shape);
  const colors = sec.dataset.accent.split(',');
  ScrollTrigger.create({
    trigger: sec, start: 'top 55%', end: 'bottom 45%',
    onToggle: (self) => self.isActive && particles?.setShape(shape, colors),
  });
});

/* ---------------- boot sequence ---------------- */

const BOOT_LINES = [
  'devkoala bios v6.0 · aarch64',
  'checando memória ............ 24576 MB <span class="ok">ok</span>',
  'montando /portfolio ......... <span class="ok">ok</span>',
  'iniciando caddy (tls auto) .. <span class="ok">ok</span>',
  'carregando automotiva_* ..... 242 resources <span class="ok">ok</span>',
  'compilando shaders .......... <span class="ok">ok</span>',
  'acordando o coala ........... <span class="ok">ok</span>',
];

function boot() {
  return new Promise((resolve) => {
    const el = $('#boot');
    if (reduced || sessionStorage.getItem('dk-booted')) {
      el.remove();
      resolve();
      return;
    }
    document.body.classList.add('is-booting');
    const log = $('#bootLog'), pct = $('#bootPct'), bar = $('#bootBar');
    const state = { p: 0 };
    BOOT_LINES.forEach((l, i) => setTimeout(() => { log.innerHTML += `${l}\n`; }, 120 + i * 190));
    gsap.to(state, {
      p: 100, duration: 1.7, ease: 'power2.inOut',
      onUpdate: () => {
        pct.textContent = String(Math.round(state.p)).padStart(3, '0');
        bar.style.width = `${state.p}%`;
      },
      onComplete: () => {
        sessionStorage.setItem('dk-booted', '1');
        gsap.to(el, {
          clipPath: 'inset(0 0 100% 0)', duration: 0.9, ease: 'expo.inOut', delay: 0.15,
          onStart: resolve,
          onComplete: () => { el.remove(); document.body.classList.remove('is-booting'); },
        });
      },
    });
  });
}

/* ---------------- hero ---------------- */

function heroIn() {
  particles?.assemble();
  if (reduced) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.from('.hero__title .ch', { yPercent: 110, rotate: 8, duration: 1.3, stagger: 0.035 })
    .from('.hero__role, .hero__foot, .hero__meta, .nav, .hero__scroll', { y: 24, opacity: 0, duration: 1, stagger: 0.08 }, '-=0.9');
}

function scramble(el, text) {
  const chars = '!<>-_\\/[]{}=+*^?#01';
  const from = el.textContent;
  const len = Math.max(from.length, text.length);
  const queue = Array.from({ length: len }, (_, i) => ({
    to: text[i] || '', start: Math.floor(Math.random() * 18), end: Math.floor(Math.random() * 18) + 18,
  }));
  let frame = 0;
  const step = () => {
    let out = '', done = 0;
    for (const q of queue) {
      if (frame >= q.end) { done++; out += q.to; }
      else if (frame >= q.start) out += chars[(Math.random() * chars.length) | 0];
      else out += from[queue.indexOf(q)] || '';
    }
    el.textContent = out;
    if (done < queue.length) { frame++; requestAnimationFrame(step); }
  };
  step();
}
if (!reduced) {
  let pi = 0;
  setInterval(() => {
    pi = (pi + 1) % PHRASES.length;
    scramble($('#scramble'), PHRASES[pi]);
  }, 3000);
}

/* ---------------- about ---------------- */

if (!reduced) {
  gsap.to('.reveal-words .w', {
    opacity: 1, stagger: 0.05, ease: 'none',
    scrollTrigger: { trigger: '.about__text', start: 'top 80%', end: 'bottom 45%', scrub: true },
  });
}
// anos de SSP-DF contados desde jul/2019, para o número não envelhecer
{
  const start = new Date(2019, 6, 1), now = new Date();
  $('#sspYears').dataset.count = Math.floor((now - start) / (365.25 * 24 * 3600 * 1000));
}
$$('[data-count]').forEach((el) => {
  const end = Number(el.dataset.count);
  const o = { v: 0 };
  ScrollTrigger.create({
    trigger: el, start: 'top 90%', once: true,
    onEnter: () => gsap.to(o, { v: end, duration: reduced ? 0 : 2, ease: 'power3.out', onUpdate: () => { el.textContent = Math.round(o.v); } }),
  });
});

// section headings + project blocks slide in
if (!reduced) {
  $$('.h2, .h3, .proj__desc, .feats li, .chips, .tl, .sspcard, .card, .infra__head .proj__kicker').forEach((el) => {
    gsap.from(el, { y: 40, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
  });
}

/* ---------------- automotiva: tachometer + resource wall ---------------- */

(() => {
  const ticks = $('#tachoTicks');
  let svg = '';
  for (let i = 0; i <= 40; i++) {
    const a = ((-135 + (270 * i) / 40) * Math.PI) / 180;
    const major = i % 5 === 0;
    const r1 = 118, r2 = major ? 104 : 110;
    const x = (r) => 150 + Math.sin(a) * r, y = (r) => 150 - Math.cos(a) * r;
    svg += `<line x1="${x(r1)}" y1="${y(r1)}" x2="${x(r2)}" y2="${y(r2)}" class="${i >= 34 ? 'red' : ''}"/>`;
    if (major) svg += `<text x="${x(90)}" y="${y(90)}">${i / 5}</text>`;
  }
  ticks.innerHTML = svg;

  const spans = $$('#resWall span');
  const order = spans.map((_, i) => i).sort(() => Math.random() - 0.5);
  const fill = $('#tachoFill'), needle = $('#tachoNeedle'), rpm = $('#tachoRpm'), count = $('#resCount'), tacho = $('.tacho');
  let lit = 0;
  const render = (p) => {
    fill.style.strokeDasharray = `${603 * p} 804`;
    needle.style.transform = `rotate(${-135 + 270 * p}deg)`;
    rpm.textContent = Math.round(p * 8000);
    count.textContent = Math.round(p * 242);
    tacho.classList.toggle('is-redline', p > 0.86);
    const target = Math.round(p * spans.length);
    while (lit < target) { const s = spans[order[lit++]]; s.classList.add('on', 'hot'); setTimeout(() => s.classList.remove('hot'), 500); }
    while (lit > target) spans[order[--lit]].classList.remove('on', 'hot');
  };
  render(0);
  ScrollTrigger.create({
    trigger: '#automotiva', start: 'top 70%', end: 'bottom 70%', scrub: reduced ? false : 0.6,
    onUpdate: (self) => render(Math.min(1, self.progress * 1.15)),
  });
  // a little shake on the redline
  if (!reduced) setInterval(() => {
    if (tacho.classList.contains('is-redline')) gsap.fromTo(needle, { x: -1.5 }, { x: 1.5, duration: 0.05, repeat: 3, yoyo: true });
  }, 400);
})();

/* ---------------- favela league ---------------- */

(() => {
  const stage = $('#bikeStage');
  const loadingEl = $('#bikeLoading');
  let viewer = null;
  ScrollTrigger.create({
    trigger: stage, start: 'top bottom+=300', once: true,
    onEnter: async () => {
      const { createBikeViewer, BIKES } = await import('./bike.js');
      viewer = createBikeViewer(stage, $('#bikeCanvas'), loadingEl);
      let idx = 0;
      viewer.show(BIKES[0].id);
      const sw = document.createElement('div');
      sw.className = 'fl__switch mono';
      sw.innerHTML = `<span class="fl__bikename">${BIKES[0].name}</span><button aria-label="Trocar de moto" data-cursor="trocar"></button>`;
      sw.querySelector('button').appendChild(createElement(RefreshCw));
      stage.appendChild(sw);
      sw.querySelector('button').addEventListener('click', (e) => {
        e.stopPropagation();
        idx = (idx + 1) % BIKES.length;
        sw.querySelector('.fl__bikename').textContent = BIKES[idx].name;
        viewer.show(BIKES[idx].id);
      });
      sw.querySelector('button').addEventListener('pointerdown', (e) => e.stopPropagation());
    },
  });

  const steps = $$('#pipeline li');
  ScrollTrigger.create({
    trigger: '#favela', start: 'top 60%', end: 'center 40%', scrub: true,
    onUpdate: (self) => steps.forEach((li, i) => li.classList.toggle('on', self.progress * steps.length > i)),
  });

  // demo key presses, and real ones light up too
  const keys = Object.fromEntries($$('.keys span').map((k) => [k.dataset.k, k]));
  const press = (k, ms = 180) => { keys[k]?.classList.add('down'); setTimeout(() => keys[k]?.classList.remove('down'), ms); };
  let favelaVisible = false;
  ScrollTrigger.create({ trigger: '#favela', start: 'top bottom', end: 'bottom top', onToggle: (s) => { favelaVisible = s.isActive; } });
  const demo = ['w', 'w', 'd', 'w', 'q', 'w', 'a', 's', 'w', 'q'];
  let di = 0;
  setInterval(() => { if (favelaVisible && !reduced) press(demo[di++ % demo.length], 260); }, 420);
  window.addEventListener('keydown', (e) => { if (!/input/i.test(document.activeElement.tagName)) press(e.key.toLowerCase()); });
})();

/* ---------------- koala fit ---------------- */

(() => {
  const line = $('#fitLine');
  const len = line.getTotalLength();
  gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
  const streak = { v: 0 };
  const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });
  tl.to(streak, { v: 23, duration: 1.6, onUpdate: () => { $('#streakNum').textContent = Math.round(streak.v); } })
    .to('#fitRing', { strokeDashoffset: 314 * 0.2, duration: 1.6 }, 0)
    .to(line, { strokeDashoffset: 0, duration: 1.8, ease: 'power2.inOut' }, 0.2)
    .to('#fitToast', { y: 0, opacity: 1, duration: 0.8, ease: 'back.out(1.6)' }, 1.6);
  ScrollTrigger.create({ trigger: '#fit', start: 'top 55%', once: true, onEnter: () => (reduced ? tl.progress(1) : tl.play()) });
})();

/* ---------------- infra topology ---------------- */

(() => {
  const NODES = [
    ['devkoala.xyz', 'este site'],
    ['fit.devkoala.xyz', 'koala-fit · next.js'],
    ['favelaleague', 'estático + relay ws'],
    ['status', 'uptime-kuma'],
    ['monitor', 'beszel'],
    ['clodoaldo', 'bot discord'],
    ['telegram-bot', 'alertas e ops'],
  ];
  const links = $('#topoLinks'), nodes = $('#topoNodes'), pk = $('#topoPackets');
  const node = (x, y, w, title, sub, core) => `
    <g class="node${core ? ' core' : ''}" transform="translate(${x},${y})">
      <rect width="${w}" height="40" rx="9"/>
      <circle class="led" cx="14" cy="20" r="3.5"/>
      <text x="26" y="${sub ? 14 : 20}">${title}</text>
      ${sub ? `<text class="s" x="26" y="29">${sub}</text>` : ''}
    </g>`;
  let html = node(10, 170, 118, 'internet', 'https', false) + node(190, 160, 150, 'caddy', 'tls automático', true);
  const paths = [];
  const addPath = (d) => {
    paths.push(d);
    links.insertAdjacentHTML('beforeend', `<path class="link" d="${d}"/>`);
  };
  addPath('M128,190 L190,180');
  NODES.forEach(([t, s], i) => {
    const y = 14 + i * 52;
    html += node(410, y, 220, t, s, false);
    addPath(`M340,180 C375,180 375,${y + 20} 410,${y + 20}`);
  });
  nodes.innerHTML = html;

  const pathEls = $$('#topoLinks path');
  const packets = [];
  const spawn = () => {
    const target = 1 + ((Math.random() * NODES.length) | 0);
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('r', '3');
    c.setAttribute('class', 'pkt');
    pk.appendChild(c);
    packets.push({ el: c, seg: [pathEls[0], pathEls[target]], t: 0, speed: 0.012 + Math.random() * 0.01 });
  };
  let on = false;
  ScrollTrigger.create({ trigger: '#infra', start: 'top bottom', end: 'bottom top', onToggle: (s) => { on = s.isActive; } });
  let last = 0;
  const loop = (now) => {
    requestAnimationFrame(loop);
    if (!on || reduced) return;
    if (now - last > 260) { spawn(); last = now; }
    for (let i = packets.length - 1; i >= 0; i--) {
      const p = packets[i];
      p.t += p.speed;
      const segIdx = p.t < 1 ? 0 : 1;
      const local = segIdx === 0 ? p.t : p.t - 1;
      if (p.t >= 2) { p.el.remove(); packets.splice(i, 1); continue; }
      const path = p.seg[segIdx];
      const pt = path.getPointAtLength(path.getTotalLength() * local);
      p.el.setAttribute('cx', pt.x);
      p.el.setAttribute('cy', pt.y);
    }
  };
  requestAnimationFrame(loop);

  // docker ps typed out once
  const pre = $('#dockerPs');
  const pad = (s, n) => s.padEnd(n).slice(0, n);
  const lines = [
    '<span class="g">ubuntu@koala-server</span>:<span class="c">~</span>$ docker ps --format "table {{.Names}}\\t{{.Status}}"',
    '<span class="d">NAMES                       STATUS</span>',
    ...CONTAINERS.map(([n, , st]) => `${pad(n, 28)}<span class="g">${st}</span>`),
    '',
    '<span class="g">ubuntu@koala-server</span>:<span class="c">~</span>$ uname -m',
    'aarch64',
    '<span class="g">ubuntu@koala-server</span>:<span class="c">~</span>$ <span class="caret">▍</span>',
  ];
  ScrollTrigger.create({
    trigger: pre, start: 'top 85%', once: true,
    onEnter: () => lines.forEach((l, i) => setTimeout(() => { pre.innerHTML += `${l}\n`; }, reduced ? 0 : i * 140)),
  });
})();

/* ---------------- ssp timeline ---------------- */

(() => {
  const items = $$('.tl');
  gsap.to('#tlFill', {
    scaleX: 1, ease: 'none',
    scrollTrigger: {
      trigger: '.timeline', start: 'top 75%', end: 'bottom 55%', scrub: true,
      onUpdate: (s) => items.forEach((el, i) => el.classList.toggle('on', s.progress >= i / items.length)),
    },
  });
})();

/* ---------------- cursor, magnetic, tilt ---------------- */

if (finePointer && !reduced) {
  document.body.classList.add('has-cursor');
  const cur = $('.cursor'), dot = $('.cursor__dot'), ring = $('.cursor__ring'), label = $('.cursor__label');
  const pos = { x: innerWidth / 2, y: innerHeight / 2 }, rp = { ...pos };
  window.addEventListener('pointermove', (e) => { pos.x = e.clientX; pos.y = e.clientY; }, { passive: true });
  gsap.ticker.add(() => {
    rp.x += (pos.x - rp.x) * 0.18;
    rp.y += (pos.y - rp.y) * 0.18;
    dot.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%)`;
    ring.style.transform = `translate(${rp.x}px, ${rp.y}px) translate(-50%, -50%)`;
    label.style.transform = `translate(${rp.x}px, ${rp.y}px) translate(-50%, -50%)`;
  });
  document.addEventListener('pointerover', (e) => {
    const t = e.target.closest('a, button, [data-cursor]');
    cur.classList.toggle('is-hover', !!t);
    const txt = t?.dataset.cursor || '';
    label.textContent = txt;
    cur.classList.toggle('has-label', !!txt);
  });

  $$('[data-magnetic]').forEach((el) => {
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - r.left - r.width / 2) * 0.35);
      yTo((e.clientY - r.top - r.height / 2) * 0.35);
    });
    el.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
  });

  $$('[data-tilt]').forEach((el) => {
    const max = el.classList.contains('phone') ? 10 : 7;
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      el.style.setProperty('--mx', `${px * 100}%`);
      el.style.setProperty('--my', `${py * 100}%`);
      gsap.to(el, { rotateY: (px - 0.5) * max * 2, rotateX: -(py - 0.5) * max * 2, transformPerspective: 900, duration: 0.5, ease: 'power2.out' });
    });
    el.addEventListener('pointerleave', () => gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)' }));
  });
}

/* ---------------- terminal, toast, konami, clock ---------------- */

const toastEl = $('#toast');
let toastTimer;
const toast = (msg) => {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2600);
};

const term = createTerminal({
  goTo,
  onTurbo: () => particles?.toggleTurbo() ?? false,
  onBurst: () => { particles?.burst(); goTo('#top'); },
});
$('#openTerm').addEventListener('click', term.open);
$('#copyMail').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText('herberticleber@gmail.com');
    toast('email copiado. fico no aguardo.');
  } catch {
    toast('herberticleber@gmail.com');
  }
});
$$('[data-open-term]').forEach((b) => b.addEventListener('click', term.open));

const KONAMI = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];
let kIdx = 0;
window.addEventListener('keydown', (e) => {
  kIdx = e.key.toLowerCase() === KONAMI[kIdx] ? kIdx + 1 : e.key.toLowerCase() === KONAMI[0] ? 1 : 0;
  if (kIdx === KONAMI.length) {
    kIdx = 0;
    const on = particles?.toggleTurbo();
    particles?.burst();
    toast(on ? 'modo turbo ligado. respeito.' : 'modo turbo desligado.');
  }
});

const clock = $('#clock');
const fmt = new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit', second: '2-digit' });
const tickClock = () => { clock.textContent = `Brasília · ${fmt.format(new Date())} · GMT-3`; };
tickClock();
setInterval(tickClock, 1000);

console.log('%cdevkoala', 'font: 700 28px "Space Grotesk", sans-serif; color: #7cffc4');
console.log('curioso, hein? abre o terminal com ⌘K e digita "coala".');

/* ---------------- go ---------------- */

boot().then(heroIn);
window.addEventListener('load', () => ScrollTrigger.refresh());
