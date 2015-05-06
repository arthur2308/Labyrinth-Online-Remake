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

  console.log("Shuffled tile types: " + this.tileTypes);
  console.log("Shuffled tokIDs: " + this.tokIDs);

  this.tileSet = [];
  for (i = 0; i < this.tokIDs.length; i += 1) {
    this.tileSet[i] = new Tile(this.tileTypes[i], this.tokIDs[i]);
  }
  for (i = 24; i < this.tileTypes.length; i += 1) {
    this.tileSet[i] = new Tile(this.tileTypes[i], -1);
  }

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

  for (i = 0; i < 7; i -= 1) {
    tempTileHolder = this.tileSet[((7 * index) + 6) - i];
    this.tileSet[((7 * index) + 6) - i] = this.tileSet[49];
    this.tileSet[49] = tempTileHolder;
    this.playableTileLastCoord = index * 7;
  }
};

// Prints a visual representation of the game board. 
t.printTileSet = function () {
  "use strict";
  var i,
    j,
    displayStr = "",
    rowStr = "";

  for (i = 0; i < 7; i += 1) {
    rowStr = "";
    for (j = 0; j < 7; j += 1) {
      rowStr += ("[" + this.tileSet[i * j].print() + "]");
    }
    displayStr += (rowStr + "\n");
  }
  displayStr += this.tileSet[49];
  console.log(displayStr);
};
module.exports = Tiles;
