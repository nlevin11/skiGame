// Scripts/GameManager.js
export class GameManager {
  constructor(runtime) {
    this.runtime = runtime;
    this.isInGame = false;
    this.highscore = 0;
    this.score = 0;
    this.scoreText = null;
  }

  startGame() {
    this.isInGame = true;
    this.score = 0;
    this.runtime.goToLayout("GameLayout");
  }

  endGame() {
    this.isInGame = false;
    if (this.score > this.highscore) {
      this.highscore = this.score;
    }
    this.runtime.goToLayout("GameOverLayout");
  }

  updateScore(points) {
    this.score += points;
    if (this.scoreText) {
      this.scoreText.text = `Score: ${this.score}`;
    }
  }

  setScoreTextInstance(instance) {
    this.scoreText = instance;
  }
}