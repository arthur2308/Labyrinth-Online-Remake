/*jslint indent: 2, node: true, nomen: true */
var GameState = require('./gamestate.js'), gs, i, arr;

gs = new GameState();
gs.createNewGame([12, 14, 16]);
console.log(gs.marshal());
console.log("** Reading from file **");
arr = gs.createFromFile("game.txt");
console.log(arr);
