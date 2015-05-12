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
