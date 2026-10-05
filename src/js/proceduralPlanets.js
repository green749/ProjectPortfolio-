import * as THREE from 'three';

// Optimized Procedural Canvas Textures (512x256 resolution for 75% GPU VRAM reduction & ultra fast load)
function createNeuralTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d', { alpha: false });

  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, '#030712');
  grad.addColorStop(0.5, '#1e1b4b');
  grad.addColorStop(1, '#090d16');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = 'rgba(0, 243, 255, 0.3)';
  ctx.lineWidth = 1;

  const points = [];
  for (let i = 0; i < 40; i++) {
    points.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 3 + 1
    });
  }

  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const dist = Math.hypot(points[i].x - points[j].x, points[i].y - points[j].y);
      if (dist < 70) {
        ctx.beginPath();
        ctx.moveTo(points[i].x, points[i].y);
        ctx.lineTo(points[j].x, points[j].y);
        ctx.stroke();
      }
    }
  }

  for (const p of points) {
    ctx.fillStyle = '#00f3ff';
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  return texture;
}

function createIceGlacierTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d', { alpha: false });

  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, '#e0f2fe');
  grad.addColorStop(0.3, '#38bdf8');
  grad.addColorStop(0.7, '#0284c7');
  grad.addColorStop(1, '#f0f9ff');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 25; i++) {
    let x = Math.random() * canvas.width;
    let y = Math.random() * canvas.height;
    ctx.beginPath();
    ctx.moveTo(x, y);
    for (let step = 0; step < 4; step++) {
      x += (Math.random() - 0.5) * 40;
      y += (Math.random() - 0.5) * 40;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  return texture;
}

function createGoldenDuneTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d', { alpha: false });

  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, '#78350f');
  grad.addColorStop(0.4, '#b45309');
  grad.addColorStop(0.8, '#d97706');
  grad.addColorStop(1, '#fef3c7');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  return texture;
}

function createOceanWaterTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d', { alpha: false });

  ctx.fillStyle = '#0284c7';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#0369a1';
  for (let i = 0; i < 30; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const r = Math.random() * 40 + 15;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  return texture;
}

function createFieryLavaTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d', { alpha: false });

  ctx.fillStyle = '#450a0a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 150; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const r = Math.random() * 20 + 4;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, '#ff0055');
    grad.addColorStop(0.5, '#ffb703');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  return texture;
}

function createCyberMatrixTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d', { alpha: false });

  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, '#0284c7');
  grad.addColorStop(0.5, '#1e3a8a');
  grad.addColorStop(1, '#0f172a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
  ctx.lineWidth = 1;
  for (let x = 0; x < canvas.width; x += 32) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += 32) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  return texture;
}

function createEmeraldCrystalTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d', { alpha: false });

  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, '#065f46');
  grad.addColorStop(0.5, '#10b981');
  grad.addColorStop(1, '#022c22');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'rgba(52, 211, 153, 0.3)';
  for (let i = 0; i < 40; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const r = Math.random() * 25 + 5;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  return texture;
}

export function createAllPlanets() {
  const planets = [];

  // Optimized Geometries (32x32 polygon resolution)
  const sphereGeo6 = new THREE.SphereGeometry(6, 32, 32);
  const sphereGeo7 = new THREE.SphereGeometry(7, 32, 32);
  const sphereGeo75 = new THREE.SphereGeometry(7.5, 32, 32);
  const sphereGeo65 = new THREE.SphereGeometry(6.5, 32, 32);
  const sphereGeo8 = new THREE.SphereGeometry(8, 32, 32);

  // PLANET 1: AETHERIA AI
  const p1Group = new THREE.Group();
  p1Group.position.set(25, 0, -50);

  const p1Mat = new THREE.MeshStandardMaterial({
    map: createNeuralTexture(),
    roughness: 0.3,
    metalness: 0.7,
    emissive: 0x00f3ff,
    emissiveIntensity: 0.15
  });
  const p1Mesh = new THREE.Mesh(sphereGeo6, p1Mat);
  p1Group.add(p1Mesh);

  const cyberGridGeo = new THREE.RingGeometry(0, 4.5, 16);
  const cyberGridMat = new THREE.MeshBasicMaterial({
    color: 0x00f3ff,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.3,
    wireframe: true
  });
  const cyberPlatform = new THREE.Mesh(cyberGridGeo, cyberGridMat);
  cyberPlatform.position.set(-4.5, 3.8, 2.5);
  cyberPlatform.rotation.x = Math.PI / 2.5;
  p1Group.add(cyberPlatform);

  planets.push({
    group: p1Group,
    mesh: p1Mesh,
    update: (t) => {
      p1Mesh.rotation.y = t * 0.1;
      cyberPlatform.rotation.z = t * 0.15;
    }
  });

  // PLANET 2: CHRONO PAY (COLD ICE GLACIER PLANET)
  const p2Group = new THREE.Group();
  p2Group.position.set(-30, 8, -110);

  const p2Mat = new THREE.MeshStandardMaterial({
    map: createIceGlacierTexture(),
    roughness: 0.15,
    metalness: 0.8,
  });
  const p2Mesh = new THREE.Mesh(sphereGeo7, p2Mat);
  p2Group.add(p2Mesh);

  // Reusable Ice Spikes
  const iceSpikeGeo = new THREE.ConeGeometry(0.5, 2.2, 4);
  const iceSpikeMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    metalness: 0.2,
    roughness: 0.1,
    transparent: true,
    opacity: 0.85
  });

  for (let i = 0; i < 8; i++) {
    const spike = new THREE.Mesh(iceSpikeGeo, iceSpikeMat);
    const theta = (i / 8) * Math.PI * 2;
    spike.position.set(6.9 * Math.cos(theta), 6.9 * Math.sin(theta), 0);
    p2Group.add(spike);
  }

  planets.push({
    group: p2Group,
    mesh: p2Mesh,
    update: (t) => {
      p2Mesh.rotation.y = t * 0.08;
    }
  });

  // PLANET 3: HYPERION 3D (GOLDEN DUNE PLANET)
  const p3Group = new THREE.Group();
  p3Group.position.set(32, -6, -170);

  const p3Mat = new THREE.MeshStandardMaterial({
    map: createGoldenDuneTexture(),
    roughness: 0.6,
    metalness: 0.2,
  });
  const p3Mesh = new THREE.Mesh(sphereGeo75, p3Mat);
  p3Group.add(p3Mesh);

  const ring3Geo = new THREE.RingGeometry(9.5, 12, 32);
  const ring3Mat = new THREE.MeshBasicMaterial({
    color: 0xffb703,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.5
  });
  const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
  ring3.rotation.x = Math.PI / 2.3;
  p3Group.add(ring3);

  planets.push({
    group: p3Group,
    mesh: p3Mesh,
    update: (t) => {
      p3Mesh.rotation.y = t * 0.06;
      ring3.rotation.z = t * 0.03;
    }
  });

  // PLANET 4: PULSE SOCIAL (OCEAN WATER PLANET)
  const p4Group = new THREE.Group();
  p4Group.position.set(-28, 4, -230);

  const p4Mat = new THREE.MeshStandardMaterial({
    map: createOceanWaterTexture(),
    roughness: 0.2,
    metalness: 0.3
  });
  const p4Mesh = new THREE.Mesh(sphereGeo65, p4Mat);
  p4Group.add(p4Mesh);

  planets.push({
    group: p4Group,
    mesh: p4Mesh,
    update: (t) => {
      p4Mesh.rotation.y = t * 0.08;
    }
  });

  // PLANET 5: ASTRO NOVA (FIERY LAVA STAR)
  const p5Group = new THREE.Group();
  p5Group.position.set(26, 0, -290);

  const p5Mat = new THREE.MeshBasicMaterial({
    map: createFieryLavaTexture()
  });
  const p5Mesh = new THREE.Mesh(sphereGeo8, p5Mat);
  p5Group.add(p5Mesh);

  const p5Light = new THREE.PointLight(0xff0055, 2.5, 40);
  p5Group.add(p5Light);

  planets.push({
    group: p5Group,
    mesh: p5Mesh,
    update: (t) => {
      p5Mesh.rotation.y = t * 0.15;
    }
  });

  // PLANET 6: ITDESK SUPPORT (ELECTRIC MATRIX PLANET)
  const p6Group = new THREE.Group();
  p6Group.position.set(-28, 6, -350);

  const p6Mat = new THREE.MeshStandardMaterial({
    map: createCyberMatrixTexture(),
    roughness: 0.2,
    metalness: 0.8,
    emissive: 0x3b82f6,
    emissiveIntensity: 0.2
  });
  const p6Mesh = new THREE.Mesh(sphereGeo7, p6Mat);
  p6Group.add(p6Mesh);

  planets.push({
    group: p6Group,
    mesh: p6Mesh,
    update: (t) => {
      p6Mesh.rotation.y = t * 0.09;
    }
  });

  // PLANET 7: DROPSHIPHUB B2B (EMERALD CRYSTAL PLANET)
  const p7Group = new THREE.Group();
  p7Group.position.set(28, -5, -410);

  const p7Mat = new THREE.MeshStandardMaterial({
    map: createEmeraldCrystalTexture(),
    roughness: 0.3,
    metalness: 0.6,
    emissive: 0x10b981,
    emissiveIntensity: 0.15
  });
  const p7Mesh = new THREE.Mesh(sphereGeo75, p7Mat);
  p7Group.add(p7Mesh);

  const ring7Geo = new THREE.RingGeometry(9, 11, 32);
  const ring7Mat = new THREE.MeshBasicMaterial({
    color: 0x10b981,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.45
  });
  const ring7 = new THREE.Mesh(ring7Geo, ring7Mat);
  ring7.rotation.x = Math.PI / 2.2;
  p7Group.add(ring7);

  planets.push({
    group: p7Group,
    mesh: p7Mesh,
    update: (t) => {
      p7Mesh.rotation.y = t * 0.07;
      ring7.rotation.z = t * 0.04;
    }
  });

  // SECTOR 8: COMMAND STATION DOCK
  const stationGroup = new THREE.Group();
  stationGroup.position.set(0, -2, -470);

  const dockGeo = new THREE.CylinderGeometry(12, 14, 1.2, 8);
  const dockMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    metalness: 0.8,
    roughness: 0.2
  });
  const dockMesh = new THREE.Mesh(dockGeo, dockMat);
  stationGroup.add(dockMesh);

  planets.push({
    group: stationGroup,
    mesh: dockMesh,
    update: (t) => {
      stationGroup.rotation.y = t * 0.04;
    }
  });

  return planets;
}
