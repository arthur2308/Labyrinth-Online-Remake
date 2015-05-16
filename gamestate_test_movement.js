/*jslint indent: 2, node: true, nomen: true */
var GameState  = require('./gamestate.js'), gs, i, arr;

gs = new GameState();
gs.createFromFile("game.txt");

for (i = 0; i < 50; i += 1) {
  console.log(i + gs.setOfTiles.tileSet[i].openingTable);
}

console.log("******player info*********");

for (i = 0; i < gs.players.length; i += 1) {
  console.log("player: " + gs.players[i].id + ", position: " + gs.players[i].boardLocation);
}

/*
console.log("player: " + gs.players[0].id + ", position: " + gs.players[0].boardLocation);
console.log(gs.movePlayer(0, 'd'));
console.log("player: " + gs.players[0].id + ", position: " + gs.players[0].boardLocation); 
console.log(gs.movePlayer(0, 'd)'));
console.log("player: " + gs.players[0].id + ", position: " + gs.players[0].boardLocation); 
console.log(gs.movePlayer(1, 'd)'));
console.log("player: " + gs.players[1].id + ", position: " + gs.players[1].boardLocation);
console.log(gs.movePlayer(1, 'd)'));
console.log("player: " + gs.players[1].id + ", position: " + gs.players[1].boardLocation);
*/

console.log("Moving up");
console.log("\nplayer: " + gs.players[0].id + ", position: " + gs.players[0].boardLocation);
console.log(gs.movePlayer(0, 'd'));
console.log("\nplayer: " + gs.players[0].id + ", position: " + gs.players[0].boardLocation);
console.log(gs.movePlayer(0, 'd'));
console.log("\nplayer: " + gs.players[0].id + ", position: " + gs.players[0].boardLocation);