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

### Methods

`startGame` - changes isInGame to true
`openShop` - changes isInShop to true
`getMoney` - gets money
`addMoney(int money)` - adds money to money
`subtractMoney(int money)` subtracts money from money

## 2 LevelManager

## 3 Player

## 4 Item

## Variables

`name: String` - name of the item
`price: int` - price of the item
`color: String` - color of item
`type: String` - type of item it is
`purchased: boolean` - whether or not the user owns it

## Methods

`purchase` - checks to see if user has money avalible to purchase item, and if they do it marks it as purchased and calls GameManager.subtractMoney(price)

# Data Model - Figma

