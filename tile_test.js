/*jslint indent: 2, node: true, nomen: true, plusplus: true */

var Tile = require('./tile.js'),
  newTile;

newTile = new Tile(3, 'a');
console.log("Before rotation: " + newTile.openingTable);
newTile.rotate(1);
console.log("After rotation: " + newTile.openingTable);
