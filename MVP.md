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

### Cliffs
- It looked like you were just floating on air before
- Now it looks more normal
- You die if you hit them

### Speed
- Speed slowly increases over time but is capped after 2 mins
- Collision works
- Score increases with distance traveled
- It's not fun if it's too slow for any challenge

## To Do List

### 1. Jumps and flip mechanics P1
- Implement a new type of obstacle: jumps
- When the player travels over jumps, they fly in the air for a short time
- In that time, they can perform flips that boost the player's score
- The jumps should be inside Obstacle, the player's airtime and tricks should be inside Player, and it should all connect back to the animate method in GameManager <!-- imo, tricks shouldn't be that high of a priority. but also u probably just have a different vision for this than me, and its your game, not mine. that sounds passive aggresive lol -->

### 2. Random stuff that Jacob wants
- I think that the leaderboard should be a higher priority. would be a lot more engaging/addictive if you were constantly trying to beat your own record
- Would be cool if obstacles randomly varied in size a little
- would be cool if the rate at which the speed increased decreased over time. like maybe it goes from 1x speed to 3x speed in the first minute, and then up to 6x speed in the next 2 minutes, and then up to 10x speed in the next 3 minutes. those are made up numbers but you get what im saying

### 2. Aesthetics in game P2
- Use the existing 3D models (or new ones) to design the jumps, rocks, trees, and the player <!-- tbh i kinda like the aesthetic as it is. i agree that the snow could look better, and yeah, there should be a basic design for the player, but i like the blockiness of it all-->
- Add a snowy background
- Give the impression of skiing down a slope in game (through wind, a slanted surface, etc.)
- Models should be inside Obstacle and Player with everything else inside GameManager

### 3. Menu screen, shop, and leaderboard P2
- Implement a starting menu screen which displays high scores for that user
- Potentially integrate a shop where in-game score can be used to purchase cosmetics
    - Would require more 3D models