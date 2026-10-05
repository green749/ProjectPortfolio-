import * as THREE from 'three';

export function createSpaceFlightPath() {
  // Waypoints with explicit Planetary Surface Touchdowns & Deep Space Launches
  const waypoints = [
    new THREE.Vector3(0, 0, 15),          // 0: Sector 0 Launchpad
    new THREE.Vector3(10, 3, -25),        // 1: Space Flight to Planet 1
    new THREE.Vector3(18.5, 0.2, -50),    // 2: PLANET 1 SURFACE TOUCHDOWN (Aetheria AI)
    new THREE.Vector3(4, 5, -75),         // 3: Surface Take-Off & Space Ascent
    new THREE.Vector3(-22.5, 8.5, -110),  // 4: PLANET 2 SURFACE TOUCHDOWN (Chrono Pay)
    new THREE.Vector3(0, -3, -140),       // 5: Surface Take-Off & Space Ascent
    new THREE.Vector3(24.0, -5.8, -170),  // 6: PLANET 3 SURFACE TOUCHDOWN (Startly SaaS)
    new THREE.Vector3(2, 4, -200),        // 7: Surface Take-Off & Space Ascent
    new THREE.Vector3(-21.0, 4.2, -230),  // 8: PLANET 4 SURFACE TOUCHDOWN (Tailwind Landing)
    new THREE.Vector3(0, -2, -260),       // 9: Surface Take-Off & Space Ascent
    new THREE.Vector3(17.5, 0.4, -290),   // 10: PLANET 5 SURFACE TOUCHDOWN (Action Calculator)
    new THREE.Vector3(-4, 3, -320),       // 11: Surface Take-Off & Space Ascent
    new THREE.Vector3(-21.5, 6.2, -350),  // 12: PLANET 6 SURFACE TOUCHDOWN (ITDesk Support)
    new THREE.Vector3(2, -3, -380),       // 13: Surface Take-Off & Space Ascent
    new THREE.Vector3(21.5, -4.8, -410),  // 14: PLANET 7 SURFACE TOUCHDOWN (DropShipHub B2B)
    new THREE.Vector3(4, 1, -440),        // 15: Space Ascent to Final Hub
    new THREE.Vector3(0, -1, -460)        // 16: Sector 8 Space Station Landing
  ];

  const curve = new THREE.CatmullRomCurve3(waypoints, false, 'centripetal', 0.5);

  return {
    curve,
    waypoints,

    // Evaluates camera position, astronaut position, surface landing state, and turn direction
    getPositionsAtProgress(progress) {
      const p = Math.max(0, Math.min(1, progress));

      // 3D trajectory camera position
      const camPos = curve.getPointAt(p);

      // Look at target further along path
      const lookAtProgress = Math.min(1, p + 0.03);
      const lookAtPos = curve.getPointAt(lookAtProgress);

      // Astronaut position slightly ahead of camera
      const astroProgress = Math.min(1, p + 0.015);
      const astroPos = curve.getPointAt(astroProgress);

      // Calculate direction & turn curvature for flight banking
      const tangent = curve.getTangentAt(p);
      const tangentNext = curve.getTangentAt(Math.min(1, p + 0.01));
      const turnVector = tangentNext.clone().sub(tangent);
      const turnDirection = THREE.MathUtils.clamp(-turnVector.x * 25, -1.0, 1.0);

      // Check if currently near a planetary surface touchdown (Sectors 1 to 7)
      const surfaceLandingDistances = [0.11, 0.23, 0.36, 0.49, 0.62, 0.75, 0.88, 0.98];
      let isNearSurface = false;
      for (const targetP of surfaceLandingDistances) {
        if (Math.abs(p - targetP) < 0.035) {
          isNearSurface = true;
          break;
        }
      }

      // Offset astronaut for cinematic framing
      const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
      const offsetDist = isNearSurface ? 0.8 : 1.6;
      astroPos.addScaledVector(normal, offsetDist);
      if (isNearSurface) astroPos.y -= 0.2; // Touch down closer to terrain

      return { camPos, lookAtPos, astroPos, tangent, turnDirection, isNearSurface };
    }
  };
}
