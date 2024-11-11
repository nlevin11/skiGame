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

## 1 GameManager

### Variables

`isInGame: boolean` - Tracks whether or not user is in a game. Set to false when game boots
`isInShop: boolean` - Tracks whether or not user is in shop. Set to false when game boots
`shopItems: Item[][]` - double array of all shop items
`money: int` - counts user currency
`highscore: int` - local highscore
`equippedHat: Item` - user's current hat cosmetic
`equippedShirt: Item` - user's current shirt cosmetic
`equippedPants: Item` - user's current pant cosmetic
`equippedSkis: Item` - user's current skis cosmetic

### Methods

`startGame` - changes isInGame to true
`openShop` - changes isInShop to true

`equipItem (Item item)` - equips item if it has been purchased

## 2 LevelManager

### Variables

`score: int` - game score
`speed: int` - game speed
`obstacles: Obstacle[]` - holds an array of obstacles
`player: Player` - current player

### Methods

`startGame` - starts the game
`gameOver` - ends the game
`gameUpdate` - updates the game
`flip` - adds 10 points to the score when a player's pitch does a complete 360
`jump` - increases Y velocity when player hits a ramp

## 3 Player

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

## 5 Item

## Variables

`name: String` - name of the item
`price: int` - price of the item
`color: String` - color of item
`type: String` - type of item it is
`purchased: boolean` - whether or not the user owns it

## Methods

`purchase` - checks to see if user has money avalible to purchase item, and if they do it marks it as purch

# Data Model - Figma

