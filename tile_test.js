/*jslint indent: 2, node: true, nomen: true, plusplus: true */

var Tile = require('./tile.js'),
  tile0,
  tile1,
  tile2;

console.log("Tile 0 = angle tile");
tile0 = new Tile('a', 3);
console.log("Tile 0 before rotation: " + tile0.openingTable);
tile0.rotate(1);
console.log("Tile 0 after rotation: " + tile0.openingTable);
console.log("Tile 1 = straight tile");
tile1 = new Tile('s', 4);
tile1.print();
console.log("Tile 2 = tee tile");
tile2 = new Tile('t', 5);
tile2.print();
