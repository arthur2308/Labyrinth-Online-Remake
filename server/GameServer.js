/*jslint indent: 2, node: true, nomen: true */

module.exports = (function () {
  "use strict";

  var net = require('net'),
    server = net.createServer(function (sock) {

      // We have a connection - a socket object is assigned to the connection automatically
      console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);

      sock.setEncoding('utf8');

      // Add a 'data' event handler to this instance of socket
      sock.on('data', function (data) {

        console.log('DATA ' + sock.remoteAddress + ':' + sock.remotePort + ' : ' + data);
        // Write the data back to the socket, the client will receive it as data from the server
        if (sock.write('You said "' + data + '"', 'utf8')) {
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
