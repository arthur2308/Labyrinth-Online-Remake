/*jslint indent: 2, node: true, nomen: true, plusplus: true */
var Tiles = require('./tiles.js'),
  newTiles;

newTiles = new Tiles();
console.log("Tiles aliveness: " + newTiles.tileTypes);
