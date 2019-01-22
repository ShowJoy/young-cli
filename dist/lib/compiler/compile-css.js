"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var fs = require('fs');

var fse = require('fs-extra');

var utils = require('../../utils/index');

var config = utils.getProjectConfig().css.config;
var log = utils.log;
var projectConfig = utils.getProjectConfig();

module.exports =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(path) {
    var output, option, result;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            output = utils.getOutputFile(path.replace(projectConfig.css.ext, '.wxss'));
            option = Object.assign({
              file: path
            }, config);
            _context.prev = 2;
            _context.next = 5;
            return projectConfig.css.compiler(option);

          case 5:
            result = _context.sent;
            fse.outputFileSync(output, result.css);
            log.tag('写入css', "".concat(utils.getOutputFile(output)));
            _context.next = 13;
            break;

          case 10:
            _context.prev = 10;
            _context.t0 = _context["catch"](2);
            console.log(_context.t0);

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[2, 10]]);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();