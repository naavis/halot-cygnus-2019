(function() {
  window.canvases.crystalExamples = {
    initialize: function(canvas) {
      const getCrystalGeometry = function(caRatio) {
        return new THREE.CylinderGeometry(1, 1, caRatio, 6, 1);
      };
      const getWireframe = function(geometry) {
        const edges = new THREE.EdgesGeometry(geometry);
        return new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x000000 }));
      };
      const getMesh = function(geometry) {
        const iceMaterial = new THREE.MeshStandardMaterial({
          transparent: true,
          opacity: 0.75,
          color: 0x77aaff
        });
        return new THREE.Mesh(geometry, iceMaterial);
      };

      const getCrystal = function(caRatio) {
        const geometry = getCrystalGeometry(caRatio);
        const wireframe = getWireframe(geometry);
        const mesh = getMesh(geometry);
        let group = new THREE.Group();
        group.add(wireframe);
        group.add(mesh);
        return group;
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

      const plateCrystal = getCrystal(0.5);
      scene.add(plateCrystal);

      const columnCrystal = getCrystal(5.0);
      columnCrystal.rotateOnWorldAxis(new THREE.Vector3(1.0, 0.0, 0.0), Math.PI / 2.0);
      scene.add(columnCrystal);

      let t = 0;
      let instance = { active: false };
      function animate() {
        requestAnimationFrame(animate, canvas);
        if (!instance.active || canvas_defaults.paused) return;

        plateCrystal.rotation.y = t;
        plateCrystal.position.x = -1.5;

        columnCrystal.rotation.z = -t;
        columnCrystal.position.x = 1.5;
        columnCrystal.scale.x = columnCrystal.scale.y = columnCrystal.scale.z = 0.5;

        camera.position.set(0.0, 1.0, 5.0);
        camera.lookAt(new THREE.Vector3(0.0, 0.0, 0.0));
        t = t + 0.005;
        renderer.render(scene, camera);
      }
      animate();
      return instance;
    }
  };
})();
