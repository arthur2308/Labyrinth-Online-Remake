/*jslint indent: 2, node: true, nomen: true */
/*globals
  $, chrome, document, DataView, TextEncoder, TextDecoder
*/
var VALID_PLAY_TINT = '#696969',
  BOARD_WIDTH = 9,
  _canvas,
  _stage,
  _img,
  _pieceWidth,
  _pieceHeight,
  _boardWidth,
  _boardHeight,
  _currentPiece,
  _previousLoc,
  _mouse;


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

$(document).ready(function () {
  "use strict";

  socks.onReceive.addListener(function (info) {
    log("Received: " + ab2str(info.data));
  });

  socks.onReceiveError.addListener(function (info) {
    log("ReceiveError " + JSON.stringify(info));
  });

  _img = new Image();
  _img.addEventListener('load',onImage,false);
  _img.src = "bkgrd.png";

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

function onImage(e) {
  "use strict";

  _pieceWidth = Math.floor(_img.width / BOARD_WIDTH);
  _pieceHeight = Math.floor(_img.height / BOARD_WIDTH);
  _boardWidth = _pieceWidth * BOARD_WIDTH;
  _boardHeight = _pieceHeight * BOARD_HEIGHT;
  setCanvas();
  initBoard();
}

function setCanvas() {
  "use strict";

  _canvas = document.getElementById('board');
  _stage = _canvas.getContext('2d');
  _canvas.width = _boardWidth;
  _canvas.height = _boardHeight;
  _canvas.style.border = "1px solid black";
}

function initBoard() {
  "use strict";

  _mouse = {x:0,y:0};
  _stage.drawImage(_img, 0, 0, _boardWidth, _boardHeight, 0, 0, _boardWidth, _boardHeight);
  buildTable();
}

function buildTable() {
  "use strict";

  var i,
    piece,
    xPos = 0,
    yPos = 0;

  for (i = 0; i < BOARD_WIDTH * BOARD_WIDTH; i += 1) {
    piece = new Image();
    if (xPos === 0 || yPos === 0 || xPos / _pieceWidth === BOARD_WIDTH-1 || yPos / _pieceHeight === BOARD_WIDTH-1) {
      piece.src = "bkgrd.png";
    }
    else {
      piece.src = "angle-d-l.png";
    }
    _stage.drawImage(piece, xPos, yPos, _pieceWidth, _pieceHeight);
    _stage.strokeRect(xPos, yPos, _pieceWidth, _pieceHeight);
    xPos += _pieceWidth;
    if (xPos >= _boardWidth) {
      xPos = 0;
      yPos += _pieceHeight;
    }
  }
}
