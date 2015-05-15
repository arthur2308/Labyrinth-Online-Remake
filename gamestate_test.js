/*jslint indent: 2, node: true, nomen: true */
var GameState = require('./gamestate.js'), gs, gs1, i, arr;

gs = new GameState();
gs.createNewGame([12, 14, 16]);
gs.activePlayerNum = 45;
gs.winnderId = 77;
gs.drawnToks = [55, 66, 77];
console.log(gs.marshal());
console.log("** Reading from file **");

gs1 = new GameState();
arr = gs1.createFromFile("game.txt");
console.log(arr);

