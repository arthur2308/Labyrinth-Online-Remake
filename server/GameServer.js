/*jslint indent: 2, node: true, nomen: true */
var GameState = require('../gamestate.js'), socks = [], PLAYERS = 2, nextPlayer = 0, i, PASSWORD = "FABIO", gs, fs = require('fs');
gs = new GameState();
module.exports = (function () {
  "use strict";

  var net = require('net'),
    server = net.createServer(function (sock) {
      var idArr = [], i;
      // We have a connection - a socket object is assigned to the connection automatically
      console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);
      sock.setEncoding('utf8');
      // Add the client socket to the socket storage
      if (socks.length >= PLAYERS) {
        sock.end("Server is full. Cannot join game", 'utf8');
        console.log("FULL SERVER. SOCKET REJECTED.");
      }
      else {
        socks.push(sock);
        sock.write(PASSWORD+'\n'+"ID_ASSIGNMENT\n"+socks.length, 'utf8');
        console.log("ASSIGNED " + sock.remoteAddress + ':' + sock.remotePort + " ID " + socks.length);
        if (socks.length === PLAYERS) {
          var gameStr;
          // start the game
          for (i = 0; i < PLAYERS; i += 1) {
            idArr.push(i);
          }
          gs.createNewGame(idArr);
          gs.marshal();
          gameStr = fs.readFileSync("game.txt").toString();
          for (i = 0; i < socks.length; i += 1) {
            socks[i].write(PASSWORD+'\n'+"GAMESTATE\n"+gameStr);
            console.log("SENT GAMESTATE TO " + socks[i].remoteAddress + ':' + socks[i].remotePort);
          }
        }
      }

      // Add a 'data' event handler to this instance of socket
      sock.on('data', function (data) {
        var message, gsString
        console.log('DATA ' + sock.remoteAddress + ':' + sock.remotePort + ' : ' + data);
        // Write the data back to the socket, the client will receive it as data from the server
        for (i = 0; i < socks.length; i += 1)
        if (socks[i].write(sock.remoteAddress + ':' + sock.remotePort + ' said "' + data + '"', 'utf8')) {
            console.log('SENT REPLY');
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
