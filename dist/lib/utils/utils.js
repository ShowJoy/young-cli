"use strict";

var Path = require('path');

var fs = require('fs-extra');

module.exports = {
  log: require('./log'),
  getVer: function getVer() {
    var pkg = Path.join(__dirname, '../package.json');
    return require(pkg).version;
  },
  getProjectConfig: function getProjectConfig() {
    var config = Path.resolve('./young.config.js');

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
  getDistPath: function getDistPath() {
    return this.getProjectConfig().dest || 'build';
  },
  getSrcPath: function getSrcPath() {
    return this.getProjectConfig().src || 'src';
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
  }
};