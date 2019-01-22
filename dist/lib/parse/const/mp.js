"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.modifySuffixTags = exports.wxMapToSwanPrefix = exports.wxMapToSwanAttrs = exports.removeBraceAttrs = void 0;
// 渠道双括号的属性数组
var removeBraceAttrs = ['wx:if', 'wx:elif', 'wx:for', 'wx:key']; // 微信映射到百度属性名

exports.removeBraceAttrs = removeBraceAttrs;
var wxMapToSwanAttrs = [['wx:if', 's-if'], ['wx:elif', 's-elif'], ['wx:else', 's-else'], ['wx:for', 's-for'], ['wx:for-item', 's-for-item'], ['wx:key', 's-key'], ['wx:for-index', 's-for-index']]; // 微信映射到百度前缀

exports.wxMapToSwanAttrs = wxMapToSwanAttrs;
var wxMapToSwanPrefix = ['wx.', 'swan.']; // 文件引入后缀修改的标签

exports.wxMapToSwanPrefix = wxMapToSwanPrefix;
var modifySuffixTags = ['import', 'included', 'wxs'];
exports.modifySuffixTags = modifySuffixTags;