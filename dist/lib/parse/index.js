"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _html2json = _interopRequireDefault(require("./html2json"));

var _json2html = _interopRequireDefault(require("./json2html"));

var _wxml2swan = _interopRequireDefault(require("./wxml2swan"));

var _wx2bdjs = _interopRequireDefault(require("./jsParse/wx2bdjs"));

/**
 * utils函数引入
 **/

/**
 * 主函数入口区
 **/
function htmlParse() {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '<div></div>';
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var transData = {}; //存放转化后的数据

  var res = {}; //返回的数据

  transData = (0, _html2json.default)(data, 'root', options); // console.log('解析结果是', transData);

  res = transData;
  return res;
}

var _default = {
  htmlParse: htmlParse,
  json2html: _json2html.default,
  wxml2swan: _wxml2swan.default,
  wx2bdjs: _wx2bdjs.default
};
exports.default = _default;
module.exports = exports.default;