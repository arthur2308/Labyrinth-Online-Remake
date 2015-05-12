/*jslint indent: 2, node: true, nomen: true */

var shuffle = require('shuffle-array');

function Tokens() {
  "use strict";
  this.toks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
  this.drawIndex = 0;
  shuffle(this.toks);
}
var tokens = Tokens.prototype;

tokens.drawToken = function () {
  "use strict";
  var returnTok;
  if (this.drawIndex > 23) {
    return -1;
  }
  returnTok = this.toks[this.drawIndex];
  this.drawIndex += 1;
  return returnTok;
};
module.exports = Tokens;
