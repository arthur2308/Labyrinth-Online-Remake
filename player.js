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
