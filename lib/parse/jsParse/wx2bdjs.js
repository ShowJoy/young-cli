
import {transformSync, traverse} from '@babel/core';
import generator from '@babel/generator';
import * as types from '@babel/types';

function wx2bdjs(src) {
  const { ast } =  transformSync(src, {ast: true});
  // console.log('haha', types.binaryExpression("*", types.identifier("a"), types.identifier("b")));
  traverse(ast, {
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
    Identifier (path) {
      // console.log('identifier=', path.get('name').node, path.scope.hasBinding('wx'), path.isReferencedIdentifier());
      if (path.get('name').node === 'wx' && !path.scope.hasBinding('wx') && path.isReferencedIdentifier()) {
        path.replaceWith(types.Identifier('swan'));
      }
    }
  });
  
  return generator(ast).code;
}

export default wx2bdjs;