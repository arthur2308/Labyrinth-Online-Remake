/*jslint indent: 2, nomen: true */
/*globals
  chrome
*/

chrome.app.runtime.onLaunched.addListener(function () {
  "use strict";

  chrome.app.window.create('GameClient.html', {
    'bounds': {
      'width': 400,
      'height': 500
    }
  });
});