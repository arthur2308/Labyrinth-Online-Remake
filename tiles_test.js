/*jslint indent: 2, node: true, nomen: true, plusplus: true */
var Tiles = require('./tiles.js'),
  newTiles;

newTiles = new Tiles();
console.log("\nOriginal tiles:");
newTiles.printTileSet();

console.log("\nTiles after slide down at 0:");
newTiles.slideDown(0);
newTiles.printTileSet();

console.log("\nTiles after slide up at 0:");
newTiles.slideUp(0);
newTiles.printTileSet();

console.log("\nTiles after slide right at 0:");
newTiles.slideRight(0);
newTiles.printTileSet();

console.log("\nTiles after slide left at 0:");
newTiles.slideLeft(0);
newTiles.printTileSet();
