### Technology Stack

**Priority:** [P0/P1]
**Implementation Timeline:** [Day 1]

**Core Requirements:**
- Implement game engine with 2D and limited 3D support
- Use an accessible GUI with documented manuals (https://www.construct.net/en/make-games/manuals/construct-3)

**Technical Components:**
- Game engine: Construct, chosen for simplicity in 2D game development with some 3D capabilities
- Supports add-ons for custom features

**Simplifications:**
- Limited 3D elements (only 3D depth) due to engine constraints
- Certain advanced 3D features not feasible in MVP

**Dependencies:**
- None

### Architecture

#### GameManager

**Priority:** [P0]
**Implementation Timeline:** [Day 1]

**Core Requirements:**
- Track game state (e.g., in-game status, high score)

**Technical Components:**
- `isInGame`: Boolean, tracks game status
- `highscore`: Integer, stores local high score
- `startGame`: Method, changes isInGame to true

**Simplifications:**
- Shop feature postponed for post-release update

**Dependencies:**
- None

#### LevelManager

**Priority:** [P0/P1] - Obstacles are P1
**Implementation Timeline:** [Day 2]

**Core Requirements:**
- Manage game score, speed, obstacles, and player

**Technical Components:**
- `score`: Integer, tracks game score
- `speed`: Integer, sets game speed
- `obstacles`: Array of Obstacle objects - P1
- `player`: Player object representing the current player
- `startGame`: Method, starts the game
- `gameOver`: Method, ends the game
- `gameUpdate`: Method, updates the game

**Simplifications:**
- None

**Dependencies:**
- Depends on GameManager to initialize game state

#### Player

**Priority:** [P0/P1] - Flip and jump methods are P1, rest is P0
**Implementation Timeline:** [Day 3-4]

**Core Requirements:**
- Manage player position, velocity, and animations

**Technical Components:**
- `Xposition`: Integer, current X position
- `Yposition`: Integer, current Y position
- `Xvelocity`: Integer, current X velocity
- `Yvelocity`: Integer, current Y velocity
- `pitch`: Integer, rotation of the player
- `flip` - adds 10 points to the score when a player's pitch does a complete 360 - P1
- `jump` - increases Y velocity when player hits a ramp - P1

**Simplifications:**
- Flip and jump methods could be postponed if necessary

**Dependencies:**
- Depends on LevelManager to update player position and velocity, and to check interactions with obstacles

#### Obstacle

**Priority:** [P1]
**Implementation Timeline:** [Day 5]

**Core Requirements:**
- Define obstacles and their positions and types

**Technical Components:**
- `Xposition`: Integer, X position of obstacle
- `Yposition`: Integer, Y position of obstacle
- `isRamp`: Boolean, indicates if the obstacle is a ramp or tree

**Simplifications:**
- None

**Dependencies:**
- Depends on LevelManager to update obstacle position and track interactions with the player

# MVP Implementation Plan

## Day 1 (Core Framework)
- Create Tech Stack and GameManager class

## Day 2 (Game Architecture)
- Create LevelManager class

## Day 3-4 (Player)
- Create Player class

## Day 5 (Extra Features)
- Add Obstacle class if time permits, or test existing features