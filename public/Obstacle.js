// Obstacle.js

class Obstacle {
    // constructor- creates the variables for the obstacle, including the type of obstacle (rock or tree)
    constructor(scene, movementLimit, playerPositionZ, spawnDistance, offset = 0) {
      // Create a random obstacle (cube or cone)
      let obstacle;
      const obstacleType = Math.random() < 0.5 ? 'cube' : 'cone';
  
      if (obstacleType === 'cube') {
        const obstacleGeometry = new THREE.BoxGeometry(1, 1, 1);
        const obstacleMaterial = new THREE.MeshLambertMaterial({ color: 0x808080 });
        obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
      } else {
        const obstacleGeometry = new THREE.ConeGeometry(0.5, 2, 16);
        const obstacleMaterial = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
        obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
      }
  
      obstacle.castShadow = true;
  
      obstacle.position.x = (Math.random() - 0.5) * movementLimit * 2;
      obstacle.position.y = -1;
      obstacle.position.z = playerPositionZ - spawnDistance + offset;
  
      scene.add(obstacle);
      this.mesh = obstacle;
    }
  
    //updates the position of the obstacle
    updatePosition(obstacleSpeed) {
      this.mesh.position.z += obstacleSpeed;
    }
  
    //removes the obstacle from the scene (called when it is no longer visible)
    removeFromScene(scene) {
      scene.remove(this.mesh);
    }
  }
  
  // Export the Obstacle class
  export { Obstacle };