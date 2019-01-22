
/**
 * utils函数引入
 **/
import html2json from './html2json';
import json2html from './json2html';
import wxml2swan from './wxml2swan';
import wx2bdjs from './jsParse/wx2bdjs';

/**
 * 主函数入口区
 **/
function htmlParse(data='<div></div>', options={}){
  var transData = {};//存放转化后的数据
  let res = {};  //返回的数据
  transData = html2json(data, 'root', options);
  // console.log('解析结果是', transData);
  res = transData;
  return res;
}

export default {
  htmlParse,
  json2html,
  wxml2swan,
  wx2bdjs
}
