import * as THREE from 'three';

export function createProceduralAstronaut() {
  const astronaut = new THREE.Group();

  // Optimized shared materials
  const suitMaterial = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    roughness: 0.3,
    metalness: 0.1,
  });

  const darkSuitMaterial = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.5,
    metalness: 0.3,
  });

  const goldVisorMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffb703,
    metalness: 0.9,
    roughness: 0.05,
    clearcoat: 1.0,
  });

  const cyanEmissiveMat = new THREE.MeshBasicMaterial({ color: 0x00f3ff });
  const redEmissiveMat = new THREE.MeshBasicMaterial({ color: 0xff0055 });
  const goldEmissiveMat = new THREE.MeshBasicMaterial({ color: 0xffb703 });

  // 1. HELMET & HEAD (Optimized 24x24 geometry)
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 1.35, 0);

  const helmetMesh = new THREE.Mesh(new THREE.SphereGeometry(0.38, 24, 24), suitMaterial);
  headGroup.add(helmetMesh);

  const visorMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.385, 24, 24, -Math.PI / 2.5, Math.PI / 1.25, Math.PI / 6, Math.PI / 1.8),
    goldVisorMaterial
  );
  headGroup.add(visorMesh);

  astronaut.add(headGroup);

  // 2. TORSO & CHEST
  const torsoGroup = new THREE.Group();
  torsoGroup.position.set(0, 0.6, 0);

  const chestMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.35, 0.85, 16), suitMaterial);
  torsoGroup.add(chestMesh);

  const packMesh = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, 0.15), darkSuitMaterial);
  packMesh.position.set(0, 0.05, 0.28);
  torsoGroup.add(packMesh);

  const ledGeo = new THREE.SphereGeometry(0.025, 8, 8);
  const led1 = new THREE.Mesh(ledGeo, cyanEmissiveMat);
  led1.position.set(-0.1, 0.1, 0.36);
  const led2 = new THREE.Mesh(ledGeo, redEmissiveMat);
  led2.position.set(0, 0.1, 0.36);
  const led3 = new THREE.Mesh(ledGeo, goldEmissiveMat);
  led3.position.set(0.1, 0.1, 0.36);
  torsoGroup.add(led1, led2, led3);

  astronaut.add(torsoGroup);

  // 3. BACK JETPACK & NOZZLES
  const jetpackGroup = new THREE.Group();
  jetpackGroup.position.set(0, 0.6, -0.3);

  const jetBodyMesh = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.65, 0.22), darkSuitMaterial);
  jetpackGroup.add(jetBodyMesh);

  const thrusterLight = new THREE.PointLight(0x00f3ff, 0, 10);
  thrusterLight.position.set(0, -0.4, -0.2);
  jetpackGroup.add(thrusterLight);

  astronaut.add(jetpackGroup);

  // 4. ARMS & LEGS
  const armGeo = new THREE.CylinderGeometry(0.1, 0.09, 0.6, 12);
  armGeo.translate(0, -0.3, 0);

  const leftArmGroup = new THREE.Group();
  leftArmGroup.position.set(0.48, 0.85, 0);
  leftArmGroup.add(new THREE.Mesh(armGeo, suitMaterial));
  astronaut.add(leftArmGroup);

  const rightArmGroup = new THREE.Group();
  rightArmGroup.position.set(-0.48, 0.85, 0);
  rightArmGroup.add(new THREE.Mesh(armGeo, suitMaterial));
  astronaut.add(rightArmGroup);

  const legGeo = new THREE.CylinderGeometry(0.12, 0.1, 0.7, 12);
  legGeo.translate(0, -0.35, 0);

  const leftLegGroup = new THREE.Group();
  leftLegGroup.position.set(0.2, 0.2, 0);
  leftLegGroup.add(new THREE.Mesh(legGeo, suitMaterial));
  astronaut.add(leftLegGroup);

  const rightLegGroup = new THREE.Group();
  rightLegGroup.position.set(-0.2, 0.2, 0);
  rightLegGroup.add(new THREE.Mesh(legGeo, suitMaterial));
  astronaut.add(rightLegGroup);

  // 5. THRUSTER FLAME PARTICLES (50 fast particles)
  const particleCount = 50;
  const particleGeo = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    const isLeft = i % 2 === 0;
    particlePositions[i * 3] = isLeft ? 0.15 : -0.15;
    particlePositions[i * 3 + 1] = 0.2;
    particlePositions[i * 3 + 2] = -0.3;
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

  const particleMat = new THREE.PointsMaterial({
    color: 0x00f3ff,
    size: 0.2,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const thrusterParticles = new THREE.Points(particleGeo, particleMat);
  astronaut.add(thrusterParticles);

  astronaut.scale.set(1.4, 1.4, 1.4);

  let flightBlend = 0;
  let landingBlend = 0;

  astronaut.userData = {
    time: 0,
    armL: leftArmGroup,
    armR: rightArmGroup,
    legL: leftLegGroup,
    legR: rightLegGroup,
    head: headGroup,
    particles: thrusterParticles,
    particlePositions,
    particleCount,
    particleMat,
    thrusterLight,
    
    update(delta, scrollSpeed = 0, turnDirection = 0, isNearSurface = false) {
      this.time += delta;

      const targetFlight = Math.min(scrollSpeed * 35, 1.0);
      flightBlend += (targetFlight - flightBlend) * 0.15;

      const targetLanding = (isNearSurface && scrollSpeed < 0.02) ? 1.0 : 0.0;
      landingBlend += (targetLanding - landingBlend) * 0.12;

      const pitchAngle = THREE.MathUtils.lerp(
        THREE.MathUtils.lerp(0.05, 1.1, flightBlend),
        0.0,
        landingBlend
      );
      astronaut.rotation.x = pitchAngle + Math.cos(this.time * 1.5) * 0.02;

      const bankAngle = THREE.MathUtils.lerp(
        Math.sin(this.time * 1.5) * 0.04,
        turnDirection * 0.6,
        flightBlend
      );
      astronaut.rotation.z = bankAngle;

      this.armL.rotation.x = THREE.MathUtils.lerp(
        THREE.MathUtils.lerp(0.2, -1.2, flightBlend),
        -0.2,
        landingBlend
      );

      this.armR.rotation.x = THREE.MathUtils.lerp(
        THREE.MathUtils.lerp(-0.1, -1.2, flightBlend),
        0.4,
        landingBlend
      );

      this.thrusterLight.intensity = (flightBlend * 4.0) * (1 - landingBlend);

      // Fast thruster particle updates
      const positions = this.particles.geometry.attributes.position.array;
      for (let i = 0; i < this.particleCount; i++) {
        const i3 = i * 3;
        positions[i3 + 1] -= 0.1 * (1 + flightBlend * 5);
        if (positions[i3 + 1] < -2.0) {
          positions[i3] = (i % 2 === 0 ? 0.15 : -0.15) + (Math.random() - 0.5) * 0.1;
          positions[i3 + 1] = 0.2;
          positions[i3 + 2] = -0.3;
        }
      }
      this.particles.geometry.attributes.position.needsUpdate = true;
    }
  };

  return astronaut;
}
