import * as THREE from 'three';
import gsap from 'gsap';

const SHAPES = 7;
const rand = (a = 1, b) => (b === undefined ? Math.random() * a : a + Math.random() * (b - a));

// ---- shape generators: each returns Float32Array(n * 3) ----

function koala(n, mobile) {
  // Head, ears, nose and empty eyes. The head bulges in z so it reads as 3D when the mouse pushes it.
  const out = new Float32Array(n * 3);
  const s = mobile ? 0.56 : 1;
  const ox = mobile ? 0 : 2.5;
  const oy = mobile ? 1.15 : 0.35;
  const eyes = [[-0.62, 0.22], [0.62, 0.22]];
  const inCircle = (x, y, cx, cy, r) => (x - cx) ** 2 + (y - cy) ** 2 < r * r;
  let i = 0;
  while (i < n) {
    const pick = Math.random();
    let x, y, z;
    if (pick < 0.5) {
      // head
      const a = rand(Math.PI * 2), r = 1.5 * Math.sqrt(Math.random()) * (Math.random() < 0.18 ? 1 : 0.985);
      x = Math.cos(a) * r; y = Math.sin(a) * r * 0.94;
      if (eyes.some(([ex, ey]) => inCircle(x, y, ex, ey, 0.2))) continue;
      if (inCircle(x, y, 0, -0.3, 0.5)) continue;
      z = Math.sqrt(Math.max(0, 2.25 - x * x - y * y)) * 0.4;
    } else if (pick < 0.78) {
      // ears (denser rim, hollow-ish center)
      const side = Math.random() < 0.5 ? -1 : 1;
      const a = rand(Math.PI * 2);
      const rr = Math.random() < 0.55 ? rand(0.6, 0.8) : Math.sqrt(Math.random()) * 0.42;
      x = side * 1.45 + Math.cos(a) * rr; y = 1.08 + Math.sin(a) * rr;
      if (inCircle(x, y, 0, 0, 1.38)) continue;
      z = rand(-0.08, 0.08);
    } else if (pick < 0.94) {
      // nose
      const a = rand(Math.PI * 2), r = Math.sqrt(Math.random());
      x = Math.cos(a) * 0.44 * r; y = -0.3 + Math.sin(a) * 0.62 * r;
      z = 0.75 + Math.sqrt(Math.max(0, 1 - r * r)) * 0.25;
    } else {
      // eye rims
      const [ex, ey] = eyes[Math.random() < 0.5 ? 0 : 1];
      const a = rand(Math.PI * 2);
      x = ex + Math.cos(a) * 0.24; y = ey + Math.sin(a) * 0.24; z = 0.55;
    }
    out[i * 3] = x * s + ox; out[i * 3 + 1] = y * s + oy; out[i * 3 + 2] = z * s;
    i++;
  }
  return out;
}

function sphere(n, r = 2.1) {
  const out = new Float32Array(n * 3);
  const g = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2, rad = Math.sqrt(1 - y * y), t = g * i;
    const k = r * (1 + rand(-0.015, 0.015));
    out.set([Math.cos(t) * rad * k, y * k, Math.sin(t) * rad * k], i * 3);
  }
  return out;
}

function torus(n) {
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const u = rand(Math.PI * 2), v = rand(Math.PI * 2);
    const R = 2.3, r = Math.random() < 0.7 ? 0.1 : 0.42 * Math.sqrt(Math.random());
    let x = (R + r * Math.cos(v)) * Math.cos(u), y = (R + r * Math.cos(v)) * Math.sin(u), z = r * Math.sin(v);
    // tilt it like a gauge seen at an angle
    const a = -1.05, cy = Math.cos(a), sy = Math.sin(a);
    out.set([x, y * cy - z * sy, y * sy + z * cy], i * 3);
  }
  return out;
}

function terrain(n) {
  const out = new Float32Array(n * 3);
  const cols = Math.round(Math.sqrt(n * 1.6)), rows = Math.ceil(n / cols);
  for (let i = 0; i < n; i++) {
    const cx = i % cols, cz = Math.floor(i / cols);
    out.set([(cx / cols - 0.5) * 14, -1.6, (cz / rows - 0.5) * 9 - 1], i * 3);
  }
  return out;
}

function lattice(n) {
  // 3x3x3 node grid with particles along the edges, like racks wired together
  const out = new Float32Array(n * 3);
  const step = 1.25, nodes = [-1, 0, 1];
  for (let i = 0; i < n; i++) {
    const a = nodes[(Math.random() * 3) | 0] * step, b = nodes[(Math.random() * 3) | 0] * step;
    const t = rand(-step, step), axis = (Math.random() * 3) | 0;
    let p = axis === 0 ? [t, a, b] : axis === 1 ? [a, t, b] : [a, b, t];
    if (Math.random() < 0.25) {
      // dense node cores
      const q = [nodes[(Math.random() * 3) | 0], nodes[(Math.random() * 3) | 0], nodes[(Math.random() * 3) | 0]];
      p = q.map((v) => v * step + rand(-0.09, 0.09));
    }
    out.set(p, i * 3);
  }
  return out;
}

function globe(n) {
  // lat/long wireframe globe
  const out = new Float32Array(n * 3);
  const r = 2.2;
  for (let i = 0; i < n; i++) {
    let lat, lon;
    if (Math.random() < 0.5) { lat = (Math.round(rand(-6, 6)) / 6) * (Math.PI / 2) * 0.92; lon = rand(Math.PI * 2); }
    else { lon = (Math.round(rand(0, 18)) / 18) * Math.PI * 2; lat = rand(-Math.PI / 2, Math.PI / 2); }
    out.set([Math.cos(lat) * Math.cos(lon) * r, Math.sin(lat) * r, Math.cos(lat) * Math.sin(lon) * r], i * 3);
  }
  return out;
}

function galaxy(n) {
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const arm = (i % 3) * ((Math.PI * 2) / 3);
    const r = Math.pow(Math.random(), 1.6) * 4.6;
    const a = arm + r * 1.15 + rand(-0.3, 0.3) * (1 - r / 6);
    const spread = 0.22 * (1 - r / 5) + 0.05;
    out.set([Math.cos(a) * r + rand(-spread, spread), rand(-spread, spread) * 0.7, Math.sin(a) * r + rand(-spread, spread)], i * 3);
  }
  return out;
}

const vert = /* glsl */ `
  attribute vec3 aP1; attribute vec3 aP2; attribute vec3 aP3; attribute vec3 aP4; attribute vec3 aP5; attribute vec3 aP6;
  attribute vec4 aRand;
  uniform float uW[${SHAPES}];
  uniform float uTime; uniform float uScatter; uniform float uSize; uniform float uPR; uniform float uScroll;
  uniform vec3 uMouse; uniform float uMouseStr;
  uniform vec3 uColA; uniform vec3 uColB; uniform float uTurbo;
  varying vec3 vCol; varying float vGlow;

  vec3 rotY(vec3 p, float a) { float c = cos(a), s = sin(a); return vec3(c*p.x + s*p.z, p.y, -s*p.x + c*p.z); }
  vec3 rotX(vec3 p, float a) { float c = cos(a), s = sin(a); return vec3(p.x, c*p.y - s*p.z, s*p.y + c*p.z); }
  vec3 hsv(float h) { return clamp(abs(mod(h*6.0 + vec3(0.,4.,2.), 6.) - 3.) - 1., 0., 1.); }

  void main() {
    float t = uTime;
    vec3 p = position * uW[0];
    p += rotY(aP1, t*0.12 + uScroll) * uW[1];
    p += rotY(aP2, t*0.08) * uW[2];
    vec3 w = aP3; w.y += sin(w.x*0.9 + t*1.1) * 0.35 + cos(w.z*1.3 + t*0.8) * 0.25;
    p += w * uW[3];
    p += rotX(rotY(aP4, t*0.15 + uScroll), 0.45) * uW[4];
    p += rotX(rotY(aP5, t*0.1 + uScroll), 0.35) * uW[5];
    p += rotX(rotY(aP6, t*0.05), 0.6) * uW[6];

    vec3 jitter = vec3(sin(t*0.7 + aRand.x*6.28), cos(t*0.6 + aRand.y*6.28), sin(t*0.5 + aRand.z*6.28));
    p += jitter * 0.025;
    p += (aRand.xyz - 0.5) * uScatter * 16.0;

    vec4 world = modelMatrix * vec4(p, 1.0);
    vec2 d = world.xy - uMouse.xy;
    float l = length(d);
    // gentle push: quadratic falloff so particles part softly instead of piling up on a rim
    float k = clamp(1.0 - l / 0.85, 0.0, 1.0);
    float f = k * k * uMouseStr;
    world.xy += normalize(d + 1e-4) * f * 0.32;
    world.z += f * 0.45;

    vec4 mv = viewMatrix * world;
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uPR * (0.45 + aRand.w * 0.9) * (1.0 + f * 0.6) / -mv.z;

    vec3 base = mix(uColA, uColB, smoothstep(0.15, 0.85, aRand.w));
    vCol = mix(base, hsv(aRand.w + t*0.2), uTurbo);
    vGlow = f;
  }
`;

const frag = /* glsl */ `
  uniform float uAlpha;
  varying vec3 vCol; varying float vGlow;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(vCol + vGlow * 0.25, a * uAlpha);
  }
`;

export function createParticles(canvas, { reduced = false } = {}) {
  const mobile = window.matchMedia('(max-width: 760px)').matches;
  const N = mobile ? 7000 : 16000;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'high-performance' });
  renderer.setClearColor(0x06070b, 1);
  const pr = Math.min(window.devicePixelRatio, 2);
  renderer.setPixelRatio(pr);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 8);

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(koala(N, mobile), 3));
  const gens = [sphere, torus, terrain, lattice, globe, galaxy];
  gens.forEach((g, i) => geo.setAttribute(`aP${i + 1}`, new THREE.BufferAttribute(g(N), 3)));
  const r = new Float32Array(N * 4);
  for (let i = 0; i < N * 4; i++) r[i] = Math.random();
  geo.setAttribute('aRand', new THREE.BufferAttribute(r, 4));

  const uniforms = {
    uW: { value: [1, 0, 0, 0, 0, 0, 0] },
    uTime: { value: 0 },
    uScatter: { value: reduced ? 0 : 1 },
    uSize: { value: mobile ? 34 : 30 },
    uPR: { value: pr },
    uScroll: { value: 0 },
    uMouse: { value: new THREE.Vector3(99, 99, 0) },
    uMouseStr: { value: 0 },
    uColA: { value: new THREE.Color('#7cffc4') },
    uColB: { value: new THREE.Color('#8b7bff') },
    uAlpha: { value: 0.9 },
    uTurbo: { value: 0 },
  };
  const mat = new THREE.ShaderMaterial({
    vertexShader: vert, fragmentShader: frag, uniforms,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  });
  const points = new THREE.Points(geo, mat);
  points.frustumCulled = false;
  scene.add(points);

  // mouse → world position on the z=0 plane
  const mouse = { x: 0, y: 0, tx: 99, ty: 99, active: false };
  let halfH = 1, halfW = 1;
  const resize = () => {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
    halfW = halfH * camera.aspect;
  };
  resize();
  window.addEventListener('resize', resize);
  window.addEventListener('pointermove', (e) => {
    mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.ty = -(e.clientY / window.innerHeight) * 2 + 1;
    mouse.active = true;
  }, { passive: true });
  document.addEventListener('pointerleave', () => { mouse.active = false; });

  const weights = { w0: 1, w1: 0, w2: 0, w3: 0, w4: 0, w5: 0, w6: 0 };
  let current = 0;
  const setShape = (idx, colors) => {
    if (idx !== current) {
      current = idx;
      const target = {};
      for (let i = 0; i < SHAPES; i++) target[`w${i}`] = i === idx ? 1 : 0;
      gsap.to(weights, { ...target, duration: reduced ? 0 : 1.6, ease: 'power3.inOut', overwrite: true });
      // a little burst while morphing
      if (!reduced) gsap.fromTo(uniforms.uScatter, { value: 0.04 }, { value: 0, duration: 1.4, ease: 'power2.out' });
      gsap.to(uniforms.uAlpha, { value: idx === 0 ? 0.9 : 0.62, duration: 1.2 });
    }
    if (colors) {
      const [a, b] = colors;
      const ca = new THREE.Color(a), cb = new THREE.Color(b);
      gsap.to(uniforms.uColA.value, { r: ca.r, g: ca.g, b: ca.b, duration: 1.2 });
      gsap.to(uniforms.uColB.value, { r: cb.r, g: cb.g, b: cb.b, duration: 1.2 });
    }
  };

  const clock = new THREE.Clock();
  let running = true;
  let scrollY = 0;
  const tick = () => {
    if (!running) return;
    const t = clock.getElapsedTime();
    uniforms.uTime.value = reduced ? 0 : t;
    for (let i = 0; i < SHAPES; i++) uniforms.uW.value[i] = weights[`w${i}`];

    mouse.x += ((mouse.active ? mouse.tx : mouse.x) - mouse.x) * 0.12;
    mouse.y += ((mouse.active ? mouse.ty : mouse.y) - mouse.y) * 0.12;
    uniforms.uMouse.value.set(mouse.x * halfW, mouse.y * halfH, 0);
    uniforms.uMouseStr.value += ((mouse.active && !reduced ? 1 : 0) - uniforms.uMouseStr.value) * 0.06;

    uniforms.uScroll.value = scrollY * 0.0004;
    camera.position.x += (mouse.x * 0.35 - camera.position.x) * 0.04;
    camera.position.y += (mouse.y * 0.25 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  document.addEventListener('visibilitychange', () => {
    const was = running;
    running = !document.hidden;
    if (running && !was) requestAnimationFrame(tick);
  });

  return {
    setShape,
    setScroll: (y) => { scrollY = y; },
    assemble: () => gsap.to(uniforms.uScatter, { value: 0, duration: 2.4, ease: 'expo.out' }),
    burst: () => gsap.fromTo(uniforms.uScatter, { value: 0.35 }, { value: 0, duration: 2.2, ease: 'expo.out' }),
    toggleTurbo: () => {
      const on = uniforms.uTurbo.value < 0.5;
      gsap.to(uniforms.uTurbo, { value: on ? 1 : 0, duration: 0.8 });
      return on;
    },
  };
}
