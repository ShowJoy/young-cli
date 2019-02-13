"use strict";

var Path = require('path');

var fs = require('fs-extra');

var log = require('./log');

module.exports = {
  log: log,
  getVer: function getVer() {
    var pkg = Path.join(__dirname, '../package.json');
    return require(pkg).version;
  },
  getProjectConfig: function getProjectConfig(dir) {
    var config = Path.resolve(dir || '.', './young.config.js');

    if (!fs.existsSync(config)) {
      return false;
    }

    return require(config);
  },
  getProjectPkg: function getProjectPkg() {
    var config = Path.resolve('./package.json');

    if (!fs.existsSync(config)) {
      return false;
    }

    return require(config);
  },
  getDistPath: function getDistPath(dir) {
    return this.getProjectConfig(dir).dest.baseDir || 'build';
  },
  getSrcPath: function getSrcPath(dir) {
    return this.getProjectConfig(dir).src.baseDir || 'src';
  },
  getModulesPath: function getModulesPath() {
    return 'node_modules';
  },
  write: function write() {
    // rewrite
    return fs.outputFile.apply(this, arguments);
  },
  getOutputFile: function getOutputFile(str) {
    var dest = this.getDistPath();
    var src = this.getSrcPath();
    var modules = this.getModulesPath();

    if (str.indexOf(modules) > -1) {
      str = "".concat(dest, "/").concat(str);
    }

    str = str.replace(modules, 'npm');
    return str.replace(src, dest);
  },
  isDir: function isDir(path) {
    var r = false;

    try {
      r = fs.lstatSync(path) && fs.lstatSync(path).isDirectory();
    } catch (err) {}

    return r;
  },
  isFile: function isFile(path) {
    var r = false;

    try {
      r = fs.lstatSync(path) && fs.lstatSync(path).isFile();
    } catch (err) {}

    return r;
  },
  jsRequire: function jsRequire(path) {
    if (this.isFile(path)) {
      return path;
    }

    if (this.isFile("".concat(path, ".js"))) {
      return "".concat(path, ".js");
    }

    if (this.isFile("".concat(path, "/index.js"))) {
      return "".concat(path, "/index.js");
    }

    return false;
  },
  urlToHttpUrl: function urlToHttpUrl(url, rep) {
    var patt1 = new RegExp("^//");
    var result = patt1.test(url);

    if (result) {
      url = rep + ":" + url;
    }

    return url;
  },
  removeDOCTYPE: function removeDOCTYPE(html) {
    return html.replace(/<\?xml.*\?>\n/, '').replace(/<.*!doctype.*\>\n/, '').replace(/<.*!DOCTYPE.*\>\n/, '');
  },
  trimHtml: function trimHtml(html) {
    return html.replace(/\r?\n+/g, '').replace(/<!--.*?-->/ig, '').replace(/\/\*.*?\*\//ig, '').replace(/[ ]+</ig, '<');
  }
};