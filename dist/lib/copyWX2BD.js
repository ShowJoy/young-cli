"use strict";

var fs = require('fs-extra');

var Path = require('path');

var utils = require('./utils/index');

var log = utils.log;
var projectConfig = null;

function ignoreMatch(target) {
  var result = false;
  projectConfig.ignore.forEach(function (v) {
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
    var filename = Path.basename(target);

    switch (Path.extname(target)) {
      case '.wxss':
        fs.renameSync(target, Path.join(Path.dirname(target), "".concat(Path.basename(target).split('.')[0], ".css")));
        break;

      case '.wxml':
        fs.renameSync(target, Path.join(Path.dirname(target), "".concat(Path.basename(target).split('.')[0], ".swan")));
        break;

      case '.wxs':
        fs.renameSync(target, Path.join(Path.dirname(target), "".concat(Path.basename(target).split('.')[0], ".filter.js")));
        break;

      default:
        break;
    }

    if (filename === 'project.config.json') {
      fs.renameSync(target, Path.join(Path.dirname(target), "".concat(Path.basename(target).split('.')[0], ".swan.json")));
    } else if (filename === 'young.config.js') {
      var content = fs.readFileSync(Path.resolve(target), {
        encoding: 'utf-8'
      });
      console.log('content', content);
      fs.writeFileSync(Path.resolve(target), content.replace(/(htmlFiles: ")[^"]+(")/, '$1src/**/*.swan$2'));
    }
  } else if (fs.lstatSync(target).isDirectory()) {
    var dirs = fs.readdirSync(target);
    dirs.forEach(function (dir) {
      walk(Path.join(target, dir));
    });
  }
}

module.exports = function (src, dest, callback) {
  projectConfig = utils.getProjectConfig(src);

  if (!projectConfig) {
    log.error('未检测到配置文件，无法编译');
    return;
  }

  if (fs.existsSync(dest)) {
    log.error("\u521B\u5EFA".concat(dest, "\u5931\u8D25\uFF0C\u76EE\u5F55\u5DF2\u5B58\u5728"));
    return;
  }

  log.info('复制文件开始...');
  fs.copySync(src, dest);
  log.info('重命名文件...', dest);
  walk(dest);

  if (callback) {
    callback();
  }
};