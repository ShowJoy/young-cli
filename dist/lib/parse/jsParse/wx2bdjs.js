"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _core = require("@babel/core");

var _generator = _interopRequireDefault(require("@babel/generator"));

var types = _interopRequireWildcard(require("@babel/types"));

function wx2bdjs(src) {
  var _transformSync = (0, _core.transformSync)(src, {
    ast: true
  }),
      ast = _transformSync.ast; // console.log('haha', types.binaryExpression("*", types.identifier("a"), types.identifier("b")));


  (0, _core.traverse)(ast, {
    // MemberExpression(path, state) {
    //   // 以wx.开头的方法替换
    //   console.log('MemberExpression', path.get('object.name').node)
    //   if (path.get('object').isIdentifier({name: 'wx'})) {
    //     path.get('object').node.name = 'swan';
    //   }
    // },
    // CallExpression (path) {
    //   console.log('CallExpression')
    //   let caller = path.get('callee');
    //   if (caller.isMemberExpression()) {
    //     if (caller.get('object.name').node == 'wx') {
    //       console.log(caller.get('computed').node, path.get('callee.property').node, path.get('arguments').node);
    //     }
    //   }
    // },
    Identifier: function Identifier(path) {
      // console.log('identifier=', path.get('name').node, path.scope.hasBinding('wx'), path.isReferencedIdentifier());
      if (path.get('name').node === 'wx' && !path.scope.hasBinding('wx') && path.isReferencedIdentifier()) {
        path.replaceWith(types.Identifier('swan'));
      }
    }
  });
  return (0, _generator.default)(ast).code;
}

var _default = wx2bdjs;
exports.default = _default;
module.exports = exports.default;