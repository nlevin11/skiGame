// Scripts/Obstacle.js
export class Obstacle {
  constructor(runtime) {
    this.runtime = runtime;
    this.obstacleTypes = ["Tree", "Rock"]; // Placeholder names
  }

  spawnObstacle() {
    const layoutWidth = this.runtime.layout.width;
    const x = Math.random() * layoutWidth;
    const y = -50; // Start off-screen
    const obstacleInstance = this.runtime.objects.Obstacle.createInstance(0, x, y);
    obstacleInstance.instVars.speed = 200; // Set initial speed
  }

  moveObstacle(instance) {
    instance.y += instance.instVars.speed * this.runtime.dt;
  }
}