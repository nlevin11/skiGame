class Obstacle {
  constructor(scene, movementLimit, playerPositionZ, spawnDistance, modelsLoader, offset = 0) {
    let obstacle;
    const obstacleType = Math.random() < 0.33 ? 'tree' : 
                        Math.random() < 0.66 ? 'rock' : 'jump';

    if (obstacleType === 'tree' || obstacleType === 'rock') {
      // Get the corresponding model
      const model = modelsLoader.getModel(obstacleType);
      if (model) {
        obstacle = model.clone();
        
        // Visual scaling remains large
        if (obstacleType === 'tree') {
          const scale = 2.0;
          obstacle.scale.set(scale, scale, scale);
        } else { // rock
          const scale = 1.5;
          obstacle.scale.set(scale, scale, scale);
        }

        // Create invisible hitbox mesh
        const hitboxSize = obstacleType === 'tree' ? 0.6 : 0.8; // Smaller hitbox sizes
        const hitboxGeometry = new THREE.BoxGeometry(hitboxSize, hitboxSize, hitboxSize);
        const hitboxMaterial = new THREE.MeshBasicMaterial({
          visible: false // Make hitbox invisible
        });
        this.hitboxMesh = new THREE.Mesh(hitboxGeometry, hitboxMaterial);
        
        // Position hitbox at the base center of the visual model
        this.hitboxMesh.position.copy(obstacle.position);
        if (obstacleType === 'tree') {
          this.hitboxMesh.position.y = -1.5; // Adjust based on your needs
        } else {
          this.hitboxMesh.position.y = -1.2; // Adjust for rocks
        }
        
        scene.add(this.hitboxMesh);
      } else {
        // Fallback geometric shapes with smaller hitboxes
        console.warn(`${obstacleType} model not loaded, using fallback geometry`);
        if (obstacleType === 'tree') {
          // Visual mesh
          const visualGeometry = new THREE.ConeGeometry(1.0, 4, 16);
          const visualMaterial = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
          obstacle = new THREE.Mesh(visualGeometry, visualMaterial);
          
          // Hitbox mesh
          const hitboxGeometry = new THREE.BoxGeometry(0.6, 0.6, 0.6);
          const hitboxMaterial = new THREE.MeshBasicMaterial({ visible: false });
          this.hitboxMesh = new THREE.Mesh(hitboxGeometry, hitboxMaterial);
          this.hitboxMesh.position.y = -1.5;
        } else {
          // Visual mesh
          const visualGeometry = new THREE.BoxGeometry(2, 2, 2);
          const visualMaterial = new THREE.MeshLambertMaterial({ color: 0x808080 });
          obstacle = new THREE.Mesh(visualGeometry, visualMaterial);
          
          // Hitbox mesh
          const hitboxGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
          const hitboxMaterial = new THREE.MeshBasicMaterial({ visible: false });
          this.hitboxMesh = new THREE.Mesh(hitboxGeometry, hitboxMaterial);
          this.hitboxMesh.position.y = -1.2;
        }
        scene.add(this.hitboxMesh);
      }
    } else { // jump ramp
      const rampGeometry = new THREE.BoxGeometry(4, 0.5, 2);
      const rampMaterial = new THREE.MeshLambertMaterial({ color: 0xffd700 });
      obstacle = new THREE.Mesh(rampGeometry, rampMaterial);
      obstacle.rotation.x = Math.PI / 8;
      obstacle.position.z += 1;
      this.hitboxMesh = obstacle; // For jump ramps, use the same mesh for hitbox
    }

    obstacle.castShadow = true;
    obstacle.userData.type = obstacleType;

    // Position both visual and hitbox
    const xPos = (Math.random() - 0.5) * movementLimit * 2;
    const zPos = playerPositionZ - spawnDistance + offset;
    
    obstacle.position.x = xPos;
    obstacle.position.y = obstacleType === 'jump' ? -2 : -1;
    obstacle.position.z = zPos;
    
    if (this.hitboxMesh !== obstacle) {
      this.hitboxMesh.position.x = xPos;
      this.hitboxMesh.position.z = zPos;
    }

    scene.add(obstacle);
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

  // Method to get the collision mesh for hit detection
  getCollisionMesh() {
    return this.hitboxMesh;
  }
}

export { Obstacle };