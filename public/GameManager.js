// GameManager.js

import { Player } from './Player.js';
import { Obstacle } from './Obstacle.js';

class GameManager {
  //creates all the variables in the game
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
    this.obstacleFrequency = 20;
    this.obstacleSpeed = 0.2;
    this.spawnDistance = 200;
    this.movementLimit = 20;
    this.groundWidth = this.movementLimit * 2;
    this.groundLength = 1000;

    // Score variables
    this.score = 0;
    this.scoreRate = 1;
    this.lastScoreUpdateTime = Date.now();

    // Initialize the game
    this.init();
  }
  // initializes the game, including the backround, camera, player,
  // obstacles, event listeners, lighting, ground, and score.
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

    // Create ground plane
    const groundGeometry = new THREE.PlaneGeometry(this.groundWidth, this.groundLength);
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
    this.ground.rotation.x = -Math.PI / 2;
    this.ground.position.y = -2.5;
    this.ground.receiveShadow = true;
    this.scene.add(this.ground);

    // Create the player
    this.player = new Player(this.scene);

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
  // ends the game and displays the game over screen (including restart button)
  gameOver() {
    this.isGameOver = true;
    const gameOverScreen = document.getElementById('game-over');
    if (gameOverScreen) {
      gameOverScreen.style.display = 'block';
    }
    document.removeEventListener('keydown', (event) => this.player.handleKeyDown(event));
    document.removeEventListener('keyup', (event) => this.player.handleKeyUp(event));
  }
  // resets the game, including the game over screen, obstacles, player position, score, and score rate.
  resetGame() {
    this.isGameOver = false;
    this.frameCount = 0;
    this.score = 0;
    this.scoreRate = 1;
    this.lastScoreUpdateTime = Date.now();

    // Remove all obstacles from the scene
    this.obstacles.forEach((obstacle) => {
      obstacle.removeFromScene(this.scene);
    });
    this.obstacles.length = 0;

    // Reset player position
    this.player.resetPosition();

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

  // animates the game, including updating the player position, creating obstacles, moving obstacles, 
  // collision detection, camera position, ground position, score, and rendering the scene.
  animate() {
    if (this.isGameOver) return;
    requestAnimationFrame(() => this.animate());

    this.player.updatePosition();

    // Create obstacles at intervals
    this.frameCount++;
    if (this.frameCount % this.obstacleFrequency === 0) {
      this.createObstacle();
    }

    // Move obstacles towards the player
    this.obstacles.forEach((obstacle, index) => {
      obstacle.updatePosition(this.obstacleSpeed);

      // Collision detection
      const playerBox = new THREE.Box3().setFromObject(this.player.mesh);
      const obstacleBox = new THREE.Box3().setFromObject(obstacle.mesh);

      if (playerBox.intersectsBox(obstacleBox)) {
        this.gameOver();
      }

      // Remove obstacles that have passed the player
      if (obstacle.mesh.position.z > this.player.mesh.position.z + 50) {
        obstacle.removeFromScene(this.scene);
        this.obstacles.splice(index, 1);
      }
    });

    // Update the camera to follow the player
    this.camera.position.z = this.player.mesh.position.z + 15;
    this.camera.lookAt(
      this.player.mesh.position.x,
      this.player.mesh.position.y + 2,
      this.player.mesh.position.z
    );

    // Update ground position to follow the player
    this.ground.position.z = this.player.mesh.position.z - this.groundLength / 2;

    // Update the score
    const currentTime = Date.now();
    const deltaTime = (currentTime - this.lastScoreUpdateTime) / 1000;
    if (deltaTime >= 1) {
      this.score += this.scoreRate;
      this.lastScoreUpdateTime = currentTime;

      if (this.scoreRate < 10) {
        this.scoreRate += 1;
      }

      this.updateScoreDisplay();
    }

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
      this.spawnDistance / (this.obstacleFrequency * this.obstacleSpeed)
    );
    for (let i = 0; i < numObstacles; i++) {
      this.createObstacle(i * this.obstacleFrequency * this.obstacleSpeed);
    }
  }

  updateScoreDisplay() {
    const scoreDisplay = document.getElementById('score-display');
    if (scoreDisplay) {
      scoreDisplay.textContent = `Score: ${this.score}`;
    }
  }
}

// Export the GameManager class
export { GameManager };