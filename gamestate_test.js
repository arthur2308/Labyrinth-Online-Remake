/*jslint indent: 2, node: true, nomen: true */
var GameState = require('./gamestate.js'),
  gs;

gs = new GameState();
gs.createNewGame([12, 14, 16]);
console.log(gs.marshal());
