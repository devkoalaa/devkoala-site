import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export const BIKES = [
  { id: 'hcbr17', name: 'CBRonca 1000' },
  { id: 'crf450', name: 'CRFavela 450' },
  { id: '7galo_ph', name: 'Sete Galo 750' },
];

// 3D viewer for the Favela League bikes. Drag to spin, idles with a slow turn.
export function createBikeViewer(stage, canvas, loadingEl) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 0.35, 5);

  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(3, 4, 3);
  const rim = new THREE.DirectionalLight(0xc6ff3d, 3);
  rim.position.set(-4, 2, -3);
  scene.add(key, rim, new THREE.AmbientLight(0xffffff, 0.3));

  const pivot = new THREE.Group();
  scene.add(pivot);

  // glowing floor disc
  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(1.6, 64),
    new THREE.MeshBasicMaterial({ color: 0xc6ff3d, transparent: true, opacity: 0.08 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.62;
  scene.add(floor);

  const draco = new DRACOLoader().setDecoderPath('/draco/').setDecoderConfig({ type: 'wasm' });
  const loader = new GLTFLoader().setDRACOLoader(draco);
  const cache = new Map();

  const load = (id) => {
    if (!cache.has(id)) {
      cache.set(id, new Promise((res, rej) => loader.load(`/models/${id}.glb`, (g) => res(g.scene), undefined, rej)));
    }
    return cache.get(id);
  };

  let current = null;
  const show = async (id) => {
    loadingEl.hidden = false;
    try {
      const model = (await load(id)).clone();
      // normalise size and center on the floor
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const s = 2.3 / Math.max(size.x, size.y, size.z);
      model.scale.setScalar(s);
      box.setFromObject(model);
      const c = box.getCenter(new THREE.Vector3());
      model.position.sub(c);
      model.position.y += (box.max.y - box.min.y) / 2 - 0.62;
      if (current) pivot.remove(current);
      current = model;
      pivot.add(model);
      pivot.scale.setScalar(0.001);
      popT = 0;
    } catch {
      loadingEl.textContent = 'não deu pra carregar a moto';
      return;
    }
    loadingEl.hidden = true;
  };

  // interaction
  let rotY = 0.6, vel = 0.004, dragging = false, lastX = 0, popT = 1;
  stage.addEventListener('pointerdown', (e) => {
    dragging = true; lastX = e.clientX; stage.setPointerCapture(e.pointerId);
  });
  stage.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    lastX = e.clientX;
    vel = dx * 0.006;
    rotY += vel;
  });
  const end = () => { dragging = false; };
  stage.addEventListener('pointerup', end);
  stage.addEventListener('pointercancel', end);

  const resize = () => {
    const { width, height } = stage.getBoundingClientRect();
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };
  new ResizeObserver(resize).observe(stage);

  let visible = false;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { rootMargin: '100px' }).observe(stage);

  const clock = new THREE.Clock();
  const tick = () => {
    requestAnimationFrame(tick);
    if (!visible) return;
    const t = clock.getElapsedTime();
    if (!dragging) {
      vel += (0.004 - vel) * 0.03;
      rotY += vel;
    }
    pivot.rotation.y = rotY;
    pivot.position.y = Math.sin(t * 1.4) * 0.03;
    if (popT < 1) {
      popT = Math.min(1, popT + 0.035);
      const k = 1 - Math.pow(1 - popT, 3);
      pivot.scale.setScalar(0.001 + k * (1 + Math.sin(popT * Math.PI) * 0.08));
    }
    renderer.render(scene, camera);
  };
  tick();

  return { show };
}
