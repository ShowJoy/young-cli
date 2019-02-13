const fs = require('fs-extra');
const Path = require('path');
const utils = require('./utils/index');

const log = utils.log;
let projectConfig = null;

function ignoreMatch(target) {
  let result = false;
  projectConfig.ignore.forEach(v => {
    if (v === Path.parse(target).base) {
      result = true;
    }
  });
  return result;
}

function walk(target) {
  // ignore check
  if (ignoreMatch(target)) {
    return;
  }
  if (fs.lstatSync(target).isFile()) {
    switch(Path.extname(target)){
      case '.wxss':
        fs.renameSync(target, Path.join(Path.dirname(target), `${Path.basename(target).split('.')[0]}.css`));
        break;
      case '.wxml':
        fs.renameSync(target, Path.join(Path.dirname(target), `${Path.basename(target).split('.')[0]}.swan`));
        break;
      case '.wxs':
        fs.renameSync(target, Path.join(Path.dirname(target), `${Path.basename(target).split('.')[0]}.filter.js`));
        break;
      default:
        break;
    }
  } else if (fs.lstatSync(target).isDirectory()) {
    const dirs = fs.readdirSync(target);
    dirs.forEach(dir => {
      walk(Path.join(target, dir));
    });
  }
}

module.exports = function(src, dest, callback) {
  projectConfig = utils.getProjectConfig(src);
  if (!projectConfig) {
    log.error('未检测到配置文件，无法编译');
    return;
  }
  if (fs.existsSync(dest)) {
    log.error(`创建${dest}失败，目录已存在`);
    return;
  }
  log.info('复制文件开始...');
  fs.copySync(src, dest);
  log.info('重命名文件...', dest);
  walk(dest);
  if (callback) { callback(); }
};
