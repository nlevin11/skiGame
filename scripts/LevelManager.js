// Scripts/LevelManager.js
import { Obstacle } from "./Obstacle.js";

export class LevelManager {
  constructor(runtime, gameManager) {
    this.runtime = runtime;
    this.gameManager = gameManager;
    this.obstacleManager = new Obstacle(runtime);
    this.spawnInterval = 2; // Spawn every 2 seconds
    this.timeSinceLastSpawn = 0;
  }

  update() {
    this.timeSinceLastSpawn += this.runtime.dt;
    if (this.timeSinceLastSpawn >= this.spawnInterval) {
      this.obstacleManager.spawnObstacle();
      this.timeSinceLastSpawn = 0;
    }

    // Move obstacles
    const obstacles = this.runtime.objects.Obstacle.getAllInstances();
    for (const obstacle of obstacles) {
      this.obstacleManager.moveObstacle(obstacle);
      // Remove obstacles that are off-screen
      if (obstacle.y > this.runtime.layout.height + 50) {
        obstacle.destroy();
      }
    }
  }
}