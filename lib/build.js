const fs = require('fs-extra');
const Path = require('path');
const jsCompile = require('./compiler/compile-js');
const utils = require('./utils/index');

const log = utils.log;
const projectConfig = utils.getProjectConfig();

function ignoreMatch(target) {
  let result = false;
  utils.getProjectConfig().ignore.forEach(v => {
    if (v === Path.parse(target).base) {
      result = true;
    }
  });
  return result;
}

async function walk(target) {
  // ignore check
  if (ignoreMatch(target)) {
    return;
  }
  if (fs.lstatSync(target).isFile()) {
    if (Path.extname(target) === (projectConfig.js.ext || '.js')) {
      jsCompile.compiler(target);
    }
    return;
  }
  if (fs.lstatSync(target).isDirectory()) {
    const dirs = fs.readdirSync(target);
    dirs.forEach(async dir => {
      await walk(Path.join(target, dir));
    });
    // for (const value of dirs) {
    //   console.log(value, target);
    //   await walk(Path.join(target, value));
    // }
  }
}

module.exports = async function(callback) {
  if (!utils.getProjectConfig()) {
    log.error('未检测到配置文件，无法编译');
    return;
  }
  await walk(utils.getSrcPath());
  if (callback) { callback(); }
};
