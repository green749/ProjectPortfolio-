import * as THREE from 'three';
import './style.css';
import { createProceduralAstronaut } from './js/proceduralAstronaut.js';
import { createAllPlanets } from './js/proceduralPlanets.js';
import { createStarfieldAndNebula } from './js/starfield.js';
import { createSpaceFlightPath } from './js/spaceCameraPath.js';
import { setupHUDUI } from './js/hudUI.js';
import { spaceAudio } from './js/audio.js';

// 1. HIGH PERFORMANCE RENDERER SETUP
const canvas = document.getElementById('webgl-canvas');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x030712, 0.002);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: window.devicePixelRatio <= 1, // High performance
  alpha: false,
  powerPreference: 'high-performance'
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
renderer.setSize(window.innerWidth, window.innerHeight);

// 2. LIGHTING SETUP
const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
scene.add(ambientLight);

const mainSun = new THREE.DirectionalLight(0xffffff, 1.8);
mainSun.position.set(100, 100, 50);
scene.add(mainSun);

// 3. OBJECT INITIALIZATION
const astronaut = createProceduralAstronaut();
scene.add(astronaut);

const planets = createAllPlanets();
planets.forEach(p => scene.add(p.group));

const starfield = createStarfieldAndNebula();
scene.add(starfield);

const flightPath = createSpaceFlightPath();

// 4. INSTANT ZERO-LATENCY SCROLL ENGINE
let targetProgress = 0;
let currentProgress = 0;
let scrollSpeed = 0;
let lastScrollY = window.scrollY;

const warpProgressFill = document.getElementById('warp-progress-fill');
const warpProgressText = document.getElementById('warp-progress-text');
const currentLocationText = document.getElementById('current-location-text');
const velocityText = document.getElementById('velocity-text');

const sectorLocations = [
  "SECTOR 0: LAUNCHPAD",
  "SECTOR 1: AETHERIA AI SURFACE",
  "SECTOR 2: CHRONO PAY ICE WORLD",
  "SECTOR 3: STARTLY SAAS PLANET",
  "SECTOR 4: TAILWIND LANDING PLANET",
  "SECTOR 5: ACTION CALCULATOR WORLD",
  "SECTOR 6: ITDESK IT SUPPORT SYSTEM",
  "SECTOR 7: DROPSHIPHUB B2B PLATFORM",
  "SECTOR 8: COMMAND STATION"
];

const hudController = setupHUDUI((sectorIndex) => {
  const targetSection = document.getElementById(`section-${sectorIndex}`);
  if (targetSection) {
    targetSection.scrollIntoView({ behavior: 'smooth' });
  }
});

function updateScrollProgress() {
  const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  targetProgress = Math.max(0, Math.min(1, window.scrollY / maxScroll));

  const currentY = window.scrollY;
  const deltaY = Math.abs(currentY - lastScrollY);
  scrollSpeed = Math.min(deltaY * 0.0015, 0.15);
  lastScrollY = currentY;
}

window.addEventListener('scroll', updateScrollProgress, { passive: true });
window.addEventListener('resize', updateScrollProgress, { passive: true });
updateScrollProgress();

window.addEventListener('wheel', (e) => {
  scrollSpeed = Math.min(Math.abs(e.deltaY) * 0.0015, 0.15);
  updateScrollProgress();
}, { passive: true });

// 5. OPTIMIZED RAYCASTING (Only runs on mouse movement)
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2(-1000, -1000);
let mouseMoved = false;

window.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  mouseMoved = true;
});

// 6. ANIMATION LOOP (60+ FPS LOCK)
const clock = new THREE.Clock();
let lastSectorIndex = -1;

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  const elapsedTime = clock.getElapsedTime();

  // Snappy responsive lerp rate (0.12)
  currentProgress += (targetProgress - currentProgress) * 0.12;
  scrollSpeed *= 0.9;

  // Trajectory coordinates
  const { camPos, lookAtPos, astroPos, turnDirection, isNearSurface } = flightPath.getPositionsAtProgress(currentProgress);

  camera.position.lerp(camPos, 0.15);
  camera.lookAt(lookAtPos);

  astronaut.position.lerp(astroPos, 0.15);
  astronaut.lookAt(lookAtPos);

  if (astronaut.userData && astronaut.userData.update) {
    astronaut.userData.update(delta, scrollSpeed, turnDirection, isNearSurface);
  }

  planets.forEach(p => {
    if (p.update) p.update(elapsedTime);
  });

  if (starfield.userData && starfield.userData.update) {
    starfield.userData.update(scrollSpeed);
  }

  spaceAudio.updateThrusterSound(scrollSpeed);

  // Throttled Raycasting
  if (mouseMoved) {
    raycaster.setFromCamera(mouse, camera);
    const planetMeshes = planets.map(p => p.mesh);
    const intersects = raycaster.intersectObjects(planetMeshes);

    if (intersects.length > 0) {
      canvas.style.cursor = 'pointer';
      intersects[0].object.scale.lerp(new THREE.Vector3(1.06, 1.06, 1.06), 0.2);
    } else {
      canvas.style.cursor = 'default';
      document.body.style.cursor = '';
      planetMeshes.forEach(mesh => mesh.scale.lerp(new THREE.Vector3(1, 1, 1), 0.2));
    }
    mouseMoved = false;
  }

  // Telemetry UI Updates (Throttled DOM edits)
  const progressPercent = Math.round(currentProgress * 100);
  if (warpProgressFill) warpProgressFill.style.width = `${progressPercent}%`;
  if (warpProgressText) warpProgressText.textContent = `${progressPercent}%`;

  const currentSectorIndex = Math.min(8, Math.floor(currentProgress * 8.99));
  if (currentSectorIndex !== lastSectorIndex) {
    if (currentLocationText) currentLocationText.textContent = sectorLocations[currentSectorIndex];
    hudController.updateActiveSector(currentSectorIndex);
    lastSectorIndex = currentSectorIndex;
  }

  if (velocityText) velocityText.textContent = `${(scrollSpeed * 10).toFixed(1)} Warp`;

  renderer.render(scene, camera);
}

animate();
