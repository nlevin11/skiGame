import { Player } from './Player.js';
import { Obstacle } from './Obstacle.js';

class GameManager {
  constructor() {
    // Scene, camera, renderer
    this.scene = null;
    this.camera = null;
    this.renderer = null;

    // Game objects
    this.player = null;
    this.obstacles = [];
    this.ground = null;

    // Game variables
    this.isGameOver = false;
    this.frameCount = 0;
    this.spawnDistance = 200;
    this.movementLimit = 20;
    this.groundWidth = this.movementLimit * 2;
    this.groundLength = 1000;

    // Speed and score variables
    this.score = 0;
    this.gameStartTime = Date.now(); // When the game starts
    this.lastScoreUpdateTime = Date.now(); // Last time score was updated
    this.speedIncreaseDuration = 120000; // 120 seconds in milliseconds
    this.initialPlayerSpeed = 0.2; // Initial forward speed
    this.maxSpeedMultiplier = 6; // Max multiplier for speed
    this.obstacleSpeed = 0.2; // Base obstacle speed
    this.baseObstacleFrequency = 20; // Base frame interval for spawning obstacles

    // Initialize the game
    this.init();
  }

  init() {
    // Create the scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xb0e0e6);

    // Set up the camera
    this.camera = new THREE.PerspectiveCamera(
      90,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 3, 15);
    this.camera.lookAt(0, -2, 0);

    // Set up the renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    document.body.appendChild(this.renderer.domElement);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 50, -50);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);

// Create cliff material with texture
const cliffTexture = new THREE.TextureLoader().load('Cliffs.jpg');
cliffTexture.wrapS = THREE.RepeatWrapping;
cliffTexture.wrapT = THREE.RepeatWrapping;

const cliffMaterial = new THREE.MeshLambertMaterial({ 
  color: 0x808080, 
  map: cliffTexture,
  emissive: 0x101010
});

// Left Cliff Geometry (Box)
const leftCliffGeometry = new THREE.BoxGeometry(50, 50, this.groundLength * 4);

// Modify the UVs to avoid stretching
leftCliffGeometry.computeVertexNormals();  // Ensure proper shading and lighting
const leftCliffUvs = leftCliffGeometry.attributes.uv.array;

// Scale the UVs based on the geometry's size
for (let i = 0; i < leftCliffUvs.length; i += 2) {
    leftCliffUvs[i] = leftCliffUvs[i] * (this.groundLength * 4 / 50);  // X axis scaling
    leftCliffUvs[i + 1] = leftCliffUvs[i + 1] * (this.groundLength * 4 / 50);  // Y axis scaling
}

const leftCliff = new THREE.Mesh(leftCliffGeometry, cliffMaterial);
leftCliff.position.set(-this.movementLimit - 32, 5, 0);  // Position left cliff
leftCliff.rotation.z = Math.PI / 8;  // Tilt outward (away from slope)
leftCliff.castShadow = false;
leftCliff.receiveShadow = false;
this.scene.add(leftCliff);

// Right Cliff Geometry (Box)
const rightCliffGeometry = new THREE.BoxGeometry(50, 50, this.groundLength * 4);

// Modify the UVs for the right cliff similarly
rightCliffGeometry.computeVertexNormals();  // Ensure proper shading and lighting
const rightCliffUvs = rightCliffGeometry.attributes.uv.array;

for (let i = 0; i < rightCliffUvs.length; i += 2) {
    rightCliffUvs[i] = rightCliffUvs[i] * (this.groundLength * 4 / 50);  // X axis scaling
    rightCliffUvs[i + 1] = rightCliffUvs[i + 1] * (this.groundLength * 4 / 50);  // Y axis scaling
}

const rightCliff = new THREE.Mesh(rightCliffGeometry, cliffMaterial);
rightCliff.position.set(this.movementLimit + 32, 5, 0);  // Position right cliff
rightCliff.rotation.z = -Math.PI / 8;  // Tilt outward (away from slope)
rightCliff.castShadow = false;
rightCliff.receiveShadow = false;
this.scene.add(rightCliff);

// Create bounding boxes for cliffs
const leftCliffBox = new THREE.Box3().setFromObject(leftCliff);
const rightCliffBox = new THREE.Box3().setFromObject(rightCliff);


    // Create extended ground plane
    const groundGeometry = new THREE.PlaneGeometry(this.groundWidth, this.groundLength * 2); // Doubled length
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
    this.ground.rotation.x = -Math.PI / 2;
    this.ground.position.y = -2.5;
    this.ground.receiveShadow = true;
    this.scene.add(this.ground);


    // Create the player
    this.player = new Player(this.scene);
    this.player.forwardSpeed = this.initialPlayerSpeed; // Set initial speed

    // Pre-spawn obstacles
    this.preSpawnObstacles();

    // Start the animation loop
    this.animate();

    // Add event listeners
    window.addEventListener('resize', () => this.onWindowResize(), false);
    document.addEventListener('keydown', (event) => this.player.handleKeyDown(event));
    document.addEventListener('keyup', (event) => this.player.handleKeyUp(event));

    const restartButton = document.getElementById('restart-button');
    if (restartButton) {
      restartButton.addEventListener('click', () => this.resetGame());
    }

    this.updateScoreDisplay();
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  gameOver() {
    this.isGameOver = true;
    const gameOverScreen = document.getElementById('game-over');
    if (gameOverScreen) {
      gameOverScreen.style.display = 'block';
    }
    document.removeEventListener('keydown', (event) => this.player.handleKeyDown(event));
    document.removeEventListener('keyup', (event) => this.player.handleKeyUp(event));
  }

  resetGame() {
    this.isGameOver = false;
    this.frameCount = 0;
    this.score = 0;
    this.gameStartTime = Date.now();
    this.lastScoreUpdateTime = Date.now();

    // Remove all obstacles from the scene
    this.obstacles.forEach((obstacle) => {
      obstacle.removeFromScene(this.scene);
    });
    this.obstacles.length = 0;

    // Reset player position and speed
    this.player.resetPosition();
    this.player.forwardSpeed = this.initialPlayerSpeed;

    const gameOverScreen = document.getElementById('game-over');
    if (gameOverScreen) {
      gameOverScreen.style.display = 'none';
    }

    // Restart animation loop
    this.animate();

    // Re-add event listeners
    document.addEventListener('keydown', (event) => this.player.handleKeyDown(event));
    document.addEventListener('keyup', (event) => this.player.handleKeyUp(event));

    this.updateScoreDisplay();

    // Pre-spawn obstacles
    this.preSpawnObstacles();
  }

  checkCollision(playerMesh, obstacleMesh, obstaclePrevPosition, obstacleNewPosition) {
    const playerBox = new THREE.Box3().setFromObject(playerMesh);
    const obstacleBox = new THREE.Box3().setFromObject(obstacleMesh);

    // Low-speed collision detection (bounding box)
    if (playerBox.intersectsBox(obstacleBox)) {
      return true;
    }

    // High-speed collision detection (raycasting)
    const obstaclePath = new THREE.Ray(
      obstaclePrevPosition,
      new THREE.Vector3().subVectors(obstacleNewPosition, obstaclePrevPosition).normalize()
    );

    const distanceTraveled = obstaclePrevPosition.distanceTo(obstacleNewPosition);
    const intersection = obstaclePath.intersectBox(playerBox);

    if (intersection && intersection.distance <= distanceTraveled) {
      return true;
    }

    return false;
  }


  animate() {
    if (this.isGameOver) return;
    requestAnimationFrame(() => this.animate());

    const elapsedTime = Date.now() - this.gameStartTime;
    const speedMultiplier = 1 + (Math.min(elapsedTime / this.speedIncreaseDuration, 1) * (this.maxSpeedMultiplier - 1));

    // Update player and obstacle speeds
    this.player.forwardSpeed = this.initialPlayerSpeed * speedMultiplier;
    this.obstacleSpeed = 0.2 * speedMultiplier;

    this.player.updatePosition();

    // Spawn obstacles dynamically
    this.frameCount++;
    const obstacleFrequency = Math.max(Math.floor(this.baseObstacleFrequency / speedMultiplier), 1);
    if (this.frameCount % obstacleFrequency === 0) {
      this.createObstacle();
    }


    // Handle obstacle movements and collision detection
    this.obstacles.forEach((obstacle, index) => {
      const previousPosition = obstacle.mesh.position.clone();
      obstacle.updatePosition(this.obstacleSpeed);
      const currentPosition = obstacle.mesh.position.clone();

      // Check for collision
      const isCollision = this.checkCollision(
        this.player.mesh,
        obstacle.mesh,
        previousPosition,
        currentPosition
      );

      if (isCollision) {
        this.gameOver();
      }

      // Collision detection for cliffs based on X-axis position and the player's bounds
if (
  (this.player.mesh.position.x <= -this.movementLimit) ||
  (this.player.mesh.position.x >= this.movementLimit)
) {
  this.gameOver(); // Player collides with a cliff
}


      // Remove obstacles that are out of view
      if (obstacle.mesh.position.z > this.player.mesh.position.z + 50) {
        obstacle.removeFromScene(this.scene);
        this.obstacles.splice(index, 1);
      }


    });

    // Update the camera to follow the player
    this.camera.position.x = this.player.mesh.position.x; // Match player's horizontal movement
    this.camera.position.z = this.player.mesh.position.z + 15; // Keep a fixed distance behind
    this.camera.position.y = 3; // Maintain a consistent height

    // Ensure the camera looks slightly ahead of the player
    const lookAheadDistance = 5;
    this.camera.lookAt(
      this.player.mesh.position.x,
      this.player.mesh.position.y + 2,
      this.player.mesh.position.z - lookAheadDistance
    );
    this.ground.position.z = this.player.mesh.position.z; // Center ground under the player


    // Update the score
    const currentTime = Date.now();
    const deltaTime = (currentTime - this.lastScoreUpdateTime) / 1000;
    if (deltaTime >= (1 / speedMultiplier)) {
      this.score += 1;
      this.lastScoreUpdateTime = currentTime;
      this.updateScoreDisplay();
    }

    // Render the scene
    this.renderer.render(this.scene, this.camera);
  }


  createObstacle(offset = 0) {
    const obstacle = new Obstacle(
      this.scene,
      this.movementLimit,
      this.player.mesh.position.z,
      this.spawnDistance,
      offset
    );
    this.obstacles.push(obstacle);
  }

  preSpawnObstacles() {
    const numObstacles = Math.ceil(
      this.spawnDistance / (this.baseObstacleFrequency * this.obstacleSpeed)
    );
    for (let i = 0; i < numObstacles; i++) {
      this.createObstacle(i * this.baseObstacleFrequency * this.obstacleSpeed);
    }
  }

  updateScoreDisplay() {
    const scoreDisplay = document.getElementById('score-display');
    if (scoreDisplay) {
      scoreDisplay.textContent = `Score: ${Math.floor(this.score)}`;
    }
  }
}

// Export the GameManager class
export { GameManager };
