/*jslint indent: 2, node: true, nomen: true, stupid: true, plusplus: true */

var Player = require('./player.js'), // Import player.js
  Tiles = require('./tiles.js'),     // Import tiles.js
  Tokens = require('./tokens.js');   // Import tokens.js

//-------
//GameState class
//Author: Eric Hargitt
//Description: A GameState object is passed around to each
//             client, who will update the object during
//             their turn and pass it back to the server,
//             who will forward it to the other clients.
//-------
function GameState() {
  "use strict";

  this.players = [];        // Array to hold players
  this.setOfTiles = 0;      // Will hold Tiles object
  this.setOfToks = 0;       // Will hold Tokens object
  this.activePlayerNum = 0; // Shows whose turn it is to play by index of players array 
  this.winnerId = -1;       // if this is set, indicated a player w/ index in players array won
  this.drawnToks = [];
}
var gs = GameState.prototype;

gs.createNewGame = function (playerIds) {
  "use strict";

  var i, corners = [0, 6, 42, 48];
  for (i = 0; i < playerIds.length; i++) {
    this.players[i] = new Player(playerIds[i], corners[i], []);
  }                              // Initialize each player w/ ID
  this.setOfTiles = new Tiles(); // Creates new set of Tiles
  this.setOfToks = new Tokens(); // Creates new set of Tokens
  for (i = 0; i < 3; i += 1) {
    this.drawnToks[i] = this.setOfToks.drawToken();
  }
};

// Move a player up, right, down, or left. 
gs.movePlayer = function (playerIndex, direction) {
  "use strict";
  var tempPos;

  if (direction === 'u') {
    // Move player up 1 tile
    tempPos = this.players[playerIndex].boardLocation - 7;
    if ((tempPos < 0 || tempPos > 48) || (setOfTiles.tileSet[tempPos].openingTable[2] === false)) {
      return false;
    }
    this.players[playerIndex].boardLocation = tempPos;
    return true;
  }

  if (direction === 'r') {
    // Move player right 1 tile
    tempPos = this.players[playerIndex].boardLocation + 1;
    if ((tempPos % 7 === 0) || (setOfTiles.tileSet[tempPos].openingTable[3] === false)) {
      return false;
    }
    this.players[playerIndex].boardLocation += 1;
    return true;
  }

  if (direction === 'd') {
    // Move player down 1 tile
    tempPos = this.players[playerIndex].boardLocation + 7;
    if ((tempPos < 0 || tempPos > 48) || (setOfTiles.tileSet[tempPos].openingTable[0] === false)) {
      return false;
    }
    this.players[playerIndex].boardLocation = tempPos;
    return true;
  }

  if (direction === 'l') {
    // Move player left 1 tile
    tempPos = players[playerIndex].boardLocation - 1; 
    if ((tempPos % 7 === 0) || (setOfTiles.tileSet[tempPos].openingtable[1] === false)) {
      return false;
    }
    this.players[playerIndex].boardLocation -= 1;
    return true;
  }
};

// Need to create a function to detect if a player has landed on a tile

gs.marshal = function () {
  "use strict";
  var returnJSON = "", i, fs;
  // Do the players
  returnJSON += this.players.length + "\n"; // Num of players in file
  for (i = 0; i < this.players.length; i += 1) {
    returnJSON += JSON.stringify(this.players[i].id) + "\n";
    returnJSON += JSON.stringify(this.players[i].boardLocation) + "\n";
    returnJSON += JSON.stringify(this.players[i].collectedTokens) + "\n";
  }

  // Do the tiles
  for (i = 0; i < 50; i += 1) {
    returnJSON += this.setOfTiles.tileSet[i].tokID + "\n";
    returnJSON += this.setOfTiles.tileSet[i].openingTable + "\n";
  }
  returnJSON += this.setOfTiles.playableTileLastCoord + "\n";

  // Do the tokens
  returnJSON += this.setOfToks.toks + "\n";
  returnJSON += this.setOfToks.drawIndex + "\n";

  // Misc attributes
  returnJSON += this.activePlayerNum + "\n";
  returnJSON += this.winnerId + "\n";
  returnJSON += this.drawnToks;
  fs = require('fs');
  fs.writeFileSync("game.txt", returnJSON);
  return returnJSON;
};

gs.createFromFile = function (file) {
  "use strict";
  var fs, gameStr = [];
  fs = require('fs');
  fs.readFileSync(file, 'utf8').toString().split('\n').forEach(function (line) {
    gameStr.push(line);
  });
  return gameStr;
};

module.exports = GameState;
