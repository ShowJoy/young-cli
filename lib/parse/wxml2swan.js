import parse from './index';
import prettyHTML from 'pretty';
import {
  removeBraceAttrs,
  wxMapToSwanAttrs,
  modifySuffixTags
} from './const/mp';

function wxml2swan(content) {
  let options = {
    plugins: [function parseNode(node) {
      /**
       *  处理属性
       */
      Object.keys(node.attr || {}).forEach(key => {

        const attr = wxMapToSwanAttrs.find(attr => attr[0] === key);
        // 是否需要改变属性名
        if (attr) {
          node.attr[attr[1]] = node.attr[key];
          // 是否需要去掉花括号的属性
          if (removeBraceAttrs.includes(key)) {
            node.attr[attr[1]] = node.attr[key].replace(/{{([^{}]+)}}/g, '$1');
          }
          // 删掉旧属性名
          delete node.attr[attr[0]]
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
      if (modifySuffixTags.includes(node.tag)) {
        if (node.attr && node.attr.src) {
          node.attr.src = node.attr.src.replace(/(.*).wxml$/, '$1.swan');
        }
        // 特殊wxs to filter
        if (node.tag === 'wxs') {
          // 会出现invalid state: mismatch end tag，因为先改了配对的标签，遍历到关闭标签时匹配 不对，不影响
          node.tag = 'filter';
        }
      }
    }],
    visitors: {
      img(node){
        node.styleStr = 'display:block;';
      }
    }
  }
  const obj = parse.htmlParse(content, options);
  const str = parse.json2html(obj);

  return prettyHTML(str, { ocd: true, wrapAttributes: true });
}

export default wxml2swan;