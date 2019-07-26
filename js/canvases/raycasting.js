(function() {
  window.canvases.raycasting = {
    initialize: function(canvas) {
      const refract = function(incoming, normal, eta) {
        k =
          1.0 - eta * eta * (1.0 - normal.dot(incoming) * normal.dot(incoming));
        if (k < 0.0) return new THREE.Vector3();
        else
          return incoming
            .clone()
            .multiplyScalar(eta)
            .sub(
              normal
                .clone()
                .multiplyScalar(eta * normal.dot(incoming) + Math.sqrt(k))
            );
      };

      const traceRay = function(crystalMesh, rayOrigin, rayDir) {
        // Cast ray to crystal
        const raycaster = new THREE.Raycaster(
          rayOrigin.clone(),
          rayDir.clone()
        );

        // Draw ray
        const rayGeometry = new THREE.Geometry();
        rayGeometry.vertices.push(rayOrigin.clone());

        for (i = 0; i < 10; ++i) {
          const intersectionPoints = raycaster.intersectObject(crystalMesh);
          if (intersectionPoints.length == 0) {
            let endPoint = new THREE.Vector3();
            rayGeometry.vertices.push(raycaster.ray.at(100000.0, endPoint));
            break;
          }
          const hitPoint = intersectionPoints[0].point;
          let hitPointNormal = intersectionPoints[0].face.normal.clone();
          if (i != 0) hitPointNormal.negate();
          rayGeometry.vertices.push(hitPoint);
          const newRayDir = refract(
            rayDir,
            hitPointNormal,
            i == 0 ? 1.0 / 1.33 : 1.33
          );
          raycaster.set(
            hitPoint.clone().addScaledVector(rayDir, 0.001),
            newRayDir
          );
        }

        return new THREE.Line(
          rayGeometry,
          new THREE.LineBasicMaterial({
            color: 0x000000
          })
        );
      };

      let renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
      });

      let canvasSize = new THREE.Vector2();
      renderer.getSize(canvasSize);
      let aspectRatio = canvasSize.x / canvasSize.y;
      let camera = new THREE.PerspectiveCamera(45, aspectRatio, 0.1, 1000);

      let scene = new THREE.Scene();
      let light = new THREE.HemisphereLight(0xffffff, 0x0f0f0f, 1);
      scene.add(light);

      // Hexagonal ice crystal geometry
      let crystal = new THREE.CylinderGeometry(1, 1, 1, 6, 1);

      // Edges of crystal
      let edges = new THREE.EdgesGeometry(crystal);
      let line = new THREE.LineSegments(
        edges,
        new THREE.LineBasicMaterial({ color: 0x000000 })
      );
      scene.add(line);

      // Base material for crystal
      const invisibleCrystalMaterial = new THREE.MeshStandardMaterial({
        transparent: true,
        opacity: 0.0,
        color: 0x77aaff,
        side: THREE.DoubleSide
      });
      const invisibleCrystalMesh = new THREE.Mesh(
        crystal,
        invisibleCrystalMaterial
      );
      scene.add(invisibleCrystalMesh);

      const crystalMaterial = new THREE.MeshStandardMaterial({
        transparent: true,
        opacity: 0.75,
        color: 0x77aaff
      });
      const crystalMesh = new THREE.Mesh(crystal, crystalMaterial);
      scene.add(crystalMesh);

      camera.position.set(5.0, 1.0, 5.0);
      camera.lookAt(new THREE.Vector3(0.0, -0.5, 0.0));

      let t = 0;
      let instance = { active: false };
      function animate() {
        requestAnimationFrame(animate, canvas);
        if (!instance.active || canvas_defaults.paused) return;

        const rayOrigin = new THREE.Vector3(
          10.0 * Math.sin(t),
          10.0 * Math.cos(t),
          0.0
        );
        const rayDir = rayOrigin
          .clone()
          .negate()
          .normalize();

        invisibleCrystalMesh.rotation.y = t;
        crystalMesh.rotation.y = t;
        line.rotation.y = t;

        const rayLineMesh = traceRay(invisibleCrystalMesh, rayOrigin, rayDir);
        scene.add(rayLineMesh);
        t = t + 0.01;
        renderer.render(scene, camera);
        scene.remove(rayLineMesh);
      }
      animate();
      return instance;
    }
  };
})();
