## Completed Items

### Score tracking and display
- implemented a score variable that increases at an increasing rate over time
- displayed on the screen
- inside GameManager

### Initialization of the player and its movement
- the player is created (only a 3D cube right now) and can be controlled using the arrow keys
- inside GameManager and Player

### Background and playing surface
- there is a background and a surface for the obstacles and player to sit on
- inside GameManager

### Obstacle spawning and death mechanics
- The obstacles spawn randomly on the plane
- When the player hits an obstacle, they die
- Upon death, the user can restart the game
- inside GameManager and Obstacle

## To Do List

### 1. Jumps and flip mechanics P1
- Implement a new type of obstacle: jumps
- When the player travels over jumps, they fly in the air for a short time
- In that time, they can perform flips that boost the player's score
- The jumps should be inside Obstacle, the player's airtime and tricks should be inside Player, and it should all connect back to the animate method in GameManager

### 2. Aesthetics in game P2
- Use the existing 3D models (or new ones) to design the jumps, rocks, trees, and the player
- Add a snowy background
- Give the impression of skiing down a slope in game (through wind, a slanted surface, etc.)
- Models should be inside Obstacle and Player with everything else inside GameManager

### 3. Menu screen, shop, and leaderboard P2
- Implement a starting menu screen which displays high scores for that user
- Potentially integrate a shop where in-game score can be used to purchase cosmetics
    - Would require more 3D models