import { ModelsLoader } from './ModelsLoader.js';

class Player {
    constructor(scene) {
        // Existing properties
        this.playerSpeed = 0.3;
        this.moveLeft = false;
        this.moveRight = false;
        this.movementLimit = 20;
        this.forwardSpeed = 0.2;

        // Jump properties
        this.isJumping = false;
        this.jumpHeight = 0;
        this.jumpVelocity = 0;
        this.gravity = 0.015;
        this.baseY = -.2;

        // New property for speed boost
        this.isBoosting = false;
        
        // Create a temporary box while model loads
        const playerGeometry = new THREE.BoxGeometry(1, 2, 0.5);
        const playerMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
        this.mesh = new THREE.Mesh(playerGeometry, playerMaterial);
        this.mesh.castShadow = true;
        this.mesh.position.set(0, this.baseY, 0);
        scene.add(this.mesh);

        // Load the skier model if available
        this.loadSkierModel(scene);
    }

    async loadSkierModel(scene) {
        const modelsLoader = new ModelsLoader();
        try {
            const model = await modelsLoader.loadModel('assets/models/skiWithColor.glb', 'skier');
            if (model) {
                // Remove the temporary box
                scene.remove(this.mesh);

                // Set up the model
                this.mesh = model;
                this.mesh.scale.set(2, 2, 2); // Adjust scale to match box size
                this.mesh.position.set(0, this.baseY, 0);
                this.mesh.rotation.y = Math.PI; // Rotate to face forward
                this.mesh.castShadow = true;

                // Add to scene
                scene.add(this.mesh);
                console.log('Skier model loaded successfully');
            }
        } catch (error) {
            console.warn('Failed to load skier model, keeping default box:', error);
        }
    }
    
    initiateJump() {
        if (!this.isJumping) {
            this.isJumping = true;
            this.jumpVelocity = 0.3 + Math.random() * 0.2;
        }
    }
    
    updatePosition() {
        // Move forward, with boost factor
        const boostFactor = this.isBoosting ? 1.5 : 1.0;
        this.mesh.position.z -= this.forwardSpeed * boostFactor;
        
        // Horizontal movement and lean
        if (this.moveLeft) {
            this.mesh.position.x -= this.playerSpeed;
            this.mesh.rotation.z = Math.min(this.mesh.rotation.z + 0.1, 0.3);
        } else if (this.moveRight) {
            this.mesh.position.x += this.playerSpeed;
            this.mesh.rotation.z = Math.max(this.mesh.rotation.z - 0.1, -0.3);
        } else {
            // Return to upright position horizontally
            this.mesh.rotation.z *= 0.9;
        }
        
        // Jump physics
        if (this.isJumping) {
            this.jumpVelocity -= this.gravity;
            this.mesh.position.y += this.jumpVelocity;
    
            // Add forward tilt during jump
            this.mesh.rotation.x = -this.jumpVelocity * 2;
    
            if (this.mesh.position.y <= this.baseY) {
                this.mesh.position.y = this.baseY;
                this.mesh.rotation.x = 0;
                this.isJumping = false;
                this.jumpVelocity = 0;
            }
        } else {
            // If not jumping, tilt forward if boosting
            if (this.isBoosting) {
                // Slight forward lean
                // Adjust angle as desired, e.g., -0.1 radians (~ -5.7 degrees)
                this.mesh.rotation.x = -0.5;
            } else {
                // No boost, return to upright position
                // Smoothly return rotation.x to 0 if needed, or directly set it
                this.mesh.rotation.x *= 0.9;
                if (Math.abs(this.mesh.rotation.x) < 0.01) {
                    this.mesh.rotation.x = 0;
                }
            }
        }
    
        // Clamp horizontal position
        this.mesh.position.x = THREE.MathUtils.clamp(
            this.mesh.position.x,
            -this.movementLimit,
            this.movementLimit
        );
    }
    
    resetPosition() {
        this.mesh.position.set(0, this.baseY, 0);
        this.mesh.rotation.set(0, Math.PI, 0); // Reset rotation, keeping forward orientation
        this.isJumping = false;
        this.jumpVelocity = 0;
    }

  
    // handles the keydown event, triggering movement
    handleKeyDown(event) {
        if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
            this.moveLeft = true;
        }
        if (event.code === 'ArrowRight' || event.code === 'KeyD') {
            this.moveRight = true;
        }
        // If W or Up Arrow is pressed, activate boost
        if (event.code === 'ArrowUp' || event.code === 'KeyW') {
            this.isBoosting = true;
        }
    }
    
    handleKeyUp(event) {
        if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
            this.moveLeft = false;
        }
        if (event.code === 'ArrowRight' || event.code === 'KeyD') {
            this.moveRight = false;
        }
        // If W or Up Arrow is released, deactivate boost
        if (event.code === 'ArrowUp' || event.code === 'KeyW') {
            this.isBoosting = false;
        }
    }
}

export { Player };