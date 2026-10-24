// Three.js hero scene. Falls back to the CSS rings if WebGL is missing or motion is reduced.
const canvas = document.getElementById('scene');
try {
  const ok = !matchMedia('(prefers-reduced-motion: reduce)').matches &&
    (document.createElement('canvas').getContext('webgl2') || document.createElement('canvas').getContext('webgl'));
  if (ok) {
    const T = await import('./vendor/three.module.min.js');
    const r = new T.WebGLRenderer({ canvas, alpha: true, antialias: true });
    r.setPixelRatio(Math.min(devicePixelRatio, 2));
    const scene = new T.Scene(), cam = new T.PerspectiveCamera(50, 1, .1, 100), g = new T.Group();
    cam.position.z = 8; scene.add(g);
    const wire = (geo, color, opacity) => new T.Mesh(geo, new T.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity }));
    const core = wire(new T.IcosahedronGeometry(1.5, 1), 0x5b8cff, .9);
    const knot = wire(new T.TorusKnotGeometry(2.5, .07, 140, 8), 0x9b6bff, .6);
    const ring = wire(new T.TorusGeometry(3.4, .02, 8, 100), 0x5b8cff, .5); ring.rotation.x = 1.2;
    g.add(core, knot, ring);
    const pos = new Float32Array(1200).map(() => (Math.random() - .5) * 18), pg = new T.BufferGeometry();
    pg.setAttribute('position', new T.BufferAttribute(pos, 3));
    scene.add(new T.Points(pg, new T.PointsMaterial({ size: .035, color: 0xaab8ff })));

    let mx = 0, my = 0, id = 0;
    const size = () => {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      r.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix();
      g.position.x = w > 900 ? 2.6 : 0; g.scale.setScalar(w > 900 ? 1 : .7);
    };
    addEventListener('resize', size); size();
    addEventListener('pointermove', e => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; });
    const loop = t => {
      core.rotation.set(t * 2e-4, t * 3e-4, 0); knot.rotation.y = -t * 2e-4; ring.rotation.z = t * 4e-4;
      g.rotation.y += (mx * .6 - g.rotation.y) * .05; g.rotation.x += (my * .4 - g.rotation.x) * .05;
      r.render(scene, cam); id = requestAnimationFrame(loop);
    };
    // Only render while the hero is on screen and the tab is visible
    let vis = true;
    const sync = () => { cancelAnimationFrame(id); if (vis && !document.hidden) id = requestAnimationFrame(loop); };
    new IntersectionObserver(([e]) => { vis = e.isIntersecting; sync(); }).observe(canvas);
    document.addEventListener('visibilitychange', sync);
    document.documentElement.classList.add('gl');
  }
} catch (err) { console.warn('3D scene unavailable, using CSS fallback.', err); }
