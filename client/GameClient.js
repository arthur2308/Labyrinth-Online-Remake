/*jslint indent: 2, node: true, nomen: true */
/*globals
  $, chrome, document, DataView, TextEncoder, TextDecoder
*/

// Variable and function declaration
var socks = chrome.sockets.tcp,
  socketId,
  GameState = require("../gamestate.js"),
  gs = new GameState(),               // The gamestate object, containing the game logic and data
  myId = -1,                          // The id assigned to this client by the server, established during connection completion
  Tokens = require("../tokens.js"),
  Tiles  = require("../tiles.js"),
  Player = require("../player.js"),
  hasCollected = false,               // These three booleans help with turn sequencing
  hasSlid = false,
  isMyTurn = false,
  PASSWORD = "FABIO",                 // Password used to authenticate incoming/outgoing administrative messages
  socketId = '',                      
  finishTurn,
  setupTurn,
  renderScores,
  logCount = 0,
  getTok,
  movePlayer,
  slideTile,
  renderPreview,
  sendGamestate,
  populateToks,
  populateGameBoard,
  endGame,
  finBtn,
  pickupBtn,
  generateTile,
  rotBtn,

  // A function to write to the in-game console
  log = function (msg) {
    "use strict";
    logCount += 1;
    $('#msg' + (logCount - 3).toString()).remove();
    $('#console').append('<div id="msg' + logCount + '">' + msg + '<br></div>');
    console.log(msg + ', log count = ' + logCount);
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

// A function used to regulate turn sequencing. If the current client has won the game, it will be detected here. 
setupTurn = function () {
  "use strict";
  console.log("Setting up turn...");
  gs.checkForWinner();
  if (gs.winnerId !== -1) {
    log("Player " + gs.players[gs.winnerId].id.toString() + " has won the game!");
    endGame();
    return;
  }
  if (gs.players[gs.activePlayerNum].id === myId.toString()) {
    // It's this client's turn, do stuff
    log("It's your turn!");
    isMyTurn = true;
    
    if (hasCollected) {
      finishTurn();
      return;
    }
  }
  console.log("Turn setup complete!");
};

// This function is used when the game ends. It disables all client actions except chat. 
endGame = function () {
  "use strict";
  isMyTurn = false;
  hasSlid = true;
  hasCollected = true;
};

// When this client's turn needs to end, it will call this function
finishTurn = function () {
  "use strict";
  // Increment the active player number, within the bounds of the number of players in this game
  gs.activePlayerNum = (gs.activePlayerNum + 1) % gs.players.length;
  hasSlid = false;
  hasCollected = false;
  isMyTurn = false;
  // Send the modified gamestate back to the client. 
  sendGamestate();
  log("Ending turn.");
  setupTurn();
};

// Called when this client decides to finish their turn
finBtn = function () {
  "use strict";
  console.log("Finishing turn...");
  if (!isMyTurn) {
    log("It's not your turn!");
    return;
  }
  if (hasSlid) {
    finishTurn();
  } else {
    log("You must slide the tile before ending your turn.");
  }
  console.log("Turn finishing complete!");
};

// Called when this client decides to pick up a token
pickupBtn = function () {
  "use strict";
  console.log("Picking up token...");
  if (!isMyTurn) {
    log("It's not your turn!");
    return;
  }
  if (hasCollected) {
    log("You have already picked up a token this turn!");
  }
  if (gs.pickToken()) {
    log("You have picked up a token!");
    hasCollected = true;
    populateToks();
    renderScores();
    // Turn automatically ends when play picks up a token
    finishTurn();
  } else {
    log("Unable to pick up token.");
  }
  console.log("Token pickup complete!");
};

// Rotates the tile to be played (preview tile in some contexts)
rotBtn = function () {
  "use strict";
  if (!isMyTurn) {
    log("It's not your turn!");
    return;
  }
  console.log("Rotating tile...");
  gs.setOfTiles.tileSet[49].rotate(1);
  renderPreview();
  sendGamestate();
  console.log("Tile rotation complete!");
};

// Dynamically creates the scoreboard
renderScores = function () {
  "use strict";
  console.log("Rendering scores...");
  var i, scoreString = "";
  $('#scoreboard').empty();
  scoreString += "<p><strong>Current Scores (8 to win)</strong></p>";
  for (i = 0; i < gs.players.length; i += 1) {
    scoreString += '<div class="score"><p>Player ' + gs.players[i].id.toString() + ": " + gs.players[i].collectedTokens.length.toString() + '</p></div>';
  }
  $('#scoreboard').append(scoreString);
  console.log("Score rendering complete!");
};

movePlayer = function (direction) {
  "use strict";
  console.log("Moving player...");
  if (!isMyTurn) {
    log("It's not your turn!");
    return;
  }
  if (!hasSlid) {
    log("You must first slide the tile.");
    return;
  }
  if (gs.movePlayer(gs.activePlayerNum, direction)) {
    populateGameBoard($("#game_board"));
    sendGamestate();
  } else {
    log("Can't move that way!");
  }
  console.log("Player moving complete!");
};

slideTile = function (direction) {
  "use strict";
  console.log("Sliding tile...");
  if (hasSlid === true) {
    log('Already slid the tile this turn!');
    return;
  }
  if (!isMyTurn) {
    log("It's not your turn!");
    return;
  }
  // get index to slide tile into
  var index = parseInt($('#slide_index').val(), 10), tile;
  // slide the tile
  gs.slide(index, direction);
  $('#tile_img').remove();
  tile = gs.setOfTiles.tileSet[49];
  $('#tile_preview').append(generateTile(tile.openingTable, tile.tokID, -1, "tile_img"));
  populateGameBoard($("#game_board"));
  sendGamestate();
  hasSlid = true;
  console.log("Slid " + direction + "at index " + index);
  setupTurn();
  console.log("Tile sliding complete!");
};

renderPreview = function () {
  "use strict";
  console.log("Rendering preview...");
  var tile = gs.setOfTiles.tileSet[49];
  $('#tile_img').remove();
  $('#tile_preview').append(generateTile(tile.openingTable, tile.tokID, -1, "tile_img"));
  console.log("Preview rendering complete!");
};

sendGamestate = function () {
  "use strict";
  //console.log("Sending gamestate...");
  var i, msg = PASSWORD + "\n" + "GAMESTATE\n";
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
  socks.send(socketId, str2ab(msg), function (info) {
    //console.log("Sent " + info.length + " characters to server.");
    //log("Sent gamestate to server.");
  });
};

$(document).ready(function () {
  "use strict";
  // **** RECEIVE LISTENER ****
  socks.onReceive.addListener(function (info) {
    var msg = ab2str(info.data), adminMsg, gameStr = "", i, j, currentIndex, numPlayers;
    adminMsg = msg.toString().split('\n');
    // is this an admin message?          // An admin message is a system communication message
    if (adminMsg[0] === PASSWORD) {
      // Yes, decode it

      // Remove first element
      adminMsg.shift();
      if (adminMsg[0] === "ID_ASSIGNMENT") {
        adminMsg.shift();
        myId = adminMsg[0];
        log("Assigned ID " + myId + " by the server.");
        return;
      }

      if (adminMsg[0] === "GAMESTATE") {
        adminMsg.shift();
        gameStr = adminMsg;
        // Get number of players
        numPlayers = parseInt(gameStr[0], 10);
        //console.log("**TEST** numPlayers = " + numPlayers);

        // Recreate players
        i = 1;
        currentIndex = 0;
        gs.players = [];
        while (i < ((numPlayers * 3) + 1)) {
          gs.players[currentIndex] = new Player(0, 0, []);
          gs.players[currentIndex].id = gameStr[i].toString();
          i += 1;
          gs.players[currentIndex].boardLocation = parseInt(gameStr[i], 10);
          i += 1;
          gs.players[currentIndex].collectedTokens = gameStr[i].split(',');
          for (j = 0; j < gs.players[currentIndex].collectedTokens.length; j += 1) {
            gs.players[currentIndex].collectedTokens[j] = parseInt(gs.players[currentIndex].collectedTokens[j], 10);
          }
          if (isNaN(gs.players[currentIndex].collectedTokens)) {
            gs.players[currentIndex].collectedTokens = [];
          }
          i += 1;
          console.log("Player created: id = " + gs.players[currentIndex].id + " board location = " + gs.players[currentIndex].boardLocation + " collected tokens = " + gs.players[currentIndex].collectedTokens);
          currentIndex += 1;
        }

        // Recreate the gameboard
        currentIndex = 0;
        gs.setOfTiles = new Tiles();
        while (currentIndex < 50) {
          gs.setOfTiles.tileSet[currentIndex].tokID = parseInt(gameStr[i], 10);
          i += 1;
          gs.setOfTiles.tileSet[currentIndex].openingTable = gameStr[i].split(',');
          i += 1;
          currentIndex += 1;
        }
        // Recreate last index
        gs.setOfTiles.playableTileLastCoord = parseInt(gameStr[i], 10);
        //console.log("lastPlayableTile = " + gs.setOfTiles.playableTileLastCoord);
        i += 1;
        // Recreate the tokens
        gs.setOfToks = new Tokens();
        gs.setOfToks.toks = gameStr[i].split(',');
        //console.log("Set of toks = " + gs.setOfToks.toks);
        i += 1;
        gs.setOfToks.drawIndex = parseInt(gameStr[i], 10);
        //console.log("Draw index = " + gs.setOfToks.drawIndex);
        i += 1;
        // Recreate misc attributes
        gs.activePlayerNum = parseInt(gameStr[i], 10);
        //console.log("activePlayerNum = " + gs.activePlayerNum);
        i += 1;
        gs.winnerId = parseInt(gameStr[i], 10);
        //console.log("winnerId = " + gs.winnerId);
        i += 1;
        gs.drawnToks = gameStr[i].split(',');
        console.log("drawnToks = " + gs.drawnToks);
        for (i = 0; i < gs.drawnToks.length; i += 1) {
          gs.drawnToks[i] = parseInt(gs.drawnToks[i], 10);
        }

        populateGameBoard($("#game_board"));
        log("Gamestate info received from server");
        setupTurn();
        return;
      }
    }
    log(msg);
  });

  socks.onReceiveError.addListener(function (info) {
    log("ReceiveError " + JSON.stringify(info));
  });

  // Move the players
  $('#m_up').click(function () {
    movePlayer('u');
  });

  $('#m_down').click(function () {
    movePlayer('d');
  });

  $('#m_left').click(function () {
    movePlayer('l');
  });
  
  $('#m_right').click(function () {
    movePlayer('r');
  });

  // Rotate the tile
  $('#rot_tile').click(function () {
    rotBtn();
  });

  // Slide the tiles
  $('#s_up').click(function () {
    slideTile('u');
  });

  $('#s_right').click(function () {
    slideTile('r');
  });

  $('#s_down').click(function () {
    slideTile('d');
  });

  $('#s_left').click(function () {
    slideTile('l');
  });

  $('#fin').click(function () {
    finBtn();
  });

  $('#pickup').click(function () {
    pickupBtn();
  });

  // Plays and loops ambiance at beginning of client startup
  $("#jquery_jplayer_1").jPlayer( {
    ready: function(event) {
      $(this).jPlayer("setMedia", {
	title: "Ambiance",
	mp3: "69_Forest_Night.mp3"
      }).jPlayer("play");
    },
    ended: function () {
      $(this).jPlayer("play");
    },
    supplied: "mp3"
                
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
      console.log("Sent " + info.length + " characters to the server.");
    });
  });
});

getTok = function (tokId) {
  "use strict";
  //console.log("Retrieving token image...");
  var tokImg;
  switch (parseInt(tokId, 10)) {
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
    console.log("Could not find case for given tokId " + tokId);
  }
  //console.log("Retrieved token image! tokImg = " + tokImg);
  return tokImg;
};

// Generates a single tile. tokId and playerId are -1 if not present
generateTile = function (openingTable, tokId, playerIndex, div_id) {
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

  tokImg = getTok(tokId);

  switch (playerIndex) {
  case -1:
    break;
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
};

populateToks = function () {
  "use strict";
  var i, tokImg;
  $('.drawn_toks').remove();
  for (i = 0; i < gs.drawnToks.length; i += 1) {
    tokImg = getTok(gs.drawnToks[i]);
    $('#drawn_toks').append('<img class="drawn_toks" src="' + tokImg + '" style="position: absolute; top: 10px; left: ' + (100 * i) + 'px;"/></div>');
  }
};

// A function that dynamically creates the gameboard using the current gamestate
populateGameBoard = function (container) {
  "use strict";
  var table, playerIndex, row, i, j, k, tile;
  //console.log("*Sanity check*, gs.setOfTiles.tileSet[0].tokID = " + gs.setOfTiles.tileSet[0].tokID);
  $(".CSSTableGenerator").remove();
  table = $("<table/>").addClass('CSSTableGenerator');
  for (i = 0; i < 7; i += 1) {
    row = $("<tr/>");
    for (j = 0; j < 7; j += 1) {
      tile = gs.setOfTiles.tileSet[j + (7 * i)];
      playerIndex = -1;
      for (k = 0; k < gs.players.length; k += 1) {
        if (gs.players[k].boardLocation === j + (7 * i)) {
          playerIndex = k;
          break;
        }
      }
      row.append($("<td/>")).append(generateTile(tile.openingTable, tile.tokID, playerIndex, "tile"));
      //console.log("Rendered tile with token: " + tile.tokID);
    }
    table.append(row);
  }
  populateToks();
  renderScores();
  renderPreview();
  return container.append(table);
};
