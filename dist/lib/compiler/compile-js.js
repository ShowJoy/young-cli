"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var babel = require('@babel/core');

var fs = require('fs');

var Path = require('path');

var fse = require('fs-extra');

var utils = require('../utils/index');

var log = utils.log;
var modulesDir = 'node_modules';
var isPrivatePack = /^\@[\w\d\-\_\.]+\/[\w\d\-_\.]+$/; // fix infinite loop

var jsTree = {};

function existInPkg(lib) {
  var pkg = utils.getProjectPkg();
  var libs = Object.assign(pkg.devDependencies, pkg.dependencies);
  return libs[lib];
}

function findMainJs(modules) {
  var pkg = require(Path.resolve("".concat(modulesDir, "/").concat(modules, "/package.json")));

  var main = "".concat(modulesDir, "/").concat(modules, "/").concat(pkg.main || './index.js');
  main = utils.jsRequire(main);
  return main;
}

function analyse(code, from) {
  return code.replace(/require\(['"]([\w\d_\-\.\/\@]+)['"]\)/ig, function (match, lib) {
    if (Path.isAbsolute(lib)) {
      // if path in src directory => solve  exp: require('/user/work/project/a.js')
      var absoluteSrc = Path.join(__dirname, utils.getSrcPath());
      var absoluteDist = Path.join(__dirname, utils.getDistPath());

      if (lib.indexOf(absoluteSrc) === 0) {
        lib = lib.replace(absoluteSrc, absoluteDist);
      }
    } else if (lib[0] === '.') {
      // require('./utils/test')
      // solve modules require file
      if (from.indexOf('node_modules') > -1) {
        var file = utils.jsRequire(Path.join(Path.dirname(from), lib));
        compiler(file);
      }
    } // TODO startWith .. copy the file ?
    else if (lib.indexOf('/') === -1 || lib.indexOf('/') === lib.length - 1) {
        // require('module')
        if (!fs.existsSync("".concat(modulesDir, "/").concat(lib))) {
          log.error("\u672A\u80FD\u591F\u5728".concat(modulesDir, "\u91CC\u627E\u5230").concat(lib, ",\u8BF7\u786E\u8BA4\u662F\u5426\u5B89\u88C5"));
        }

        var main = findMainJs(lib);

        if (!fs.existsSync(main)) {
          log.error("".concat(main, "\u4E0D\u5B58\u5728\uFF0C\u8BF7\u786E\u8BA4\u662F\u5426\u5B89\u88C5"));
        } // 'modules' => ./npm/modules/index.js


        lib = Path.relative(Path.dirname(utils.getOutputFile(from)), utils.getOutputFile(main));
        compiler(main);
      } else if (lib.indexOf('/') > -1 && lib.indexOf('/') !== 0) {
        // require('babel-core/index') or require(@linhun/jane)
        var path;

        if (isPrivatePack.test(lib)) {
          path = findMainJs(lib);
        } else {
          path = utils.jsRequire("".concat(modulesDir, "/").concat(lib));
        }

        if (!path) {
          log.error("\u672A\u80FD\u591F\u5728".concat(modulesDir, "\u91CC\u627E\u5230").concat(lib, ",\u8BF7\u786E\u8BA4\u662F\u5426\u5B89\u88C5"));
          return lib;
        }

        lib = Path.relative(Path.dirname(utils.getOutputFile(from)), utils.getOutputFile(path));
        compiler(path);
      }

    if (/^npm/.test(lib)) {
      lib = "./".concat(lib);
    } // todo fix //


    return "require('".concat(lib, "')");
  });
}

function compiler(_x, _x2) {
  return _compiler.apply(this, arguments);
}

function _compiler() {
  _compiler = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(from, dir) {
    var config, result, to, tag;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            config = utils.getProjectConfig(dir).js.config;

            if (config.sourceMaps === undefined) {
              config.sourceMaps = 'inline';
            }

            config.comments = false; // fix infinite require loop not on watching mode

            if (!jsTree[from]) {
              _context.next = 5;
              break;
            }

            return _context.abrupt("return");

          case 5:
            try {
              if (from.indexOf(modulesDir) > -1) {
                result = {
                  code: fs.readFileSync(from, 'utf8')
                };
              } else {
                result = babel.transformFileSync(from, config);
              }

              to = utils.getOutputFile(from);
              jsTree[from] = to;
              result.code = analyse(result.code, from); // write in
              // await utils.write(to, result.code)
              // fs.writeFileSync(to,result.code,'utf8')

              fse.outputFileSync(to, result.code);
              tag = '写入js';

              if (from.indexOf(modulesDir) > -1) {
                tag = '复制依赖';
              }

              log.tag(tag, "".concat(to));
            } catch (err) {
              if (err) {
                console.log(err); // log.info cant print all message on babel error
              }
            }

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _compiler.apply(this, arguments);
}

function clearTrace() {
  jsTree = {};
}

module.exports = {
  clearTrace: clearTrace,
  compiler: compiler
};