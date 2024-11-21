// main.js

let scene, camera, renderer;
let player;
const obstacles = [];
let isGameOver = false;
let moveLeft = false;
let moveRight = false;
const playerSpeed = 0.2;
const forwardSpeed = 0.2;
let frameCount = 0;
const obstacleFrequency = 75;
const obstacleSpeed = forwardSpeed;

function init() {
  // Create the scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xb0e0e6); // Pastel blue sky color

  // Set up the camera
  camera = new THREE.PerspectiveCamera(
    75, // Field of view
    window.innerWidth / window.innerHeight, // Aspect ratio
    0.1, // Near clipping plane
    1000 // Far clipping plane
  );
  camera.position.set(0, 5, 15);
  camera.lookAt(0, 0, 0);

  // Set up the renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);

  // Add lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(0, 50, -50);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  // Create ground plane
  const groundGeometry = new THREE.PlaneGeometry(100, 500);
  const groundMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff }); // White ground
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.5;
  ground.receiveShadow = true;
  scene.add(ground);

  // Create the player (simple geometric shape)
  const playerGeometry = new THREE.BoxGeometry(1, 2, 0.5);
  const playerMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
  player = new THREE.Mesh(playerGeometry, playerMaterial);
  player.castShadow = true;
  player.position.set(0, 1, 0);
  scene.add(player);

  // Start the animation loop
  animate();

  // Add event listeners
  window.addEventListener('resize', onWindowResize, false);
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onKeyDown(event) {
  if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
    moveLeft = true;
  }
  if (event.code === 'ArrowRight' || event.code === 'KeyD') {
    moveRight = true;
  }
}

function onKeyUp(event) {
  if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
    moveLeft = false;
  }
  if (event.code === 'ArrowRight' || event.code === 'KeyD') {
    moveRight = false;
  }
}

function gameOver() {
  isGameOver = true;
  const gameOverText = document.getElementById('game-over');
  if (gameOverText) {
    gameOverText.style.display = 'block';
  }
  document.removeEventListener('keydown', onKeyDown);
  document.removeEventListener('keyup', onKeyUp);
}

function animate() {
  if (isGameOver) return;
  requestAnimationFrame(animate);

  // Move the player forward
  player.position.z -= forwardSpeed;

  // Move the player left and right
  if (moveLeft) player.position.x -= playerSpeed;
  if (moveRight) player.position.x += playerSpeed;

  // Keep the player within bounds
  player.position.x = THREE.MathUtils.clamp(player.position.x, -5, 5);

  // Create obstacles at intervals
  frameCount++;
  if (frameCount % obstacleFrequency === 0) {
    createObstacle();
  }

  // Move obstacles towards the player
  obstacles.forEach((obstacle, index) => {
    obstacle.position.z += obstacleSpeed;

    // Collision detection
    const playerBox = new THREE.Box3().setFromObject(player);
    const obstacleBox = new THREE.Box3().setFromObject(obstacle);

    if (playerBox.intersectsBox(obstacleBox)) {
      gameOver();
    }

    // Remove obstacles that have passed the player
    if (obstacle.position.z > player.position.z + 10) {
      scene.remove(obstacle);
      obstacles.splice(index, 1);
    }
  });

  // Update the camera to follow the player
  camera.position.z = player.position.z + 15;
  camera.lookAt(player.position.x, player.position.y, player.position.z);

  renderer.render(scene, camera);
}

function createObstacle() {
  // Create a random obstacle (cube or cone)
  let obstacle;
  const obstacleType = Math.random() < 0.5 ? 'cube' : 'cone';

  if (obstacleType === 'cube') {
    // Create a cube obstacle
    const obstacleGeometry = new THREE.BoxGeometry(1, 1, 1);
    const obstacleMaterial = new THREE.MeshLambertMaterial({ color: 0x808080 });
    obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
  } else {
    // Create a cone obstacle
    const obstacleGeometry = new THREE.ConeGeometry(0.5, 2, 16);
    const obstacleMaterial = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
    obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
  }

  obstacle.castShadow = true;

  // Set position
  obstacle.position.x = (Math.random() - 0.5) * 10; // Random X position within range
  obstacle.position.y = 0.5; // Adjust based on obstacle's height
  obstacle.position.z = player.position.z - 50; // Spawn ahead of the player

  scene.add(obstacle);
  obstacles.push(obstacle);
}

// Initialize the game
init();