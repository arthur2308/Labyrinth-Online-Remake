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
  this.players = [];
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
  var tempPos, isOutOfBounds, isOpenCurrentTile, isOpenOtherTile;

  if (direction === 'u') {
    // Move player up 1 tile
    tempPos = 0;
    tempPos = this.players[playerIndex].boardLocation - 7;
    console.log("tempPos: " + tempPos);
    isOutOfBounds = (tempPos < 0 || tempPos > 48);
    isOpenCurrentTile = this.setOfTiles.tileSet[tempPos].openingTable[2] === "true";
    isOpenOtherTile = this.setOfTiles.tileSet[tempPos + 7].openingTable[0] === "true";
  } else if (direction === 'r') {
    // Move player right 1 tile
    // console.log("tempPos: " + tempPos); 
    tempPos = 0;
    tempPos = this.players[playerIndex].boardLocation + 1;
    console.log("tempPos: " + tempPos);
    isOutOfBounds = tempPos % 7 === 0;
    isOpenCurrentTile = this.setOfTiles.tileSet[tempPos].openingTable[3] === "true";
    isOpenOtherTile = this.setOfTiles.tileSet[tempPos - 1].openingTable[1] === "true";
  } else if (direction === 'd') {
    // Move player down 1 tile
    //console.log("tempPos: " + tempPos); 
    tempPos = 0;
    tempPos = this.players[playerIndex].boardLocation + 7;
    console.log("tempPos: " + tempPos);
    isOutOfBounds = (tempPos < 0 || tempPos > 48);
    isOpenCurrentTile = this.setOfTiles.tileSet[tempPos].openingTable[0] === "true";
    isOpenOtherTile = this.setOfTiles.tileSet[tempPos - 7].openingTable[2] === "true";
  } else if (direction === 'l') {
    // Move player left 1 tile
    // console.log("tempPos: " + tempPos); 
    tempPos = 0;
    tempPos = this.players[playerIndex].boardLocation - 1;
    console.log("tempPos: " + tempPos);
    isOutOfBounds = tempPos % 7 === 6;
    isOpenCurrentTile = this.setOfTiles.tileSet[tempPos].openingTable[1] === "true";
    isOpenOtherTile = this.setOfTiles.tileSet[tempPos + 1].openingTable[3] === "true";
  }

  if (isOutOfBounds || !isOpenCurrentTile || !isOpenOtherTile) {
    return false;
  }
  this.players[playerIndex].boardLocation = tempPos;
  return true;
};

// SLIDE---------------------------------------------------------------------------
// Slides the player with the sliding row/column
// Calls setOfTiles's slide finction to slide the pieces
// Changes position of the player accordingly
gs.slide = function (Index, direction) {
  "use strict";
  var i;
  if (direction === 'u') {
    this.setOfTiles.slideUp(Index);
    for (i = 0; i < this.players.length; i += 1) {
      if (this.players[i].boardLocation % 7 === Index) { // if same row or column
        if (this.players[i].boardLocation <= 6) {
          this.players[i].boardLocation += 42;
        } else {
          this.players[i].boardLocation -= 7;
        }
      }
    }
  }

  if (direction === 'd') {
    this.setOfTiles.slideDown(Index);
    for (i = 0; i < this.players.length; i += 1) {
      if (this.players[i].boardLocation % 7 === Index) {
        if (this.players[i].boardLocation >= 42) {
          this.players[i].boardLocation -= 42;
        } else {
          this.players[i].boardLocation += 7;
        }
      }
    }
  }

  if (direction === 'l') {
    this.setOfTiles.slideLeft(Index);
    for (i = 0; i < this.players.length; i += 1) {
      if (parseInt(this.players[i].boardLocation / 7, 10) === Index) {
        if (this.players[i].boardLocation % 7 === 0) {
          this.players[i].boardLocation += 6;
        } else {
          this.players[i].boardLocation -= 1;
        }
      }
    }
  }

  if (direction === 'r') {
    this.setOfTiles.slideRight(Index);
    for (i = 0; i < this.players.length; i += 1) {
      if (parseInt(this.players[i].boardLocation / 7, 10) === Index) {
        if (this.players[i].boardLocation % 7 === 6) {
          this.players[i].boardLocation -= 6;
        } else {
          this.players[i].boardLocation += 1;
        }
      }
    }
  }
};

gs.pickToken = function () {
  "use strict";
  var tempPos = this.players[this.activePlayerNum].boardLocation, i, j;
  for (i = 0; i < 3; i += 1) {
    // Are we on a tile we can pick up?
    if (this.setOfTiles.tileSet[tempPos].tokID === this.drawnToks[i]) {
      // If so, check this tile against the tiles we've already collected, to ensure to duplicates exist
      for (j = 0; j < this.players[this.activePlayerNum].collectedTokens.length; j += 1) {
        if (this.players[this.activePlayerNum].collectedTokens[j] === this.setOfTiles.tileSet[tempPos].tokID) {
          console.log("Already picked up this token.");
          return false;
        }
      }
      this.players[this.activePlayerNum].collectedTokens.push(this.drawnToks[i]);
      this.drawnToks[i] = this.setOfToks.drawToken();
      return true;
    }
  }
  return false;
};

gs.checkForWinner = function () {
  "use strict";
  console.log("**Test, checkForWinner** activePlayerNum = " + this.activePlayerNum + " players.length = " + this.players.length + " this.players[this.activePlayerNum].collectedToks.length = " + this.players[this.activePlayerNum].collectedTokens.length);
  if (this.players[this.activePlayerNum].collectedTokens.length >= 8) {
    this.winnerId = this.activePlayerNum;
    console.log(this.player[this.winnerId] + " has won the game!");
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
  var fs, gameStr, i, numPlayers, currentIndex;
  fs = require('fs');
  gameStr = fs.readFileSync(file).toString().split('\n');

  // Get number of players
  numPlayers = gameStr[0];
  console.log(numPlayers);

  // Recreate players
  i = 1;
  currentIndex = 0;
  while (i < ((numPlayers * 3) + 1)) {
    this.players[currentIndex] = new Player(0, 0, []);
    this.players[currentIndex].id = gameStr[i];
    i += 1;
    this.players[currentIndex].boardLocation = gameStr[i];
    i += 1;
    this.players[currentIndex].collectedTokens = gameStr[i];
    i += 1;
    currentIndex += 1;
  }

  // Recreate the gameboard
  currentIndex = 0;
  this.setOfTiles = new Tiles();
  while (i <= currentIndex) {
    gameStr[i] = this.setOfTiles.tileSet[currentIndex].tokId;
    i += 1;
    gameStr[i] = this.setOfTiles.tileSet[currentIndex].openingTable;
    i += 1;
    currentIndex += 1;
  }

  // Recreate last index
  this.setOfTiles.playableTileLastCoord = gameStr[i];
  i += 1;

  // Recreate the tokens
  this.setOfToks = new Tokens();
  this.setOfToks.toks = gameStr[i];
  i += 1;
  this.setOfToks.drawIndex = gameStr[i];
  i += 1;

  // Recreate misc attributes
  this.activePlayerNum = gameStr[i];
  i += 1;
  this.winnerId = gameStr[i];
  i += 1;
  this.drawnToks = gameStr[i];

  return gameStr;
};

module.exports = GameState;
