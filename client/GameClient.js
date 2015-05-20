/*jslint indent: 2, node: true, nomen: true */
/*globals
  $, chrome, document, DataView, TextEncoder, TextDecoder
*/

var socks = chrome.sockets.tcp, socketId, GameState = require("../gamestate.js"),
  gs = new GameState(),
  socketId = '', log = function (msg) {
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

// Generates a single tile. tokId and playerId are -1 if not present
function generateTile(openingTable, tokId, playerIndex, div_id) {
  "use strict";
  var tileImg, tokImg, playerImg, elementString;
  switch (openingTable.join()) {
// The angle tiles
  case "true,true,false,false":
    tileImg = "1100.png";
    break;
  case "false,true,true,false":
    tileImg = "0110.png";
    break;
  case "false,false,true,true":
    tileImg = "0011.png";
    break;
  case "true,false,false,true":
    tileImg = "1001.png";
    break;
// The tee tiles
  case "false,true,true,true":
    tileImg = "0111.png";
    break;
  case "true,false,true,true":
    tileImg = "1011.png";
    break;
  case "true,true,false,true":
    tileImg = "1101.png";
    break;
  case "true,true,true,false":
    tileImg = "1110.png";
    break;
    // The straight tiles
  case "true,false,true,false":
    tileImg = "1010.png";
    break;
  case "false,true,false,true":
    tileImg = "0101.png";
    break;
  default:
    console.log("Could not find case for given openingTable " + openingTable);
  }

  switch (tokId) {
  case -1:
    tokImg = "no_img.png";
    break;
  case 0:
    tokImg = "no_img.png";
    break;
  case 1:
    tokImg = "dragon.png";
    break;
  case 2:
    tokImg = "ring.png";
    break;
  case 3:
    tokImg = "owl.png";
    break;
  case 4:
    tokImg = "spider.png";
    break;
  case 5:
    tokImg = "sword.png";
    break;
  case 6:
    tokImg = "money_bag.png";
    break;
  case 7:
    tokImg = "tome.png";
    break;
  case 8:
    tokImg = "candlestick.png";
    break;
  case 9:
    tokImg = "map.png";
    break;
  case 10:
    tokImg = "helmet.png";
    break;
  case 11:
    tokImg = "bat.png";
    break;
  case 12:
    tokImg = "princess.png";
    break;
  case 13:
    tokImg = "keys.png";
    break;
  case 14:
    tokImg = "hobbit.png";
    break;
  case 15:
    tokImg = "chest.png";
    break;
  case 16:
    tokImg = "skull.png";
    break;
  case 17:
    tokImg = "beetle.png";
    break;
  case 18:
    tokImg = "crown.png";
    break;
  case 19:
    tokImg = "rat.png";
    break;
  case 20:
    tokImg = "emerald.png";
    break;
  case 21:
    tokImg = "moth.png";
    break;
  case 22:
    tokImg = "genie.png";
    break;
  case 23:
    tokImg = "ghost.png";
    break;
  case 24:
    tokImg = "newt.png";
    break;
  default:
    console.log("Could not find case for given tokId" + tokId);
  }

  switch (playerIndex) {
  case 0:
    playerImg = "player_dot_0.png";
    break;
  case 1:
    playerImg = "player_dot_1.png";
    break;
  case 2:
    playerImg = "player_dot_2.png";
    break;
  case 3:
    playerImg = "player_dot_3.png";
    break;
  default:
    console.log("Could not find match for playerIndex " + playerIndex);
  }

  elementString = '<div id="' + div_id + '" style="position: relative; left: 0; top: 0;"><img src="' + tileImg;
  elementString += '" style="position: relative; top: 0; left: 0;"/><img src="' + tokImg;
  elementString += '" style="position: absolute; top: 10px; left: 10px;"/>';
  if (playerIndex !== -1) {
    elementString += '<img src="' + playerImg + '" style="position: absolute; top: 10px; left: 10px;"/></div>';
  }
  
  return elementString;
}

function populateGameBoard(container) {
  "use strict";
  var table, openingTable, tokId, playerIndex, row, i, j, k;
  $(".CSSTableGenerator").remove();
  table = $("<table/>").addClass('CSSTableGenerator');
  for (i = 0; i < 7; i += 1) {
    row = $("<tr/>");
    for (j = 0; j < 7; j += 1) {
      openingTable = gs.setOfTiles.tileSet[j + (7 * i)].openingTable;
      tokId = gs.setOfTiles.tileSet[j + (7 * i)].tokID;
      console.log("tokId is " + tokId);
      playerIndex = -1;
      for (k = 0; k < gs.players.length; k += 1) {
        if (gs.players[k].boardLocation === j + (7 * i)) {
          playerIndex = k;
          break;
        }
      }
      row.append($("<td/>")).append(generateTile(openingTable, tokId, playerIndex, "tile"));
    }
    table.append(row);
  }
  return container.append(table);
}


$(document).ready(function () {
  "use strict";
  gs.createNewGame([11, 12, 13]); // Test
  populateGameBoard($("#game_board"));
  socks.onReceive.addListener(function (info) {
    log("Received: " + ab2str(info.data));
  });

  socks.onReceiveError.addListener(function (info) {
    log("ReceiveError " + JSON.stringify(info));
  });

  $('#m_up').click(function() {
    gs.movePlayer(0, 'u');
    populateGameBoard($("#game_board"));
  });

  $('#m_down').click(function() {
    gs.movePlayer(0, 'd');
    populateGameBoard($("#game_board"));
  });

  $('#m_left').click(function() {
    gs.movePlayer(0, 'l');
    populateGameBoard($("#game_board"));
  });

  $('#m_right').click(function() {
    gs.movePlayer(0, 'r');
    populateGameBoard($("#game_board"));
  });

  $('#rot_tile').click(function() {
    var tile;
    gs.setOfTiles.tileSet[49].rotate(1);
    tile = gs.setOfTiles.tileSet[49];
    console.log("proof of life!: " + tile.openingTable);
    $('#tile_img').remove();
    $('#tile_preview').append(generateTile(tile.openingTable, tile.tokID, -1, "tile_img"));
  });

  $('#s_up').click(function() {
    // get index to slide tile into
    var index = parseInt($('#slide_index').val()), i, tile;
    // slide the tile
    gs.slide(index, 'u');
    $('#tile_img').remove();
    tile = gs.setOfTiles.tileSet[49];
    $('#tile_preview').append(generateTile(tile.openingTable, tile.tokID, -1, "tile_img"));
    populateGameBoard($("#game_board"));
    console.log("Slid up at index " + index);
  });

  $('#s_right').click(function() {
    // get index to slide tile into
    var index = parseInt($('#slide_index').val()), i, tile;
    // slide the tile
    gs.slide(index, 'r');
    $('#tile_img').remove();
    tile = gs.setOfTiles.tileSet[49];
    $('#tile_preview').append(generateTile(tile.openingTable, tile.tokID, -1, "tile_img"));
    populateGameBoard($("#game_board"));
    console.log("Slid right at index " + index);
  });

  $('#s_down').click(function() {
    // get index to slide tile into
    var index = parseInt($('#slide_index').val()), i, tile;
    // slide the tile
    gs.slide(index, 'd');
    $('#tile_img').remove();
    tile = gs.setOfTiles.tileSet[49];
    $('#tile_preview').append(generateTile(tile.openingTable, tile.tokID, -1, "tile_img"));
    populateGameBoard($("#game_board"));
    console.log("Slid down at index " + index);
   
  });

  $('#s_left').click(function() {
    // get index to slide tile into
    var index = parseInt($('#slide_index').val()), i, tile;
    // slide the tile
    gs.slide(index, 'l');
    $('#tile_img').remove();
    tile = gs.setOfTiles.tileSet[49];
    $('#tile_preview').append(generateTile(tile.openingTable, tile.tokID, -1, "tile_img"));
    populateGameBoard($("#game_board"));
    console.log("Slid left at index " + index);

  });

  $('#fin').click(function() {

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
