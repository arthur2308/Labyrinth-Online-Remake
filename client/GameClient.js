/*jslint indent: 2, node: true, nomen: true */
/*globals
  $, chrome, document, DataView, TextEncoder, TextDecoder
*/

var socks = chrome.sockets.tcp,
  socketId = '',
  log = function (msg) {
    "use strict";
    $('#console').append(msg + '<br>');
    console.log(msg);
  },
  str2ab = function (str) {
    "use strict";

    var encoder = new TextEncoder('utf-8');
    return encoder.encode(str).buffer;
  },
  ab2str = function (ab) {
    "use strict";

    var dataView = new DataView(ab),
      decoder = new TextDecoder('utf-8');
    return decoder.decode(dataView);
  };

function populateGameBoard(container, data) {
    $(".CSSTableGenerator").remove();
    var table = $("<table/>").addClass('CSSTableGenerator'), row, i, j;
    for (i = 0; i < 7; i += 1) {
      row = $("<tr/>");
      for (j = 0; j < 7; j += 1) {
        row.append($("<td/>")).append(data[j + (7 * i)]);
      }
      table.append(row);
    }
    return container.append(table);
}

function generateTile(openingTable, tokId) {
  var tileImg, tokImg;
  switch (openingTable.join()) {
    // The angle tiles
    case "true,true,false,false": tileImg = "1100.png"; break;
    case "false,true,true,false": tileImg = "0110.png"; break;
    case "false,false,true,true": tileImg = "0011.png"; break;
    case "true,false,false,true": tileImg = "1001.png"; break;
    // The tee tiles
    case "false,true,true,true": tileImg = "0111.png"; break;
    case "true,false,true,true": tileImg = "1011.png"; break;
    case "true,true,false,true": tileImg = "1101.png"; break;
    case "true,true,true,false": tileImg = "1110.png"; break;
    // The straight tiles
    case "true,false,true,false": tileImg = "1010.png"; break;
    case "false,true,false,true": tileImg = "0101.png"; break;
    default: console.log("Could not find case for given openingTable " + openingTable);
  }

  switch (tokId) {
    case -1: break;
    case 0: break;
    case 1: tokImg = "dragon.png"; break;
    case 2: tokImg = "ring.png"; break;
    case 3: tokImg = "owl.png"; break;
    case 4: tokImg = "spider.png"; break;
    case 5: tokImg = "sword.png"; break;
    case 6: tokImg = "money_bag.png"; break;
    case 7: tokImg = "tome.png"; break;
    case 8: tokImg = "candlestick.png"; break;
    case 9: tokImg = "map.png"; break;
    case 10: tokImg = "helmet.png"; break;
    case 11: tokImg = "bat.png"; break;
    case 12: tokImg = "princess.png"; break;
    case 13: tokImg = "keys.png"; break;
    case 14: tokImg = "hobbit.png"; break;
    case 15: tokImg = "chest.png"; break;
    case 16: tokImg = "skull.png"; break;
    case 17: tokImg = "beetle.png"; break;
    case 18: tokImg = "crown.png"; break;
    case 19: tokImg = "rat.png"; break;
    case 20: tokImg = "emerald.png"; break;
    case 21: tokImg = "moth.png"; break;
    case 22: tokImg = "genie.png"; break;
    case 23: tokImg = "ghost.png"; break;
    case 24: tokImg = "newt.png"; break;
    default: console.log("Could not find case for given tokId" + tokId);
  }
}

$(document).ready(function () {
  "use strict";
  var data = [], i, gameBoard;
  for (i = 0; i < 49; i += 1) {
    data.push('<img src="angle-d-l.png">');
  }
  var gameBoard = populateGameBoard($(document.body), data);
  socks.onReceive.addListener(function (info) {
    log("Received: " + ab2str(info.data));
  });

  socks.onReceiveError.addListener(function (info) {
    log("ReceiveError " + JSON.stringify(info));
  });

  $('#connect').click(function () {
    var server = $('#server').val();

    if (socketId !== '') {
      log('Already connected!');
      return;
    }

    socks.create({}, function (createInfo) {
      socketId = createInfo.socketId;
      log('socketId = ' + socketId);
      socks.connect(socketId, server, 8421, function (resultCode) {
        if (resultCode >= 0) {
          log('Connect succeeded: ' + resultCode);
          socks.setPaused(socketId, false);
        } else {
          socketId = '';
          log('Connect failed: ' + resultCode);
        }
      });
    });
  });

  $('#disconnect').click(function () {
    if (socketId === '') {
      log('Not connected!');
      return;
    }

    socks.disconnect(socketId, function () {
      socks.close(socketId, function () {
        socketId = '';
        log('Disconnected');
      });
    });
  });

  $('#send').click(function () {
    var msg = $('#sendMessage').val();

    if (socketId === '') {
      log('Not connected!');
      return;
    }

    socks.send(socketId, str2ab(msg), function (info) {
      log("Sent " + JSON.stringify(info));
    });
  });
});
