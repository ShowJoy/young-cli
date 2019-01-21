function q(v) {
  return '"' + v + '"';
}

function json2html(json) {
  // Empty Elements - HTML 4.01
  const empty = ['area', 'base', 'basefont', 'br', 'col', 'frame', 'hr', 'img', 'input', 'isindex', 'link', 'meta', 'param', 'embed'];

  let child = '';
  if (json.nodes) {
    child = json.nodes.map(function(c) {
      return json2html(c);
    }).join('');
  }

  let attr = '';
  if (json.attr) {
    attr = Object.keys(json.attr).map(function(key) {
      let value = json.attr[key];
      if (Array.isArray(value)) value = value.join(' ');
      return key + '=' + q(value);
    }).join(' ');
    if (attr !== '') attr = ' ' + attr;
  }

  if (json.node === 'element') {
    let tag = json.tag;
    if (empty.indexOf(tag) > -1) {
      // empty element
      return '<' + json.tag + attr + '/>';
    }

    // non empty element
    let open = '<' + json.tag + attr + '>';
    let close = '</' + json.tag + '>';
    return open + child + close;
  }

  if (json.node === 'text') {
    return json.text;
  }

  if (json.node === 'comment') {
    return '<!--' + json.text + '-->';
  }

  if (json.node === 'root') {
    return child;
  }
};

export default json2html;
