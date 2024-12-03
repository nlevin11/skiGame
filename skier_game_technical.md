# Technology Stack

## JavaScript and Three.js

This game is developed using **JavaScript** and the **Three.js** library, which provides a powerful framework for creating 3D graphics in the browser.

### Pros

- Enables development of 3D games directly in the browser.
- Extensive documentation and a large community for support.
- Integration with standard web technologies (HTML, CSS, JavaScript).
- Cross-platform compatibility without the need for additional plugins.

### Cons

- Requires understanding of 3D graphics concepts.
- Performance can vary across different browsers and devices.
- Debugging and performance optimization can be more complex compared to 2D games.

---

# Architecture

## 1. GameManager - P0

### Variables

- `scene: THREE.Scene`  
  The main scene where all objects are added.

- `camera: THREE.PerspectiveCamera`  
  The camera through which the player views the scene.

- `renderer: THREE.WebGLRenderer`  
  Responsible for rendering the scene to the screen.

- `player: Player`  
  The player object.

- `obstacles: Obstacle[]`  
  An array holding all the obstacles in the game.

- `ground: THREE.Mesh`  
  The ground plane mesh.

- `isGameOver: boolean`  
  Tracks whether the game is over.

- `frameCount: number`  
  Used to control the frequency of obstacle spawning.

- `obstacleFrequency: number`  
  Determines how often obstacles spawn.

- `obstacleSpeed: number`  
  The speed at which obstacles move towards the player.

- `spawnDistance: number`  
  The distance ahead of the player where obstacles are spawned.

- `movementLimit: number`  
  The limit of the player’s movement along the x-axis.

- `groundWidth: number`  
  The width of the ground plane.

- `groundLength: number`  
  The length of the ground plane.

- `score: number`  
  The current game score.

- `scoreRate: number`  
  The rate at which the score increases.

- `lastScoreUpdateTime: number`  
  Timestamp of the last score update.

### Methods

- `init()`  
  Initializes the game by setting up the scene, camera, renderer, player, ground, and event listeners.

- `onWindowResize()`  
  Adjusts the camera and renderer when the window is resized.

- `animate()`  
  The main game loop that updates the game state and renders the scene.

- `gameOver()`  
  Handles the game over state by displaying the game over screen and stopping the game loop.

- `resetGame()`  
  Resets the game state to allow the player to play again.

- `createObstacle(offset: number = 0)`  
  Creates a new obstacle and adds it to the scene.

- `preSpawnObstacles()`  
  Pre-populates obstacles ahead of the player at game start.

- `updateScoreDisplay()`  
  Updates the score display on the screen.

---

## 2. Player - P0

### Variables

- `mesh: THREE.Mesh`  
  The 3D mesh representing the player in the scene.

- `playerSpeed: number`  
  The speed at which the player moves left and right.

- `moveLeft: boolean`  
  Indicates if the player is moving left.

- `moveRight: boolean`  
  Indicates if the player is moving right.

- `movementLimit: number`  
  The limit of the player’s movement along the x-axis.

- `forwardSpeed: number`  
  The speed at which the player moves forward along the z-axis.

### Methods

- `updatePosition()`  
  Updates the player’s position based on input and movement limits.

- `resetPosition()`  
  Resets the player’s position to the starting point.

- `handleKeyDown(event: KeyboardEvent)`  
  Handles key down events to update movement flags.

- `handleKeyUp(event: KeyboardEvent)`  
  Handles key up events to update movement flags.

---

## 3. Obstacle - P0

### Variables

- `mesh: THREE.Mesh`  
  The 3D mesh representing the obstacle in the scene.

### Methods

- `constructor(scene: THREE.Scene, movementLimit: number, playerPositionZ: number, spawnDistance: number, offset: number = 0)`  
  Initializes a new obstacle, sets its position, and adds it to the scene.

- `updatePosition(obstacleSpeed: number)`  
  Updates the obstacle’s position based on the obstacle speed.

- `removeFromScene(scene: THREE.Scene)`  
  Removes the obstacle from the scene when it is no longer needed.

  ## 4. Main - P0

  - Intializes the GameManager
  - Used to connect the seperate classes seamlessly to index.html

# Data Model - Figma

![https://www.figma.com/board/L0nXQ4z3IX9u74hGSFa0Jw/SkiGame?node-id=0-1&t=clHQslNUtwlaMGRS-1](https://www.figma.com/board/L0nXQ4z3IX9u74hGSFa0Jw/SkiGame?node-id=0-1&t=clHQslNUtwlaMGRS-1)