/*jslint indent: 2, node: true, nomen: true */
var GameState = require('../gamestate.js'), socks = [], PLAYERS = 3, nextPlayer = 0, i;
module.exports = (function () {
  "use strict";

  var net = require('net'),
    server = net.createServer(function (sock) {

      // We have a connection - a socket object is assigned to the connection automatically
      console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);
      sock.setEncoding('utf8');
      // Add the client socket to the socket storage 
      socks.push(sock);

      // Add a 'data' event handler to this instance of socket
      sock.on('data', function (data) {

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
