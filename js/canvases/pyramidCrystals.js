(function() {
  window.canvases.pyramidCrystals = {
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

      const getWireframeMesh = function(geometry) {
        const wireframe = getWireframe(geometry);
        const mesh = getMesh(geometry);
        let group = new THREE.Group();
        group.add(wireframe);
        group.add(mesh);
        return group;
      };

      const getCrystal = function(caRatio) {
        const geometry = getCrystalGeometry(caRatio);
        return getWireframeMesh(geometry);
      };

      const getPyramidCrystal = function() {
        const bodyGeometry = new THREE.CylinderGeometry(1, 1, 1, 6, 1, true);
        const topGeometry = new THREE.CylinderGeometry(0.5, 1, 0.5, 6, 1, true);
        const bottomGeometry = new THREE.CylinderGeometry(1, 0.5, 0.5, 6, 1, true);
        const topCapGeometry = new THREE.CircleGeometry(0.5, 6);
        const bottomCapGeometry = new THREE.CircleGeometry(0.5, 6);

        const topMesh = getWireframeMesh(topGeometry);
        topMesh.position.y = 0.75;

        const bottomMesh = getWireframeMesh(bottomGeometry);
        bottomMesh.position.y = -0.75;

        const topCapMesh = getWireframeMesh(topCapGeometry);
        topCapMesh.position.y = 1.0;
        topCapMesh.rotation.z = Math.PI / 6;
        topCapMesh.rotation.x = -0.5 * Math.PI;

        const bottomCapMesh = getWireframeMesh(bottomCapGeometry);
        bottomCapMesh.position.y = -1.0;
        bottomCapMesh.rotation.z = Math.PI / 6;
        bottomCapMesh.rotation.x = 0.5 * Math.PI;

        let group = new THREE.Group();
        group.add(getWireframeMesh(bodyGeometry));
        group.add(topMesh);
        group.add(bottomMesh);
        group.add(topCapMesh);
        group.add(bottomCapMesh);
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

      const pyramidCrystal = getPyramidCrystal();
      pyramidCrystal.scale.x = pyramidCrystal.scale.y = pyramidCrystal.scale.z = 1.5;
      scene.add(pyramidCrystal);

      let t = 0;
      let instance = { active: false };
      function animate() {
        requestAnimationFrame(animate, canvas);
        if (!instance.active || canvas_defaults.paused) return;

        pyramidCrystal.rotateX(0.002);
        pyramidCrystal.rotateY(0.006);
        pyramidCrystal.rotateZ(0.011);

        camera.position.set(0.0, 1.0, 6.0);
        camera.lookAt(new THREE.Vector3(0.0, 0.0, 0.0));
        t = t + 0.02;
        renderer.render(scene, camera);
      }
      animate();
      return instance;
    }
  };
})();
