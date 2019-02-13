const babel = require('@babel/core');
const fs = require('fs');
const Path = require('path');
const fse = require('fs-extra');
const utils = require('../utils/index');

const log = utils.log;
const modulesDir = 'node_modules';
const isPrivatePack = /^\@[\w\d\-\_\.]+\/[\w\d\-_\.]+$/;

// fix infinite loop
let jsTree = {};

function existInPkg(lib) {
  const pkg = utils.getProjectPkg();
  const libs = Object.assign(pkg.devDependencies, pkg.dependencies);
  return libs[lib];
}
function findMainJs(modules) {
  const pkg = require(Path.resolve(`${modulesDir}/${modules}/package.json`));
  let main = `${modulesDir}/${modules}/${pkg.main || './index.js'}`;
  main = utils.jsRequire(main);
  return main;
}

function analyse(code, from) {
  return code.replace(/require\(['"]([\w\d_\-\.\/\@]+)['"]\)/ig, (match, lib) => {
    if (Path.isAbsolute(lib)) { // if path in src directory => solve  exp: require('/user/work/project/a.js')
      const absoluteSrc = Path.join(__dirname, utils.getSrcPath());
      const absoluteDist = Path.join(__dirname, utils.getDistPath());
      if (lib.indexOf(absoluteSrc) === 0) {
        lib = lib.replace(absoluteSrc, absoluteDist);
      }
    } else if (lib[0] === '.') { // require('./utils/test')
      // solve modules require file
      if (from.indexOf('node_modules') > -1) {
        const file = utils.jsRequire(Path.join(Path.dirname(from), lib));
        compiler(file);
      }
    }
    // TODO startWith .. copy the file ?
    else if (lib.indexOf('/') === -1 || lib.indexOf('/') === lib.length - 1) {
      // require('module')
      if (!fs.existsSync(`${modulesDir}/${lib}`)) {
        log.error(`未能够在${modulesDir}里找到${lib},请确认是否安装`);
      }
      const main = findMainJs(lib);
      if (!fs.existsSync(main)) {
        log.error(`${main}不存在，请确认是否安装`);
      }
      // 'modules' => ./npm/modules/index.js
      lib = Path.relative(Path.dirname(utils.getOutputFile(from)), utils.getOutputFile(main));
      compiler(main);
    } else if (lib.indexOf('/') > -1 && lib.indexOf('/') !== 0) {
      // require('babel-core/index') or require(@linhun/jane)
      let path;
      if (isPrivatePack.test(lib)) {
        path = findMainJs(lib);
      } else {
        path = utils.jsRequire(`${modulesDir}/${lib}`);
      }
      if (!path) {
        log.error(`未能够在${modulesDir}里找到${lib},请确认是否安装`);
        return lib;
      }
      lib = Path.relative(Path.dirname(utils.getOutputFile(from)), utils.getOutputFile(path));
      compiler(path);
    }
    if (/^npm/.test(lib)) {
      lib = `./${lib}`;
    }
    // todo fix //
    return `require('${lib}')`;
  });
}
async function compiler(from, dir) {
  const config = utils.getProjectConfig(dir).js.config;

  if (config.sourceMaps === undefined) {
    config.sourceMaps = 'inline';
  }
  config.comments = false;
  // fix infinite require loop not on watching mode
  if (jsTree[from]) {
    return;
  }
  let result;
  try {
    if (from.indexOf(modulesDir) > -1) {
      result = {
        code: fs.readFileSync(from, 'utf8')
      };
    } else {
      result = babel.transformFileSync(from, config);
    }
    const to = utils.getOutputFile(from);
    jsTree[from] = to;
    result.code = analyse(result.code, from);
    // write in
    // await utils.write(to, result.code)
    // fs.writeFileSync(to,result.code,'utf8')
    fse.outputFileSync(to, result.code);
    let tag = '写入js';
    if (from.indexOf(modulesDir) > -1) {
      tag = '复制依赖';
    }
    log.tag(tag, `${to}`);
  } catch (err) {
    if (err) {
      console.log(err); // log.info cant print all message on babel error
    }
  }
}

function clearTrace() {
  jsTree = {};
}
module.exports = {
  clearTrace,
  compiler
};
