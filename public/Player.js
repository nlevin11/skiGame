// Player.js

class Player {
    // constructor- creates the variables for the player
    constructor(scene) {
      // Player properties
      this.playerSpeed = 0.3;
      this.moveLeft = false;
      this.moveRight = false;
      this.movementLimit = 20;
      this.forwardSpeed = 0.2;
  
      // Create the player mesh
      const playerGeometry = new THREE.BoxGeometry(1, 2, 0.5);
      const playerMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
      this.mesh = new THREE.Mesh(playerGeometry, playerMaterial);
      this.mesh.castShadow = true;
      this.mesh.position.set(0, -1, 0); // Lowered player position
      scene.add(this.mesh);
    }
    
    // updates the position of the player
    updatePosition() {
      // Move the player forward
      this.mesh.position.z -= this.forwardSpeed;
  
      // Move the player left and right
      if (this.moveLeft) this.mesh.position.x -= this.playerSpeed;
      if (this.moveRight) this.mesh.position.x += this.playerSpeed;
  
      // Keep the player within bounds
      this.mesh.position.x = THREE.MathUtils.clamp(
        this.mesh.position.x,
        -this.movementLimit,
        this.movementLimit
      );
    }
  
    // resets the position of the player (when game resets)
    resetPosition() {
      this.mesh.position.set(0, -1, 0);
    }

  
    // handles the keydown event, triggering movement
    handleKeyDown(event) {
      if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
        this.moveLeft = true;
      }
      if (event.code === 'ArrowRight' || event.code === 'KeyD') {
        this.moveRight = true;
      }
    }
    
    // handles the keyup event, stopping movement
    handleKeyUp(event) {
      if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
        this.moveLeft = false;
      }
      if (event.code === 'ArrowRight' || event.code === 'KeyD') {
        this.moveRight = false;
      }
    }
  }
  
  // Export the Player class
  export { Player };