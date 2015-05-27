/*jslint indent: 2, node: true, nomen: true */
var GameState = require('../gamestate.js'), 
socks = [],
PLAYERS = 1,
nextPlayer = 0,
i,
PASSWORD = "FABIO",
gs,
idArr = [],
fs = require('fs');
gs = new GameState();
module.exports = (function () {
  "use strict";

  var net = require('net'),
    server = net.createServer(function (sock) {
      // We have a connection - a socket object is assigned to the connection automatically
      console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);
      sock.setEncoding('utf8');
      // Add the client socket to the socket storage
      if (socks.length >= PLAYERS) {
        sock.end("Server is full. Cannot join game", 'utf8');
        console.log("FULL SERVER. SOCKET REJECTED.");
      }
      else {
        // Add new connection to the list of connections
        socks.push(sock);
        // Add the id of the new connections to the list of IDs
        idArr.push(sock.remotePort);
        sock.write(PASSWORD+'\n'+"ID_ASSIGNMENT\n" + idArr[idArr.length - 1], 'utf8');
        console.log("ASSIGNED " + sock.remoteAddress + ':' + sock.remotePort + " ID " + idArr[idArr.length - 1]);
        if (socks.length === PLAYERS) {
          var msg;
          // start the game
          console.log("**TEST** idArr = " + idArr);
          gs.createNewGame(idArr);
          console.log("**TEST** Players = ");
          for (i = 0; i < gs.players.length; i += 1) {
            console.log(gs.players[i].id + ", " + gs.players[i].boardLocation + ", " + gs.players[i].collectedTokens);
          }
          msg = PASSWORD + "\n" + "GAMESTATE\n";
          msg += gs.players.length + "\n"; // Num of players in file
          for (i = 0; i < gs.players.length; i += 1) {
            msg += gs.players[i].id + "\n";
            msg += gs.players[i].boardLocation + "\n";
            msg += gs.players[i].collectedTokens + "\n";
          }

          // Do the tiles
          for (i = 0; i < 50; i += 1) {
            msg += gs.setOfTiles.tileSet[i].tokID + "\n";
            msg += gs.setOfTiles.tileSet[i].openingTable + "\n";
          }
          msg += gs.setOfTiles.playableTileLastCoord + "\n";

          // Do the tokens
          msg += gs.setOfToks.toks + "\n";
          msg += gs.setOfToks.drawIndex + "\n";

          // Misc attributes
          msg += gs.activePlayerNum + "\n";
          msg += gs.winnerId + "\n";
          msg += gs.drawnToks;

          for (i = 0; i < socks.length; i += 1) {
            socks[i].write(msg);
            console.log("SENT GAMESTATE TO " + socks[i].remoteAddress + ':' + socks[i].remotePort);
            console.log("SENT:\n" + msg);
          }
        }
      }

      // Add a 'data' event handler to this instance of socket
      sock.on('data', function (data) {
        var message, gsString
        console.log('DATA ' + sock.remoteAddress + ':' + sock.remotePort + ' : ' + data);
        message = data.toString().split("\n");
        if (message[0] === PASSWORD) {
          // Lets decode this admin message
          console.log("AN ADMIN MESSAGE ARRIVED FROM " + sock.remoteAddress + ':' + sock.remotePort);
          for (i = 0; i < socks.length; i += 1) {
            if (socks[i] !== sock) {
              socks[i].write(data);
            }
          }
        }
        else {
        // Write the data back to the socket, the client will receive it as data from the server
          for (i = 0; i < socks.length; i += 1)
            if (socks[i].write(sock.remoteAddress + ':' + sock.remotePort + ' said "' + data + '"', 'utf8')) {
          console.log('SENT REPLY');
            }
        }
      });

      // Add a 'close' event handler to this instance of socket
      sock.on('close', function (data) {
        /*jslint unparam: true */
        console.log('CLOSED: ' + sock.remoteAddress + ':' + sock.remotePort);
      });

    });

  return {
    begin: function () {
      server.listen(8421);
      console.log('LISTENING');
    }
  };
}());
