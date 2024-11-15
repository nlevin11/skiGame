// Scripts/Main.js
import { GameManager } from "./GameManager.js";
import { Player } from "./Player.js";
import { LevelManager } from "./LevelManager.js";

let gameManager;
let player;
let levelManager;

runOnStartup(async runtime => {
  gameManager = new GameManager(runtime);

  runtime.addEventListener("layoutstart", () => {
    const currentLayoutName = runtime.layout.name;

    if (currentLayoutName === "GameLayout") {
      // Initialize Player
      player = new Player(runtime, gameManager);
      player.createInstance();

      // Initialize Level Manager
      levelManager = new LevelManager(runtime, gameManager);

      // Get Score Text Instance
      const scoreTextInstances = runtime.objects.ScoreText.getAllInstances();
      if (scoreTextInstances.length > 0) {
        gameManager.setScoreTextInstance(scoreTextInstances[0]);
      }

      // Set up event listeners
      setupControls(runtime);
    }
  });

  runtime.addEventListener("beforetick", () => {
    if (runtime.layout.name === "GameLayout" && gameManager.isInGame) {
      levelManager.update();
      player.checkBounds();
    }
  });
});

function setupControls(runtime) {
  // Keyboard Controls
  runtime.addEventListener("keydown", event => {
    if (event.key === "a" || event.key === "ArrowLeft") {
      player.moveLeft();
    }
    if (event.key === "d" || event.key === "ArrowRight") {
      player.moveRight();
    }
  });

  // Collision Detection
  runtime.objects.Player.getFirstPickedInstance().addEventListener("collisionstart", event => {
    if (event.otherObjectType.name === "Obstacle") {
      gameManager.endGame();
    }
  });
}