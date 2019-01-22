const fs = require('fs-extra');
const Path = require('path');
const utils = require('./utils/index');
import parse from './parse/index';

const log = utils.log;

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
    if (Path.extname(target) === '.swan') {
      const content = parse.wxml2swan(fs.readFileSync(target, {encoding: 'utf-8'}));
      fs.writeFileSync(target, content);
    } else if (Path.extname(target) === '.js') {
      const content = parse.wx2bdjs(fs.readFileSync(target, {encoding: 'utf-8'}));
      fs.writeFileSync(target, content);
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
