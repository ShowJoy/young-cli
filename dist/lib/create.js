"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var cmd = require('child_process').execSync;

var log = require('./utils/index').log;

var fs = require('fs-extra');

var Path = require('path');

module.exports =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(name) {
    var pkgPath, pkg;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;

            if (!fs.existsSync(name)) {
              _context.next = 4;
              break;
            }

            log.error('创建失败，目录已存在');
            return _context.abrupt("return");

          case 4:
            _context.next = 6;
            return fs.copySync(Path.join(__dirname, '../templates'), Path.resolve("".concat(name)));

          case 6:
            // write package.json
            pkgPath = Path.resolve("".concat(name, "/package.json"));
            pkg = require(pkgPath);
            pkg.name = name;
            fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2)); //

            log.info('创建目录成功');
            _context.next = 18;
            break;

          case 13:
            _context.prev = 13;
            _context.t0 = _context["catch"](0);
            console.log(_context.t0);
            log.error('创建目录失败');
            return _context.abrupt("return");

          case 18:
            // npm install
            log.info("\u5B89\u88C5\u4F9D\u8D56\u4E2D...");
            cmd("cd ".concat(Path.resolve(name), ";pwd; npm install"), {
              stdio: [0, 1, 2]
            });

          case 20:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 13]]);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();