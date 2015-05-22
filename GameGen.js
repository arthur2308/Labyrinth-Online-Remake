/*jslint indent: 2, node: true, nomen: true, stupid: true, plusplus: true */

var GameState = require('./gamestate.js'), gs;


gs = new GameState();
gs.createNewGame([7, 3, 6]);

gs.activePlayerNum = 4;
gs.winnerId = 3;
gs.drawnToks = [1, 4, 6, 3, 23];
gs.marshal();