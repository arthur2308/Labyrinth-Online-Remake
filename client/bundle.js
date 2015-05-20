(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
    tempPos = 0;
    tempPos = this.players[playerIndex].boardLocation - 7;
    console.log("tempPos: " + tempPos);
    if ((tempPos < 0 || tempPos > 48) || ((this.setOfTiles.tileSet[tempPos].openingTable[2] === false) ||
      (this.setOfTiles.tileSet[tempPos + 7].openingTable[0] === false))) {
      return false;
    }
    this.players[playerIndex].boardLocation = tempPos;
    return true;
  }

  if (direction === 'r') {
    // Move player right 1 tile
    // console.log("tempPos: " + tempPos); 
    tempPos = 0;
    tempPos = this.players[playerIndex].boardLocation + 1;
    console.log("tempPos: " + tempPos);
    if ((tempPos % 7 === 0) || ((this.setOfTiles.tileSet[tempPos].openingTable[3] === false) ||
        (this.setOfTiles.tileSet[tempPos - 1].openingTable[1] === false))) {
      return false;
    }
    this.players[playerIndex].boardLocation += 1;
    return true;
  }

  if (direction === 'd') {
    // Move player down 1 tile
    //console.log("tempPos: " + tempPos); 
    tempPos = 0;
    tempPos = this.players[playerIndex].boardLocation + 7;
    console.log("tempPos: " + tempPos);
    if ((tempPos < 0 || tempPos > 48) || ((this.setOfTiles.tileSet[tempPos].openingTable[0] === false) ||
      (this.setOfTiles.tileSet[tempPos - 7].openingTable[2] === false))) {
      return false;
    }
    this.players[playerIndex].boardLocation = tempPos;
    return true;
  }

  if (direction === 'l') {
    // Move player left 1 tile
    // console.log("tempPos: " + tempPos); 
    tempPos = 0;
    tempPos = this.players[playerIndex].boardLocation - 1;
    console.log("tempPos: " + tempPos);
    if ((tempPos % 7 === 0) || (this.setOfTiles.tileSet[tempPos].openingtable[1] === false) ||
        (this.setOfTiles.tileSet[tempPos + 1].openingTable[3] === false)) {
      return false;
    }
    this.players[playerIndex].boardLocation -= 1;
    return true;
  }
};


gs.slide = function (Index, direction) {
  "use strict";
  var i;
  if (direction === 'u') {
    this.setOfTiles.slideUp(Index);
    for (i = 0; i < 3; i += 1) {
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
    for (i = 0; i < 3; i += 1) {
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
    for (i = 0; i < 3; i += 1) {
      if (this.players[i].boardLocation % 7 === Index) {
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
    for (i = 0; i < 3; i += 1) {
      if (this.players[i].boardLocation % 7 === Index) {
        if (this.players[i].boardLocation % 7 === 6) {
          this.players[i].boardLocation -= 6;
        } else {
          this.players[i].boardLocation += 1;
        }
      }
    }
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

},{"./player.js":3,"./tiles.js":5,"./tokens.js":6,"fs":7}],2:[function(require,module,exports){
'use strict';

/**
 * Randomize the order of the elements in a given array.
 * @param {Array} arr - The given array.
 * @param {Object} [options] - Optional configuration options.
 * @param {Boolean} [options.copy] - Sets if should return a shuffled copy of the given array. By default it's a falsy value.
 * @param {Function} [options.rng] - Specifies a custom random number generator.
 * @returns {Array}
 */
function shuffle(arr, options) {

  if (!Array.isArray(arr)) {
    throw new Error('shuffle expect an array as parameter.');
  }

  options = options || {};

  var collection = arr,
      len = arr.length,
      rng = options.rng || Math.random,
      random,
      temp;

  if (options.copy === true) {
    collection = arr.slice();
  }

  while (len) {
    random = Math.floor(rng() * len);
    len -= 1;
    temp = collection[len];
    collection[len] = collection[random];
    collection[random] = temp;
  }

  return collection;
};

/**
 * Pick one or more random elements from the given array.
 * @param {Array} arr - The given array.
 * @param {Object} [options] - Optional configuration options.
 * @param {Number} [options.picks] - Specifies how many random elements you want to pick. By default it picks 1.
 * @param {Function} [options.rng] - Specifies a custom random number generator.
 * @returns {Object}
 */
shuffle.pick = function(arr, options) {

  if (!Array.isArray(arr)) {
    throw new Error('shuffle.pick() expect an array as parameter.');
  }

  options = options || {};

  var rng = options.rng || Math.random,
      picks = options.picks || 1;

  if (typeof picks === 'number' && picks !== 1) {
    var len = arr.length,
        collection = arr.slice(),
        random = [],
        index;

    while (picks) {
      index = Math.floor(rng() * len);
      random.push(collection[index]);
      collection.splice(index, 1);
      len -= 1;
      picks -= 1;
    }

    return random;
  }

  return arr[Math.floor(rng() * arr.length)];
};

/**
 * Expose
 */
module.exports = shuffle;

},{}],3:[function(require,module,exports){
/*jslint indent: 2, node: true, nomen: true */

//---------------------------------------
// Player class
// Author: Eric Hargitt
// Description: Represents a player.
//---------------------------------------

function Player(id, boardLocation, collectedTokens) {
  "use strict";
  this.id = id;
  this.boardLocation = boardLocation;
  this.collectedTokens = collectedTokens;
}
module.exports = Player;

},{}],4:[function(require,module,exports){
/*jslint indent: 2, node: true, nomen: true */

//-------------------------------------
// Tile class
// Author: Eric Hargitt
// Description: This object represents a tile on the game board. The tile type is specified by the 
//              constructor, which creates a 4-element boolean array that represents whether that side
//              of the tile is open. For example:
//
//                  UP         
//              =============
//              |           |
//         LEFT |           | RIGHT     ==         array [UP][LEFT][DOWN][RIGHT]
//              |           |
//              |           |
//              ============
//                  DOWN
//
//              As the tile rotates, the elements in the array (called openingTable) are rotated.
//-------------------------------------

// Generates random numbers. Creates non-uniform distribution. 
function getRandomInteger(min, max) {
  "use strict";
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function Tile(tileType, tokID) {
  "use strict";
  var rand = getRandomInteger(0, 8);
  this.tileType = tileType;
  this.tokID = tokID;
  this.openingTable = [];

  // Start creating opening table to represent the paths on the tile (Up, right, down, left)
  if (this.tileType === 's') {
    // (s)traight tile
    this.openingTable = [true, false, true, false];
  } else if (this.tileType === 't') {
    // (t)ee tile
    this.openingTable = [true, true, false, true];
  } else if (this.tileType === 'a') {
    // (a)ngle tile
    this.openingTable = [true, true, false, false];
  }

  // Rotate the tile a random number of times.
  this.rotate(rand);
  //console.log("Created tile of type " + tileType + " and rotated it " + rand + " times.");
}
var tile = Tile.prototype;

// Rebuilds tile with parameters
tile.setup = function (tokID, tableInput) {
  "use strict";
  this.tokID = tokID;
  this.openingTable = tableInput;
};

// Rotates clockwise the openingTable the specified number of times. 
tile.rotate = function (numRotations) {
  "use strict";
  //console.log("Rotating " + numRotations + " times.");
  var i,
    temp;
  for (i = 0; i < numRotations; i += 1) {
    temp = this.openingTable[3];
    this.openingTable[3] = this.openingTable[2];
    this.openingTable[2] = this.openingTable[1];
    this.openingTable[1] = this.openingTable[0];
    this.openingTable[0] = temp;
  }
};

tile.print = function () {
  "use strict";
  console.log(this.openingTable);
};

module.exports = Tile;

},{}],5:[function(require,module,exports){
/*jslint indent: 2, node: true, nomen: true */

var Tile = require('./tile.js'),
  shuffle = require('shuffle-array');

//-------------------------------------------------
// Tiles class
// Author: Eric Hargitt
// Description: Represents the tiles used in the game board. This creates
//              a set of Tile objects. The tiles are arranged in
//              a single array as follows:
//
//  [ 0][ 1][ 2][ 3][ 4][ 5][ 6]   *PT = Playable Tile
//  [ 7][ 8][ 9][10][11][12][13]
//  [14][15][16][17][18][19][20]
//  [21][22][23][24][25][26][27]
//  [28][29][30][31][32][33][34]
//  [35][36][37][38][39][40][41]
//  [42][43][44][45][46][47][48][PT]
//
// The Tiles class will randomize the tileType and tokIDs,
// then pair them together in a Tile object to create the
// randomized game board. Note that index 49 of tileSet
// holds the playable tile. 
//-------------------------------------------------

function Tiles() {
  "use strict";
  var i;
  // Represents the 50 game tiles, either (s)traight[12], (t)ee[18], or (a)ngle[20]
  this.tileTypes = [
    's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's',
    't', 't', 't', 't', 't', 't', 't', 't', 't', 't', 't', 't', 't', 't', 't', 't', 't', 't',
    'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a'
  ];

  // Represents the 24 token IDs.
  this.tokIDs = [
    1, 2, 3, 4, 5, 6, 7, 8,
    9, 10, 11, 12, 13, 14, 15, 16,
    17, 18, 19, 20, 21, 22, 23, 24
  ];

  shuffle(this.tileTypes);
  shuffle(this.tokIDs);

  //console.log("Shuffled tile types: " + this.tileTypes);
  //console.log("Shuffled tokIDs: " + this.tokIDs);

  this.tileSet = [];
  for (i = 0; i < this.tokIDs.length; i += 1) {
    this.tileSet[i] = new Tile(this.tileTypes[i], this.tokIDs[i]);
  }
  for (i = 24; i < this.tileTypes.length; i += 1) {
    this.tileSet[i] = new Tile(this.tileTypes[i], -1);
  }
  shuffle(this.tileSet);

  this.playableTileLastCoord = -1;
}
var t = Tiles.prototype;

// sets up the Tiles object with the parameters
t.setup = function (tileSet) {
  "use strict";
  this.tileSet = tileSet;
};

// Slides all tiles down at the given index, which is the column number (0 - 6)
t.slideDown = function (index) {
  "use strict";
  var i,
    tempTileHolder = 0;

  for (i = 0; i < 7; i += 1) {
    tempTileHolder = this.tileSet[(i * 7) + index];
    this.tileSet[(i * 7) + index] = this.tileSet[49];
    this.tileSet[49] = tempTileHolder;
  }
  this.playableTileLastCoord = 42 + index;
};

// Slides all tiles up at the given index, which is the column number (0 - 6)
t.slideUp = function (index) {
  "use strict";
  var i,
    tempTileHolder = 0;

  for (i = 6; i >= 0; i -= 1) {
    tempTileHolder = this.tileSet[(i * 7) + index];
    this.tileSet[(i * 7) + index] = this.tileSet[49];
    this.tileSet[49] = tempTileHolder;
  }
  this.playableTileLastCoord = index;
};

// Slides all the tiles to the right at given row (0 - 6)
t.slideRight = function (index) {
  "use strict";
  var i,
    tempTileHolder = 0;

  for (i = 0; i < 7; i += 1) {
    tempTileHolder = this.tileSet[(index * 7) + i];
    this.tileSet[(index * 7) + i] = this.tileSet[49];
    this.tileSet[49] = tempTileHolder;
  }
  this.playableTileLastCoord = ((index + 1) * 7) - 1;
};

// Slides all the tiles to the left at given row (0 - 6)
t.slideLeft = function (index) {
  "use strict";
  var i,
    tempTileHolder = 0;

  for (i = 0; i < 7; i += 1) {
    tempTileHolder = this.tileSet[((7 * index) + 6) - i];
    this.tileSet[((7 * index) + 6) - i] = this.tileSet[49];
    this.tileSet[49] = tempTileHolder;
  }
  this.playableTileLastCoord = index * 7;
};

// Prints a visual representation of the game board. 
t.printTileSet = function () {
  "use strict";
  var i;
  for (i = 0; i < 50; i += 1) {
    console.log(i + " " + this.tileSet[i].openingTable);
  }
};
module.exports = Tiles;

},{"./tile.js":4,"shuffle-array":2}],6:[function(require,module,exports){
/*jslint indent: 2, node: true, nomen: true */

var shuffle = require('shuffle-array');

function Tokens() {
  "use strict";
  this.toks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
  this.drawIndex = 0;
  shuffle(this.toks);
}
var tokens = Tokens.prototype;

tokens.drawToken = function () {
  "use strict";
  var returnTok;
  if (this.drawIndex > 23) {
    return -1;
  }
  returnTok = this.toks[this.drawIndex];
  this.drawIndex += 1;
  return returnTok;
};
module.exports = Tokens;

},{"shuffle-array":2}],7:[function(require,module,exports){

},{}],8:[function(require,module,exports){
/*jslint indent: 2, node: true, nomen: true */
/*globals
  $, chrome, document, DataView, TextEncoder, TextDecoder
*/

var socks = chrome.sockets.tcp, socketId, GameState = require("../gamestate.js"),
  gs = new GameState(),
  socketId = '', log = function (msg) {
  "use strict";
  $('#console').append(msg + '<br>');
  console.log(msg);
},
  str2ab = function (str) {
    "use strict";

    var encoder = new TextEncoder('utf-8');
    return encoder.encode(str).buffer;
  },
  ab2str = function (ab) {
    "use strict";

    var dataView = new DataView(ab),
      decoder = new TextDecoder('utf-8');
    return decoder.decode(dataView);
  };

// Generates a single tile. tokId and playerId are -1 if not present
function generateTile(openingTable, tokId, playerIndex, div_id) {
  "use strict";
  var tileImg, tokImg, playerImg, elementString;
  switch (openingTable.join()) {
// The angle tiles
  case "true,true,false,false":
    tileImg = "1100.png";
    break;
  case "false,true,true,false":
    tileImg = "0110.png";
    break;
  case "false,false,true,true":
    tileImg = "0011.png";
    break;
  case "true,false,false,true":
    tileImg = "1001.png";
    break;
// The tee tiles
  case "false,true,true,true":
    tileImg = "0111.png";
    break;
  case "true,false,true,true":
    tileImg = "1011.png";
    break;
  case "true,true,false,true":
    tileImg = "1101.png";
    break;
  case "true,true,true,false":
    tileImg = "1110.png";
    break;
    // The straight tiles
  case "true,false,true,false":
    tileImg = "1010.png";
    break;
  case "false,true,false,true":
    tileImg = "0101.png";
    break;
  default:
    console.log("Could not find case for given openingTable " + openingTable);
  }

  switch (tokId) {
  case -1:
    tokImg = "no_img.png";
    break;
  case 0:
    tokImg = "no_img.png";
    break;
  case 1:
    tokImg = "dragon.png";
    break;
  case 2:
    tokImg = "ring.png";
    break;
  case 3:
    tokImg = "owl.png";
    break;
  case 4:
    tokImg = "spider.png";
    break;
  case 5:
    tokImg = "sword.png";
    break;
  case 6:
    tokImg = "money_bag.png";
    break;
  case 7:
    tokImg = "tome.png";
    break;
  case 8:
    tokImg = "candlestick.png";
    break;
  case 9:
    tokImg = "map.png";
    break;
  case 10:
    tokImg = "helmet.png";
    break;
  case 11:
    tokImg = "bat.png";
    break;
  case 12:
    tokImg = "princess.png";
    break;
  case 13:
    tokImg = "keys.png";
    break;
  case 14:
    tokImg = "hobbit.png";
    break;
  case 15:
    tokImg = "chest.png";
    break;
  case 16:
    tokImg = "skull.png";
    break;
  case 17:
    tokImg = "beetle.png";
    break;
  case 18:
    tokImg = "crown.png";
    break;
  case 19:
    tokImg = "rat.png";
    break;
  case 20:
    tokImg = "emerald.png";
    break;
  case 21:
    tokImg = "moth.png";
    break;
  case 22:
    tokImg = "genie.png";
    break;
  case 23:
    tokImg = "ghost.png";
    break;
  case 24:
    tokImg = "newt.png";
    break;
  default:
    console.log("Could not find case for given tokId" + tokId);
  }

  switch (playerIndex) {
  case 0:
    playerImg = "player_dot_0.png";
    break;
  case 1:
    playerImg = "player_dot_1.png";
    break;
  case 2:
    playerImg = "player_dot_2.png";
    break;
  case 3:
    playerImg = "player_dot_3.png";
    break;
  default:
    console.log("Could not find match for playerIndex " + playerIndex);
  }

  elementString = '<div id="' + div_id + '" style="position: relative; left: 0; top: 0;"><img src="' + tileImg;
  elementString += '" style="position: relative; top: 0; left: 0;"/><img src="' + tokImg;
  elementString += '" style="position: absolute; top: 10px; left: 10px;"/>';
  if (playerIndex !== -1) {
    elementString += '<img src="' + playerImg + '" style="position: absolute; top: 10px; left: 10px;"/></div>';
  }
  
  return elementString;
}

function populateGameBoard(container) {
  "use strict";
  var table, openingTable, tokId, playerIndex, row, i, j, k;
  $(".CSSTableGenerator").remove();
  table = $("<table/>").addClass('CSSTableGenerator');
  for (i = 0; i < 7; i += 1) {
    row = $("<tr/>");
    for (j = 0; j < 7; j += 1) {
      openingTable = gs.setOfTiles.tileSet[j + (7 * i)].openingTable;
      tokId = gs.setOfTiles.tileSet[j + (7 * i)].tokID;
      console.log("tokId is " + tokId);
      playerIndex = -1;
      for (k = 0; k < gs.players.length; k += 1) {
        if (gs.players[k].boardLocation === j + (7 * i)) {
          playerIndex = k;
          break;
        }
      }
      row.append($("<td/>")).append(generateTile(openingTable, tokId, playerIndex, "tile"));
    }
    table.append(row);
  }
  return container.append(table);
}


$(document).ready(function () {
  "use strict";
  gs.createNewGame([11, 12, 13]); // Test
  populateGameBoard($("#game_board"));
  socks.onReceive.addListener(function (info) {
    log("Received: " + ab2str(info.data));
  });

  socks.onReceiveError.addListener(function (info) {
    log("ReceiveError " + JSON.stringify(info));
  });

  $('#m_up').click(function() {
    gs.movePlayer(0, 'u');
    populateGameBoard($("#game_board"));
  });

  $('#m_down').click(function() {
    gs.movePlayer(0, 'd');
    populateGameBoard($("#game_board"));
  });

  $('#m_left').click(function() {
    gs.movePlayer(0, 'l');
    populateGameBoard($("#game_board"));
  });

  $('#m_right').click(function() {
    gs.movePlayer(0, 'r');
    populateGameBoard($("#game_board"));
  });

  $('#rot_tile').click(function() {
    var tile;
    gs.setOfTiles.tileSet[49].rotate(1);
    tile = gs.setOfTiles.tileSet[49];
    console.log("proof of life!: " + tile.openingTable);
    $('#tile_img').remove();
    $('#tile_preview').append(generateTile(tile.openingTable, tile.tokID, -1, "tile_img"));
  });

  $('#s_up').click(function() {
    // get index to slide tile into
    var index = $('#slide_index').val();
    // slide the tile
    gs.slide(index, 'u');
    // reset the 
    $('#tile_img').remove();
    $('#tile_preview').append(generateTile(gs.setOfTiles.tileSet[49].openingTable, tile.tokID, -1, "tile_img"));
    populateGameBoard($("#game_board"));
    log("Slid up at index " + index);
  });

  $('#s_right').click(function() {

  });

  $('#s_down').click(function() {
   
  });

  $('#s_left').click(function() {

  });

  $('#fin').click(function() {

  });


  $('#connect').click(function () {
    var server = $('#server').val();
    if (socketId !== '') {
      log('Already connected!');
      return;
    }

    socks.create({}, function (createInfo) {
      socketId = createInfo.socketId;
      log('socketId = ' + socketId);

      socks.connect(socketId, server, 8421, function (resultCode) {
        if (resultCode >= 0) {
          log('Connect succeeded: ' + resultCode);
          socks.setPaused(socketId, false);
        } else {
          socketId = '';
          log('Connect failed: ' + resultCode);
        }
      });

    });
  });

  $('#disconnect').click(function () {
    if (socketId === '') {
      log('Not connected!');
      return;
    }

    socks.disconnect(socketId, function () {
      socks.close(socketId, function () {
        socketId = '';
        log('Disconnected');
      });
    });
  });

  $('#send').click(function () {
    var msg = $('#sendMessage').val();

    if (socketId === '') {
      log('Not connected!');
      return;
    }

    socks.send(socketId, str2ab(msg), function (info) {
      log("Sent " + JSON.stringify(info));
    });
  });
});

},{"../gamestate.js":1}]},{},[8]);
