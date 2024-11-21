let scene, camera, renderer;
let player;
const obstacles = [];
let isGameOver = false;
let moveLeft = false;
let moveRight = false;
const playerSpeed = 0.3;
const forwardSpeed = 0.2;
let frameCount = 0;
const obstacleFrequency = 30;
const obstacleSpeed = forwardSpeed;
let ground;
const movementLimit = 20;

let groundWidth;
let groundLength;

const spawnDistance = 200;

let score = 0;
let scoreRate = 1;
let lastScoreUpdateTime = Date.now();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xb0e0e6);

  camera = new THREE.PerspectiveCamera(
    90,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 3, 15);
  camera.lookAt(0, -2, 0); // Adjusted to look lower

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(0, 50, -50);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  groundWidth = movementLimit * 2;
  groundLength = 1000;

  const groundGeometry = new THREE.PlaneGeometry(groundWidth, groundLength);
  const groundMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
  ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -2.5; // Lowered ground position
  ground.receiveShadow = true;
  scene.add(ground);

  const playerGeometry = new THREE.BoxGeometry(1, 2, 0.5);
  const playerMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
  player = new THREE.Mesh(playerGeometry, playerMaterial);
  player.castShadow = true;
  player.position.set(0, -1, 0); // Lowered player position
  scene.add(player);

  preSpawnObstacles();

  animate();

  window.addEventListener('resize', onWindowResize, false);
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);

  const restartButton = document.getElementById('restart-button');
  if (restartButton) {
    restartButton.addEventListener('click', resetGame);
  }

  updateScoreDisplay();
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
  const gameOverScreen = document.getElementById('game-over');
  if (gameOverScreen) {
    gameOverScreen.style.display = 'block';
  }
  document.removeEventListener('keydown', onKeyDown);
  document.removeEventListener('keyup', onKeyUp);
}

function resetGame() {
  isGameOver = false;
  moveLeft = false;
  moveRight = false;
  frameCount = 0;
  score = 0;
  scoreRate = 1;
  lastScoreUpdateTime = Date.now();

  obstacles.forEach((obstacle) => {
    scene.remove(obstacle);
  });
  obstacles.length = 0;

  player.position.set(0, -1, 0); // Reset to new lower position

  const gameOverScreen = document.getElementById('game-over');
  if (gameOverScreen) {
    gameOverScreen.style.display = 'none';
  }

  animate();

  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);

  updateScoreDisplay();

  preSpawnObstacles();
}

function animate() {
  if (isGameOver) return;
  requestAnimationFrame(animate);

  player.position.z -= forwardSpeed;

  if (moveLeft) player.position.x -= playerSpeed;
  if (moveRight) player.position.x += playerSpeed;

  player.position.x = THREE.MathUtils.clamp(
    player.position.x,
    -movementLimit,
    movementLimit
  );

  frameCount++;
  if (frameCount % obstacleFrequency === 0) {
    createObstacle();
  }

  obstacles.forEach((obstacle, index) => {
    obstacle.position.z += obstacleSpeed;

    const playerBox = new THREE.Box3().setFromObject(player);
    const obstacleBox = new THREE.Box3().setFromObject(obstacle);

    if (playerBox.intersectsBox(obstacleBox)) {
      gameOver();
    }

    if (obstacle.position.z > player.position.z + 50) {
      scene.remove(obstacle);
      obstacles.splice(index, 1);
    }
  });

  camera.position.z = player.position.z + 15;
  camera.lookAt(player.position.x, player.position.y + 2, player.position.z);

  ground.position.z = player.position.z - groundLength / 2;

  const currentTime = Date.now();
  const deltaTime = (currentTime - lastScoreUpdateTime) / 1000;
  if (deltaTime >= 1) {
    score += scoreRate;
    lastScoreUpdateTime = currentTime;

    if (scoreRate < 10) {
      scoreRate += 1;
    }

    updateScoreDisplay();
  }

  renderer.render(scene, camera);
}

function createObstacle(offset = 0) {
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
  obstacle.position.y = -1; // Adjusted obstacle height to match player
  obstacle.position.z = player.position.z - spawnDistance + offset;

  scene.add(obstacle);
  obstacles.push(obstacle);
}

function preSpawnObstacles() {
  const numObstacles = Math.ceil(spawnDistance / (obstacleFrequency * obstacleSpeed));
  for (let i = 0; i < numObstacles; i++) {
    createObstacle(i * obstacleFrequency * obstacleSpeed);
  }
}

function updateScoreDisplay() {
  const scoreDisplay = document.getElementById('score-display');
  if (scoreDisplay) {
    scoreDisplay.textContent = `Score: ${score}`;
  }
}

init();