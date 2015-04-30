var Player = require('./player.js'); // Import player.js
var Tiles = require('./tiles.js');   // Import tiles.js
var Tokens = require('./tokens.js'); // Import tokens.js

//-------
//GameState class
//Author: Eric Hargitt
//Description: A GameState object is passed around to each
//	       client, who will update the object during
//             their turn and pass it back to the server,
//	       who will forward it to the other clients.	
//-------
function GameState() {
        this.players = new Array();           // Array to hold players
	this.setOfTiles = 0;		      // Will hold Tiles object
	this.setOfToks = 0;		      // Will hold Tokens object
        this.activePlayerNum = 0;  // Shows whose turn it is to play by index of players array 
        this.winnerId = -1;        // if this is set, indicated a player w/ index in players array won
}
var gs = GameState.prototype;

gs.createNewGame = function(var playerIds) {
	for (var i = 0; i < playerIds.length; i++)
		this.players[i] = new this.Player(playerIds[i]); // Initialize each player w/ ID
	this.setOfTiles = new Tiles(); // Creates new set of Tiles
	this.setOfToks = new Tokens(); // Creates new set of Tokens
}

gs.getPlayers = function() {
	return this.players;
}

gs.getTiles = function() {
	return this.setOfTiles;
}

gs.getToks = function() {
	return this.setOfToks;
}

module.exports = GameState;
