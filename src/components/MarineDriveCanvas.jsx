import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// ─── Geometry helpers ────────────────────────────────────────────────────────

/** Road ribbon geometry that follows `curve` with the given `width`. */
function buildRibbonGeometry(curve, width, segments = 220) {
  const positions = [];
  const uvs = [];
  const indices = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const pt  = curve.getPoint(t);
    const tan = curve.getTangent(t);
    // right = perpendicular to tangent in the XZ plane
    const right = new THREE.Vector3(-tan.z, 0, tan.x).normalize();
    const L = pt.clone().addScaledVector(right,  width / 2);
    const R = pt.clone().addScaledVector(right, -width / 2);
    positions.push(L.x, L.y, L.z,  R.x, R.y, R.z);
    uvs.push(0, t,  1, t);
    if (i < segments) {
      const b = i * 2;
      indices.push(b, b + 2, b + 1,  b + 1, b + 2, b + 3);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv',       new THREE.Float32BufferAttribute(uvs,       2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

/** Radial gradient sprite/glow texture (canvas). */
function makeGlow(innerRGBA, size = 128) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  const mid = size / 2;
  const g = ctx.createRadialGradient(mid, mid, 0, mid, mid, mid);
  g.addColorStop(0,    innerRGBA);
  g.addColorStop(0.30, innerRGBA.replace(/[\d.]+\)$/, '0.30)'));
  g.addColorStop(1,    'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(c);
}

/** Sky dome texture — vertical gradient from zenith to horizon. */
function makeSkyTexture() {
  const c = document.createElement('canvas');
  c.width = 2; c.height = 512;
  const ctx = c.getContext('2d');
  const g = ctx.createLinearGradient(0, 0, 0, 512);
  g.addColorStop(0.00, '#04020e'); // zenith — deep space
  g.addColorStop(0.30, '#0a0520'); // upper sky
  g.addColorStop(0.65, '#120830'); // mid sky
  g.addColorStop(0.85, '#1a0d3e'); // near horizon — city purple
  g.addColorStop(1.00, '#220e3a'); // horizon glow
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 2, 512);
  return new THREE.CanvasTexture(c);
}

/** Building window texture (lit / unlit squares). */
function makeBuildingTex(seed = 0) {
  const W = 128, H = 256;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#060510';
  ctx.fillRect(0, 0, W, H);
  const COLS = 5, ROWS = 10;
  const cw = (W - 10) / COLS, ch = (H - 10) / ROWS;
  let s = seed * 9301 + 49297;
  const rng = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  for (let r = 0; r < ROWS; r++) {
    for (let cc = 0; cc < COLS; cc++) {
      if (rng() > 0.30) {
        const warm = rng() > 0.45;
        const br = Math.floor(rng() * 35);
        ctx.fillStyle = warm
          ? `rgb(${205 + br},${160 + br},${90 + br})`
          : `rgb(${130 + br},${165 + br},${215})`;
        ctx.fillRect(5 + cc * cw + 1, 5 + r * ch + 1, cw - 3, ch - 4);
      }
    }
  }
  return new THREE.CanvasTexture(c);
}

// ─── Sea wave texture ─────────────────────────────────────────────────────────

function makeSeaTexture() {
  const c = document.createElement('canvas');
  c.width = 256; c.height = 256;
  const ctx = c.getContext('2d');
  const g = ctx.createLinearGradient(0, 0, 256, 256);
  g.addColorStop(0, '#030b18');
  g.addColorStop(0.5, '#040d1e');
  g.addColorStop(1, '#030a15');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  // faint ripple lines
  ctx.strokeStyle = 'rgba(20,50,90,0.18)';
  ctx.lineWidth = 1;
  for (let y = 8; y < 256; y += 14) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x <= 256; x += 16) {
      ctx.lineTo(x, y + Math.sin(x * 0.12) * 2.5);
    }
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(12, 40);
  return tex;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function MarineDriveCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    // ── Renderer ──────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // ── Scene ─────────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2('#0a0420', 0.0048);

    // ── Camera ────────────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(68, window.innerWidth / window.innerHeight, 0.1, 700);

    // ── Sky dome ──────────────────────────────────────────────
    const skyGeo = new THREE.SphereGeometry(550, 24, 12);
    skyGeo.scale(-1, 1, 1); // flip inward
    scene.add(new THREE.Mesh(skyGeo, new THREE.MeshBasicMaterial({ map: makeSkyTexture() })));

    // ── Marine Drive road curve ───────────────────────────────
    // Sea on LEFT (negative X), buildings on RIGHT (positive X).
    // Road curves leftward (like real Marine Drive going north).
    const roadCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(  0,    0,  50),  // start (camera t=0 here)
      new THREE.Vector3(  0,    0,  25),
      new THREE.Vector3( -0.5,  0,   0),
      new THREE.Vector3( -2,    0, -30),
      new THREE.Vector3( -5,    0, -68),
      new THREE.Vector3(-10,    0,-115),
      new THREE.Vector3(-16,    0,-168),
      new THREE.Vector3(-21,    0,-228),
      new THREE.Vector3(-24.5,  0,-294),
      new THREE.Vector3(-25.5,  0,-364),
      new THREE.Vector3(-24,    0,-434),
      new THREE.Vector3(-20,    0,-500),
    ], false, 'catmullrom', 0.5);

    // ── Road surface ──────────────────────────────────────────
    // Center divider (yellow)
    const divMesh = new THREE.Mesh(
      buildRibbonGeometry(roadCurve, 0.22, 240),
      new THREE.MeshBasicMaterial({ color: '#d4960a', transparent: true, opacity: 0.7 }),
    );
    divMesh.position.y = 0.03;
    scene.add(divMesh);

    // Road surface
    scene.add(new THREE.Mesh(
      buildRibbonGeometry(roadCurve, 14, 240),
      new THREE.MeshBasicMaterial({ color: '#0c0c14' }),
    ));

    // Sidewalk / promenade (wider, slightly lower)
    const swMesh = new THREE.Mesh(
      buildRibbonGeometry(roadCurve, 22, 240),
      new THREE.MeshBasicMaterial({ color: '#111118' }),
    );
    swMesh.position.y = -0.03;
    scene.add(swMesh);

    // Ground fill (behind everything)
    const groundGeo = new THREE.PlaneGeometry(600, 700);
    groundGeo.rotateX(-Math.PI / 2);
    scene.add(new THREE.Mesh(groundGeo, new THREE.MeshBasicMaterial({ color: '#08060f' })));

    // ── Sea ───────────────────────────────────────────────────
    // Sea is to the LEFT (negative X from road center).
    // The road left edge at t=0 is at x = -7. Sea starts at x = -8.
    // Sea plane: center at x=-168 (spans x=-8 to x=-328), z=-220.
    const seaGeo = new THREE.PlaneGeometry(320, 640, 1, 1);
    seaGeo.rotateX(-Math.PI / 2);
    const seaMesh = new THREE.Mesh(seaGeo, new THREE.MeshBasicMaterial({
      map: makeSeaTexture(),
      color: '#040c18',
    }));
    seaMesh.position.set(-168, -0.05, -195);
    scene.add(seaMesh);

    // Sea shimmer — a narrow strip close to the road (visible in peripheral)
    const shimGeo = new THREE.PlaneGeometry(30, 600);
    shimGeo.rotateX(-Math.PI / 2);
    const shimMat = new THREE.MeshBasicMaterial({ color: '#0d2848', transparent: true, opacity: 0.25 });
    const shimMesh = new THREE.Mesh(shimGeo, shimMat);
    shimMesh.position.set(-22, 0.02, -200);
    scene.add(shimMesh);

    // Concrete seawall / promenade edge on the sea side
    const wallGeo = buildRibbonGeometry(roadCurve, 1.5, 240);
    const wallMesh = new THREE.Mesh(wallGeo, new THREE.MeshBasicMaterial({ color: '#0e0e18' }));
    // offset to left edge of sidewalk (-11 from center) — approximate
    wallMesh.position.set(-11, 0.05, 0);
    scene.add(wallMesh);

    // ── Street lights (the Queen's Necklace) ──────────────────
    const glowTex  = makeGlow('rgba(255,195,68,1)',  128);
    const glowTex2 = makeGlow('rgba(255,185,50,0.6)', 64);
    const poleMat  = new THREE.MeshBasicMaterial({ color: '#1a1828' });
    const bulbMat  = new THREE.MeshBasicMaterial({ color: '#ffe070' });
    const poleGeo  = new THREE.CylinderGeometry(0.04, 0.07, 5.5, 5);
    const bulbGeo  = new THREE.SphereGeometry(0.20, 7, 7);

    const flickerSprites = [];
    const NLIGHTS = 48;

    for (let i = 2; i < NLIGHTS; i++) {          // start at i=2 to skip camera-proximity
      const t = i / NLIGHTS;
      const pt  = roadCurve.getPoint(t);
      const tan = roadCurve.getTangent(t);
      const right = new THREE.Vector3(-tan.z, 0, tan.x).normalize();

      [1, -1].forEach(side => {
        const D = side * 8;                       // ±8 from road center
        const bx = pt.x + right.x * D;
        const bz = pt.z + right.z * D;

        // Pole
        const pole = new THREE.Mesh(poleGeo, poleMat);
        pole.position.set(bx, 2.75, bz);
        scene.add(pole);

        // Bulb
        const bulb = new THREE.Mesh(bulbGeo, bulbMat);
        bulb.position.set(bx, 5.55, bz);
        scene.add(bulb);

        // Core glow sprite
        const sp1 = new THREE.Sprite(new THREE.SpriteMaterial({
          map: glowTex, blending: THREE.AdditiveBlending,
          transparent: true, depthWrite: false, opacity: 0.8,
        }));
        sp1.position.set(bx, 5.55, bz);
        sp1.scale.setScalar(6);
        sp1.userData.base = 6;
        sp1.userData.idx  = i + (side > 0 ? 0 : 0.5);
        scene.add(sp1);
        flickerSprites.push(sp1);

        // Wide atmospheric halo
        const sp2 = new THREE.Sprite(new THREE.SpriteMaterial({
          map: glowTex2, blending: THREE.AdditiveBlending,
          transparent: true, depthWrite: false, opacity: 0.18,
        }));
        sp2.position.set(bx, 5.55, bz);
        sp2.scale.setScalar(16);
        scene.add(sp2);
      });
    }

    // ── Buildings (RIGHT side = positive X = east = city) ────
    const texPool = [0, 1, 2, 3, 4, 5].map(i => makeBuildingTex(i * 41 + 7));
    const matPool = texPool.map(t => new THREE.MeshBasicMaterial({ map: t }));
    const NBLD = 60;

    for (let i = 0; i < NBLD; i++) {
      const t   = (i / NBLD) * 0.95 + 0.03;
      const pt  = roadCurve.getPoint(t);
      const tan = roadCurve.getTangent(t);
      const right = new THREE.Vector3(-tan.z, 0, tan.x).normalize();

      const h = 15 + Math.random() * 48;
      const w =  5 + Math.random() * 10;
      const d =  4 + Math.random() *  8;

      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(w, h, d),
        matPool[Math.floor(Math.random() * matPool.length)],
      );

      // Positive direction = RIGHT = east = buildings ✓
      const dist = 15 + Math.random() * 20;
      mesh.position.set(
        pt.x + right.x * dist + (Math.random() - 0.5) * 4,
        h / 2,
        pt.z + right.z * dist + (Math.random() - 0.5) * 4,
      );
      mesh.rotation.y = (Math.random() - 0.5) * 0.5;
      scene.add(mesh);
    }

    // Rooftop accent boxes (penthouse / water tanks)
    for (let i = 0; i < 22; i++) {
      const t    = (i / 22) * 0.92 + 0.04;
      const pt   = roadCurve.getPoint(t);
      const tan  = roadCurve.getTangent(t);
      const right = new THREE.Vector3(-tan.z, 0, tan.x).normalize();
      const base = 20 + Math.random() * 35;
      const rh   =  3 + Math.random() *  5;
      const dist = 14 + Math.random() * 18;
      const m = new THREE.Mesh(
        new THREE.BoxGeometry(2 + Math.random() * 4, rh, 2 + Math.random() * 3),
        matPool[0],
      );
      m.position.set(pt.x + right.x * dist, base + rh / 2, pt.z + right.z * dist);
      scene.add(m);
    }

    // ── Stars ─────────────────────────────────────────────────
    const NSTARS = 1000;
    const sPos = new Float32Array(NSTARS * 3);
    for (let i = 0; i < NSTARS; i++) {
      sPos[i * 3]     = (Math.random() - 0.5) * 500;
      sPos[i * 3 + 1] =  25 + Math.random() * 70;
      sPos[i * 3 + 2] = -Math.random() * 550;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.Float32BufferAttribute(sPos, 3));
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({
      color: '#ffffff', size: 0.32, sizeAttenuation: true,
      transparent: true, opacity: 0.90,
    })));

    // ── Moon ──────────────────────────────────────────────────
    const moonGlowTex = makeGlow('rgba(185,210,255,0.95)', 128);
    const moon = new THREE.Mesh(
      new THREE.SphereGeometry(3, 22, 22),
      new THREE.MeshBasicMaterial({ color: '#ddeeff' }),
    );
    moon.position.set(-55, 48, -110);
    scene.add(moon);

    const moonGlow = new THREE.Sprite(new THREE.SpriteMaterial({
      map: moonGlowTex, blending: THREE.AdditiveBlending,
      transparent: true, depthWrite: false, opacity: 0.42,
    }));
    moonGlow.position.copy(moon.position);
    moonGlow.scale.setScalar(26);
    scene.add(moonGlow);

    // Moon path reflection on sea
    const reflGeo = new THREE.PlaneGeometry(7, 100);
    reflGeo.rotateX(-Math.PI / 2);
    const reflMesh = new THREE.Mesh(reflGeo, new THREE.MeshBasicMaterial({ color: '#b0cce8', transparent: true, opacity: 0.06 }));
    reflMesh.position.set(-30, 0.02, -180);
    scene.add(reflMesh);

    // ── City glow (horizon) ────────────────────────────────────
    const horizTex = makeGlow('rgba(90,45,140,0.75)', 256);
    const horizSp  = new THREE.Sprite(new THREE.SpriteMaterial({
      map: horizTex, blending: THREE.AdditiveBlending,
      transparent: true, depthWrite: false, opacity: 0.40,
    }));
    horizSp.position.set(-8, 8, -350);
    horizSp.scale.setScalar(150);
    scene.add(horizSp);

    // Warm orange city-edge glow
    const warmTex = makeGlow('rgba(210,110,40,0.55)', 128);
    const warmSp  = new THREE.Sprite(new THREE.SpriteMaterial({
      map: warmTex, blending: THREE.AdditiveBlending,
      transparent: true, depthWrite: false, opacity: 0.22,
    }));
    warmSp.position.set(25, 5, -430);
    warmSp.scale.setScalar(110);
    scene.add(warmSp);

    // ── Ambient light (subtle, so MeshLambertMaterial works if needed) ──
    scene.add(new THREE.AmbientLight('#0a0520', 1.0));

    // ── Scroll → camera progress ──────────────────────────────
    let targetP = 0, currentP = 0;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      targetP = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // ── Resize ────────────────────────────────────────────────
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    // ── Animate ───────────────────────────────────────────────
    const clock = new THREE.Clock();
    let raf;

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Smooth camera lerp
      currentP += (targetP - currentP) * 0.04;

      // Map scroll 0→1 to curve 0→0.95 (never reach end)
      const p      = Math.min(currentP * 0.93, 0.96);
      const lookAhead = Math.min(p + 0.025, 1.0);

      const camPt  = roadCurve.getPoint(p);
      const lookPt = roadCurve.getPoint(lookAhead);

      // Camera at driving height, looking slightly upward along road
      camera.position.set(camPt.x, camPt.y + 2.2, camPt.z);
      camera.lookAt(lookPt.x, lookPt.y + 0.9, lookPt.z);

      // Sea shimmer animation
      shimMat.opacity = 0.20 + Math.sin(t * 0.55) * 0.07;

      // Street light subtle flicker
      for (const sp of flickerSprites) {
        const f = 1 + Math.sin(t * 2.6 + sp.userData.idx * 1.4) * 0.022;
        sp.scale.setScalar(sp.userData.base * f);
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', top: 0, left: 0,
        width: '100%', height: '100%',
        zIndex: 0, pointerEvents: 'none',
      }}
    />
  );
}
