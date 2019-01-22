"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _index = _interopRequireDefault(require("./parse/index"));

var fs = require('fs-extra');

var Path = require('path');

var utils = require('./utils/index');

var log = utils.log;

function ignoreMatch(target) {
  var result = false;
  utils.getProjectConfig().ignore.forEach(function (v) {
    if (v === Path.parse(target).base) {
      result = true;
    }
  });
  return result;
}

function walk(_x) {
  return _walk.apply(this, arguments);
}

function _walk() {
  _walk = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee3(target) {
    var content, _content, dirs;

    return _regenerator.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            if (!ignoreMatch(target)) {
              _context3.next = 2;
              break;
            }

            return _context3.abrupt("return");

          case 2:
            if (!fs.lstatSync(target).isFile()) {
              _context3.next = 5;
              break;
            }

            if (Path.extname(target) === '.swan') {
              content = _index.default.wxml2swan(fs.readFileSync(target, {
                encoding: 'utf-8'
              }));
              fs.writeFileSync(target, content);
            } else if (Path.extname(target) === '.js') {
              _content = _index.default.wx2bdjs(fs.readFileSync(target, {
                encoding: 'utf-8'
              }));
              fs.writeFileSync(target, _content);
            }

            return _context3.abrupt("return");

          case 5:
            if (fs.lstatSync(target).isDirectory()) {
              dirs = fs.readdirSync(target);
              dirs.forEach(
              /*#__PURE__*/
              function () {
                var _ref2 = (0, _asyncToGenerator2.default)(
                /*#__PURE__*/
                _regenerator.default.mark(function _callee2(dir) {
                  return _regenerator.default.wrap(function _callee2$(_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          _context2.next = 2;
                          return walk(Path.join(target, dir));

                        case 2:
                        case "end":
                          return _context2.stop();
                      }
                    }
                  }, _callee2, this);
                }));

                return function (_x3) {
                  return _ref2.apply(this, arguments);
                };
              }()); // for (const value of dirs) {
              //   console.log(value, target);
              //   await walk(Path.join(target, value));
              // }
            }

          case 6:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));
  return _walk.apply(this, arguments);
}

module.exports =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(callback) {
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (utils.getProjectConfig()) {
              _context.next = 3;
              break;
            }

            log.error('未检测到配置文件，无法编译');
            return _context.abrupt("return");

          case 3:
            _context.next = 5;
            return walk(utils.getSrcPath());

          case 5:
            if (callback) {
              callback();
            }

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function (_x2) {
    return _ref.apply(this, arguments);
  };
}();