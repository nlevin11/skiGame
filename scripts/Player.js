// Scripts/Player.js
export class Player {
  constructor(runtime, gameManager) {
    this.runtime = runtime;
    this.gameManager = gameManager;
    this.instance = null;
    this.speed = 400; // Adjust as needed
  }

  createInstance() {
    const layout = this.runtime.layout;
    const x = layout.width / 2;
    const y = layout.height - 150; // Position near the bottom
    this.instance = this.runtime.objects.Player.createInstance(0, x, y);
  }

  moveLeft() {
    if (this.instance) {
      this.instance.x -= this.speed * this.runtime.dt;
    }
  }

  moveRight() {
    if (this.instance) {
      this.instance.x += this.speed * this.runtime.dt;
    }
  }

  checkBounds() {
    if (this.instance) {
      const layoutWidth = this.runtime.layout.width;
      this.instance.x = Math.max(0, Math.min(this.instance.x, layoutWidth));
    }
  }
}