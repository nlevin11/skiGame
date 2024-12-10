class Obstacle {
  constructor(scene, movementLimit, playerPositionZ, spawnDistance, modelsLoader, offset = 0) {
    let obstacle;
    const obstacleTypeRoll = Math.random();
    let obstacleType = 'tree';
    if (obstacleTypeRoll < 0.33) {
      obstacleType = 'tree';
    } else if (obstacleTypeRoll < 0.66) {
      obstacleType = 'rock';
    } else {
      obstacleType = 'jump';
    }

    const xPos = (Math.random() - 0.5) * movementLimit * 2;
    const zPos = playerPositionZ - spawnDistance + offset;
    const baseY = (obstacleType === 'jump') ? -2 : -1;

    if (obstacleType === 'tree' || obstacleType === 'rock') {
      const model = modelsLoader.getModel(obstacleType);
      if (model) {
        obstacle = model.clone();

        // Scale models as before
        if (obstacleType === 'tree') {
          const scale = 2.0;
          obstacle.scale.set(scale, scale, scale);
        } else { // rock
          const scale = 1.5;
          obstacle.scale.set(scale, scale, scale);
        }

        // Place the obstacle before computing bounding box
        obstacle.position.set(xPos, baseY, zPos);
        scene.add(obstacle);

        // Compute bounding box after obstacle is placed
        const boundingBox = new THREE.Box3().setFromObject(obstacle);
        const size = new THREE.Vector3();
        boundingBox.getSize(size);

        // Create a much smaller hitbox, for example 40% of model size
        const hitboxScale = 0.4;
        const hitboxGeometry = new THREE.BoxGeometry(
          size.x * hitboxScale,
          size.y * hitboxScale,
          size.z * hitboxScale
        );
        const hitboxMaterial = new THREE.MeshBasicMaterial({ visible: false });
        this.hitboxMesh = new THREE.Mesh(hitboxGeometry, hitboxMaterial);

        // Position the hitbox at the center of the model's bounding box
        const center = new THREE.Vector3();
        boundingBox.getCenter(center);

        // We'll just put the hitbox center at the bounding box center
        this.hitboxMesh.position.copy(center);

        scene.add(this.hitboxMesh);
      } else {
        // If model is not loaded, fallback to simpler shapes:
        console.warn(`${obstacleType} model not loaded, using fallback geometry`);

        let visualGeometry, visualMaterial, hitboxGeometry, hitboxMaterial;

        if (obstacleType === 'tree') {
          visualGeometry = new THREE.ConeGeometry(1.0, 4, 16);
          visualMaterial = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
          obstacle = new THREE.Mesh(visualGeometry, visualMaterial);

          // Smaller fallback hitbox
          hitboxGeometry = new THREE.BoxGeometry(0.3, 0.8, 0.3); // smaller than before
          hitboxMaterial = new THREE.MeshBasicMaterial({ visible: false });
          this.hitboxMesh = new THREE.Mesh(hitboxGeometry, hitboxMaterial);
          this.hitboxMesh.position.set(xPos, baseY - 1.5, zPos);
        } else {
          visualGeometry = new THREE.BoxGeometry(2, 2, 2);
          visualMaterial = new THREE.MeshLambertMaterial({ color: 0x808080 });
          obstacle = new THREE.Mesh(visualGeometry, visualMaterial);

          // Smaller fallback hitbox
          hitboxGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5); // reduced size
          hitboxMaterial = new THREE.MeshBasicMaterial({ visible: false });
          this.hitboxMesh = new THREE.Mesh(hitboxGeometry, hitboxMaterial);
          this.hitboxMesh.position.set(xPos, baseY - 1.2, zPos);
        }

        obstacle.position.set(xPos, baseY, zPos);
        scene.add(obstacle);
        scene.add(this.hitboxMesh);
      }
    } else {
      // Jump ramp logic remains the same
      const rampGeometry = new THREE.BoxGeometry(4, 0.5, 2);
      const rampMaterial = new THREE.MeshLambertMaterial({ color: 0xffd700 });
      obstacle = new THREE.Mesh(rampGeometry, rampMaterial);
      obstacle.rotation.x = Math.PI / 8;
      obstacle.position.set(xPos, baseY, zPos + 1);
      scene.add(obstacle);
      this.hitboxMesh = obstacle; // Use the same mesh as hitbox for ramp
    }

    obstacle.castShadow = true;
    obstacle.userData.type = obstacleType;
    this.mesh = obstacle;
  }

  updatePosition(obstacleSpeed) {
    this.mesh.position.z += obstacleSpeed;
    if (this.hitboxMesh !== this.mesh) {
      this.hitboxMesh.position.z += obstacleSpeed;
    }
  }

  removeFromScene(scene) {
    scene.remove(this.mesh);
    if (this.hitboxMesh !== this.mesh) {
      scene.remove(this.hitboxMesh);
    }
  }

  getCollisionMesh() {
    return this.hitboxMesh;
  }
}

export { Obstacle };