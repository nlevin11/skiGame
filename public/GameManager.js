import { Player } from './Player.js';
import { Obstacle } from './Obstacle.js';
import { Cliffs } from './Cliffs.js';
import { ModelsLoader } from './ModelsLoader.js';

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
    this.cliffs = null;
    this.modelsLoader = new ModelsLoader();

    // Game variables
    this.isGameOver = false;
    this.frameCount = 0;
    this.spawnDistance = 200;
    this.movementLimit = 20;
    this.groundWidth = this.movementLimit * 2;
    this.groundLength = 1000;

    // Speed and score variables
    this.score = 0;
    this.gameStartTime = Date.now();
    this.lastScoreUpdateTime = Date.now();
    this.speedIncreaseDuration = 100000;
    this.initialPlayerSpeed = 0.2;
    this.maxSpeedMultiplier = 6;
    this.obstacleSpeed = 0.2;
    this.baseObstacleFrequency = 20;

    // Initialize the game
    this.init();
  }

  async init() {
    // Create the scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xb0e0e6);

    // Set up the camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 3.5, 9);
    this.camera.lookAt(0, -1, 0);

    // Set up the renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    document.body.appendChild(this.renderer.domElement);

    // Load 3D models
    try {
      await Promise.all([
        this.modelsLoader.loadModel('assets/models/tree.glb', 'tree'),
        this.modelsLoader.loadModel('assets/models/rock.glb', 'rock')
      ]);
      console.log('Models loaded successfully');
    } catch (error) {
      console.warn('Failed to load models, using fallback geometries:', error);
    }

    // Continue with scene setup
    this.setupScene();
  }

  setupScene() {
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 50, -50);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);

    // Add cliffs
    this.cliffs = new Cliffs(this.scene, this.groundLength, this.movementLimit);

    // Create extended ground plane
    const groundGeometry = new THREE.PlaneGeometry(this.groundWidth, this.groundLength * 2);
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
    this.ground.rotation.x = -Math.PI / 2;
    this.ground.position.y = -2.5;
    this.ground.receiveShadow = true;
    this.scene.add(this.ground);

    // Create the player
    this.player = new Player(this.scene);
    this.player.forwardSpeed = this.initialPlayerSpeed;

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
    
    // Show game over text
    const gameOverScreen = document.getElementById('game-over');
    if (gameOverScreen) {
      gameOverScreen.style.display = 'block';
    }

    // Show restart button
    const restartButton = document.getElementById('restart-button');
    if (restartButton) {
      restartButton.style.display = 'block';
    }

    // Remove event listeners
    document.removeEventListener('keydown', (event) => this.player.handleKeyDown(event));
    document.removeEventListener('keyup', (event) => this.player.handleKeyUp(event));
  }

  async resetGame() {
    this.isGameOver = false;
    this.frameCount = 0;
    this.score = 0;
    this.gameStartTime = Date.now();
    this.lastScoreUpdateTime = Date.now();

    // Hide game over elements
    const gameOverScreen = document.getElementById('game-over');
    if (gameOverScreen) {
      gameOverScreen.style.display = 'none';
    }

    const restartButton = document.getElementById('restart-button');
    if (restartButton) {
      restartButton.style.display = 'none';
    }

    // Remove all obstacles from the scene
    this.obstacles.forEach((obstacle) => {
      obstacle.removeFromScene(this.scene);
    });
    this.obstacles.length = 0;

    // Reset player position and speed
    this.player.resetPosition();
    this.player.forwardSpeed = this.initialPlayerSpeed;

    // Restart animation loop
    this.animate();

    // Re-add event listeners
    document.addEventListener('keydown', (event) => this.player.handleKeyDown(event));
    document.addEventListener('keyup', (event) => this.player.handleKeyUp(event));

    this.updateScoreDisplay();

    // Pre-spawn obstacles
    this.preSpawnObstacles();
  }

  checkCollision(playerMesh, obstacle, obstaclePrevPosition, obstacleNewPosition) {
    // First check if it's a jump ramp
    if (obstacle.userData.type === 'jump') {
      const playerBox = new THREE.Box3().setFromObject(playerMesh);
      const obstacleBox = new THREE.Box3().setFromObject(obstacle);
      
      if (playerBox.intersectsBox(obstacleBox)) {
        this.player.initiateJump();
        return false;
      }
    }

    // For other obstacles, use the hitbox if available
    const collisionMesh = obstacle.hitboxMesh || obstacle;
    const playerBox = new THREE.Box3().setFromObject(playerMesh);
    const obstacleBox = new THREE.Box3().setFromObject(collisionMesh);

    if (playerBox.intersectsBox(obstacleBox)) {
      return true;
    }

    const obstaclePath = new THREE.Ray(
      obstaclePrevPosition,
      new THREE.Vector3().subVectors(obstacleNewPosition, obstaclePrevPosition).normalize()
    );

    const distanceTraveled = obstaclePrevPosition.distanceTo(obstacleNewPosition);
    const intersection = obstaclePath.intersectBox(playerBox);

    return intersection && intersection.distance <= distanceTraveled;
  }

  animate() {
    if (this.isGameOver) return;
    requestAnimationFrame(() => this.animate());

    const elapsedTime = Date.now() - this.gameStartTime;
    const speedMultiplier = 1 + (Math.min(elapsedTime / this.speedIncreaseDuration, 1) * (this.maxSpeedMultiplier - 1));

    this.player.forwardSpeed = this.initialPlayerSpeed * speedMultiplier;
    this.player.updatePosition();

    this.frameCount++;
    const obstacleFrequency = Math.max(Math.floor(this.baseObstacleFrequency / speedMultiplier), 1);
    if (this.frameCount % obstacleFrequency === 0) {
      this.createObstacle();
    }

    this.obstacles.forEach((obstacle, index) => {
      const previousPosition = obstacle.mesh.position.clone();
      obstacle.updatePosition(this.obstacleSpeed);
      const currentPosition = obstacle.mesh.position.clone();

      const isCollision = this.checkCollision(
        this.player.mesh,
        obstacle.mesh,
        previousPosition,
        currentPosition
      );

      if (isCollision) {
        this.gameOver();
      }

      if (
        (this.player.mesh.position.x <= -this.movementLimit) ||
        (this.player.mesh.position.x >= this.movementLimit)
      ) {
        this.gameOver();
      }

      if (obstacle.mesh.position.z > this.player.mesh.position.z + 50) {
        obstacle.removeFromScene(this.scene);
        this.obstacles.splice(index, 1);
      }


    });

    this.camera.position.x = this.player.mesh.position.x;
    this.camera.position.z = this.player.mesh.position.z + 15;
    this.camera.position.y = 3;

    const lookAheadDistance = 5;
    this.camera.lookAt(
      this.player.mesh.position.x,
      this.player.mesh.position.y + 2,
      this.player.mesh.position.z - lookAheadDistance
    );
    this.ground.position.z = this.player.mesh.position.z;

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
      this.modelsLoader,
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

export { GameManager };
