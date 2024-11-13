# Technology Stack

## Construct
This game will implement ![Construct](https://www.construct.net/en/make-games/manuals/construct-3), as it naitively implements the 3d depth elements mention in the game design while also having simple creation for the 2d motions of the skier. 

**Pros**
- Simplifies development of 2d games
- Easy GUI
- Fully documented manuals for using it
- Allows add ons for custom features

**Cons**
- Learning curve with implementing new software
- While it can use some 3d features, it does not allow for full 3d games

# Architecture

## 1 GameManager - P0

`Note:` - Shop would be a cool new feature after release, not necessary for initial release

### Variables

`isInGame: boolean` - Tracks whether or not user is in a game. Set to false when game boots
`isInShop: boolean` - Tracks whether or not user is in shop. Set to false when game boots - P2
`shopItems: Item[][]` - double array of all shop items - P2
`money: int` - counts user currency - P2
`highscore: int` - local highscore
`equippedHat: Item` - user's current hat cosmetic - P2
`equippedShirt: Item` - user's current shirt cosmetic - P2
`equippedPants: Item` - user's current pant cosmetic - P2
`equippedSkis: Item` - user's current skis cosmetic - P2

### Methods

`startGame` - changes isInGame to true
`openShop` - changes isInShop to true - P2

`equipItem (Item item)` - equips item if it has been purchased - P2

## 2 LevelManager - P0

### Variables

`score: int` - game score
`speed: int` - game speed
`obstacles: Obstacle[]` - holds an array of obstacles 
`player: Player` - current player

### Methods

`startGame` - starts the game
`gameOver` - ends the game
`gameUpdate` - updates the game
`flip` - adds 10 points to the score when a player's pitch does a complete 360 - P1
`jump` - increases Y velocity when player hits a ramp - P1

## 3 Player - P0

### Variables

`Xposition: int` - current X position
`Yposition: int` - current Y position
`Xvelocity: int` - current X velocity
`Yvelocity: int` - current Y velocity
`pitch: int` - rotation of the player

### Methods

`crash` - plays a death animation when the player loses

## 4 Obstacle

### Variables

`Xposition: int` - current X position
`Yposition: int` - current Y position
`isRamp: boolean` - is the obstacle a ramp instead of a tree

## 5 Item - P2

## Variables

`name: String` - name of the item
`price: int` - price of the item
`color: String` - color of item
`type: String` - type of item it is
`purchased: boolean` - whether or not the user owns it

## Methods

`purchase` - checks to see if user has money avalible to purchase item, and if they do it marks it as purch

# Data Model - Figma

![https://www.figma.com/board/L0nXQ4z3IX9u74hGSFa0Jw/SkiGame?node-id=0-1&t=clHQslNUtwlaMGRS-1](https://www.figma.com/board/L0nXQ4z3IX9u74hGSFa0Jw/SkiGame?node-id=0-1&t=clHQslNUtwlaMGRS-1)
