(function() {
  window.canvases.secondtest = {
    initialize: function(canvas) {
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
      let line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x000000 }));
      scene.add(line);

      // Base material for crystal
      let crystalMaterial = new THREE.MeshStandardMaterial({
        transparent: true,
        opacity: 0.75,
        color: 0xaaccff
      });
      let crystalMesh = new THREE.Mesh(crystal, crystalMaterial);
      scene.add(crystalMesh);

      let t = 0;
      let instance = { active: false };
      function animate() {
        requestAnimationFrame(animate, canvas);
        if (!instance.active || canvas_defaults.paused) return;
        camera.position.set(5.0 * Math.sin(t), 1.0, 5.0 * Math.cos(t));
        camera.lookAt(new THREE.Vector3(0.0, 0.0, 0.0));
        t = t + 0.005;
        renderer.render(scene, camera);
      }
      animate();
      return instance;
    }
  };
})();
