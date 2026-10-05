import * as THREE from 'three';

export function createStarfieldAndNebula() {
  const starfieldGroup = new THREE.Group();

  // High-performance Starfield System (2,200 stars)
  const starCount = 2200;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(starCount * 3);
  const colors = new Float32Array(starCount * 3);

  const starColors = [
    new THREE.Color(0x00f3ff),
    new THREE.Color(0xffffff),
    new THREE.Color(0x9d4edd),
    new THREE.Color(0xffb703)
  ];

  for (let i = 0; i < starCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 500;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 500;
    positions[i * 3 + 2] = -Math.random() * 450 + 50;

    const col = starColors[Math.floor(Math.random() * starColors.length)];
    colors[i * 3] = col.r;
    colors[i * 3 + 1] = col.g;
    colors[i * 3 + 2] = col.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const starMaterial = new THREE.PointsMaterial({
    size: 1.4,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const starPoints = new THREE.Points(geometry, starMaterial);
  starfieldGroup.add(starPoints);

  starfieldGroup.userData = {
    starPoints,
    starCount,
    update(scrollSpeed = 0) {
      if (scrollSpeed < 0.001) return; // Skip buffer updates when stationary for 0 CPU idle load!

      const pos = this.starPoints.geometry.attributes.position.array;
      for (let i = 0; i < this.starCount; i++) {
        const i3 = i * 3 + 2;
        pos[i3] += scrollSpeed * 15;
        if (pos[i3] > 60) pos[i3] = -420;
      }
      this.starPoints.geometry.attributes.position.needsUpdate = true;
    }
  };

  return starfieldGroup;
}
