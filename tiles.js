var Tile = require('./tile.js');
var shuffle = require('shuffle-array');

//-------------------------------------------------
// Tiles class
// Author: Eric Hargitt
// Description: Represents the tiles used in the game board. This creates
//		a set of Tile objects. The tiles are arranged in
//		a single array as follows:
//
//		[ 0][ 1][ 2][ 3][ 4][ 5][ 6]   *PT = Playable Tile
//		[ 7][ 8][ 9][10][11][12][13]
//		[14][15][16][17][18][19][20]
//		[21][22][23][24][25][26][27]
//		[28][29][30][31][32][33][34]
//		[35][36][37][38][39][40][41]
//		[42][43][44][45][46][47][48][PT]
//		
//		The Tiles class will randomize the tileType and tokIDs,
//		then pair them together in a Tile object to create the
//		randomized game board.
//-------------------------------------------------

function Tiles() {
	// Represents the 50 game tiles, either (s)traight, (t)ee, or (a)ngle
	this.tileTypes = {
		s,s,s,s,s,s,s,s,s,s,s,s,
		t,t,t,t,t,t,t,t,t,t,t,t,t,t,t,t,t,t,
		a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a
	};
	
	// Represents the 24 token IDs.
	this.tokIDs = {
		1,2,3,4,5,6,7,8,
		9,10,11,12,13,14,15,16,
		17,18,19,20,21,22,23,24
	};

	shuffle(tileTypes);
	shuffle(tokIDs);

	this.tileSet = new array();
	for (var i = 0; i < tokIDs.length; i++)
		tileSet[i] = new Tile(tileTypes[i], tokIDs[i]);
	for (var i = 24; i < tileTypes.length; i++)
		tileSet[i] = new Tile(tileTypes[i], -1);

	this.playableTileLastCoord = -1;
}
var t = Tiles.prototype;

// Slides all tiles down at the given index, which is the column number (0 - 6)
t.slideDown = function(index) {
	var tempTileHolder = 0;

	for (var i = 0; i < 7; i++) {	
		tempTileHolder = this.tileSet[(i * 7) + index];
		this.tileSet[(i * 7) + index] = this.tileSet[49];
		this.tileSet[49] = tempTileHolder;
	}
	this.playableTileLastCoord = 42 + index;
}

// Slides all tiles up at the given index, which is the column number (0 - 6)
t.slideUp = function(index) {
	var tempTileHolder = 0;

	for (var i = 6; i >= 0; i--) {
		tempTileHolder = this.tileSet[(i * 7) + index];
		this.tileSet[(i * 7) + index] = this.tileSet[49];
		this.tileSet[49] = tempTileHolder;
	}
	this.playableTileLastCoord = index;
}

module.exports = Tiles;
