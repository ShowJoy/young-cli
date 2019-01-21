import parse from './index';
import prettyHTML from 'pretty';
import { removeBraceAttrs } from './const/mp';

function wxml2swan(content) {
  let options = {
    plugins: [function parseNode(node) {
      console.log('==node.attr==', node);
    }],
    visitors: {
      img(node){
        node.styleStr = 'display:block;';
      }
    }
  }
  const obj = parse.htmlParse(content, options);
  const str = parse.json2html(obj);

  return prettyHTML(str, { ocd: true });
}

export default wxml2swan;