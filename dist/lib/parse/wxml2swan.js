"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _index = _interopRequireDefault(require("./index"));

var _pretty = _interopRequireDefault(require("pretty"));

var _mp = require("./const/mp");

function wxml2swan(content) {
  var options = {
    plugins: [function parseNode(node) {
      /**
       *  处理属性
       */
      Object.keys(node.attr || {}).forEach(function (key) {
        var attr = _mp.wxMapToSwanAttrs.find(function (attr) {
          return attr[0] === key;
        }); // 是否需要改变属性名


        if (attr) {
          node.attr[attr[1]] = node.attr[key]; // 是否需要去掉花括号的属性

          if (_mp.removeBraceAttrs.includes(key)) {
            node.attr[attr[1]] = node.attr[key].replace(/{{([^{}]+)}}/g, '$1');
          } // 删掉旧属性名


          delete node.attr[attr[0]];
        }
      });
      /**
       * 处理模板
       */

      if (node.tag === 'template' && node.attr && node.attr.data) {
        node.attr.data = node.attr.data.replace(/({{)(.+)(}})/g, '$1{$2}$3');
      }
      /**
       * 处理标签
       */


      if (_mp.modifySuffixTags.includes(node.tag)) {
        if (node.attr && node.attr.src) {
          node.attr.src = node.attr.src.replace(/(.*).wxml$/, '$1.swan');
        } // 特殊wxs to filter


        if (node.tag === 'wxs') {
          // 会出现invalid state: mismatch end tag，因为先改了配对的标签，遍历到关闭标签时匹配 不对，不影响
          node.tag = 'filter';
        }
      }
    }],
    visitors: {
      img: function img(node) {
        node.styleStr = 'display:block;';
      }
    }
  };

  var obj = _index.default.htmlParse(content, options);

  var str = _index.default.json2html(obj);

  return (0, _pretty.default)(str, {
    ocd: true,
    wrapAttributes: true
  });
}

var _default = wxml2swan;
exports.default = _default;
module.exports = exports.default;