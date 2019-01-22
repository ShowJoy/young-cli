"use strict";

var chalk = require('chalk');

var color = {
  error: chalk.red,
  info: chalk.grey,
  warn: chalk.keyword('orange')
};

function log() {
  var D = new Date();
  var arr = [D.getHours(), D.getMinutes(), D.getSeconds()].map(function (v) {
    if (v < 10) {
      return "0".concat(v);
    }

    return v;
  });
  var r = Array.prototype.slice.call(arguments);
  r.unshift(chalk.grey("[".concat(arr.join(':'), "]")));
  console.log.apply(this, r);
}

function custom() {}

module.exports = {
  tag: function tag(_tag) {
    var r = Array.prototype.slice.call(arguments);
    r[0] = chalk.green(r[0]);
    log.apply(this, r);
  },
  info: function info() {
    log.apply(this, arguments);
  },
  warn: function warn() {
    var r = Array.prototype.slice.call(arguments);
    var arr = r.map(function (v) {
      return color.warn(v);
    });
    log.apply(this, arr);
  },
  error: function error() {
    var r = Array.prototype.slice.call(arguments);
    var arr = r.map(function (v) {
      return color.error(v);
    });
    log.apply(this, arr);
  }
};