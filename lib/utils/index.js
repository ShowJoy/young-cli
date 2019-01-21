
const Path = require('path');
const fs = require('fs-extra');

module.exports = {
  log: require('./log'),
  getVer() {
    const pkg = Path.join(__dirname, '../package.json');
    return require(pkg).version;
  },
  getProjectConfig() {
    const config = Path.resolve('./young.config.js');
    if (!fs.existsSync(config)) {
      return false;
    }
    return require(config);
  },
  getProjectPkg() {
    const config = Path.resolve('./package.json');
    if (!fs.existsSync(config)) {
      return false;
    }
    return require(config);
  },
  getDistPath() {
    return this.getProjectConfig().dest.baseDir || 'build';
  },
  getSrcPath() {
    return this.getProjectConfig().src.baseDir || 'src';
  },
  getModulesPath() {
    return 'node_modules';
  },
  write() {
    // rewrite
    return fs.outputFile.apply(this, arguments);
  },
  getOutputFile(str) {
    const dest = this.getDistPath();
    const src = this.getSrcPath();
    const modules = this.getModulesPath();
    if (str.indexOf(modules) > -1) {
      str = `${dest}/${str}`;
    }
    str = str.replace(modules, 'npm');
    return str.replace(src, dest);
  },
  isDir(path) {
    let r = false;
    try {
      r = fs.lstatSync(path) && fs.lstatSync(path).isDirectory();
    } catch (err) {

    }
    return r;
  },
  isFile(path) {
    let r = false;
    try {
      r = fs.lstatSync(path) && fs.lstatSync(path).isFile();
    } catch (err) {

    }
    return r;
  },
  jsRequire(path) {
    if (this.isFile(path)) {
      return path;
    }
    if (this.isFile(`${path}.js`)) {
      return `${path}.js`;
    }
    if (this.isFile(`${path}/index.js`)) {
      return `${path}/index.js`;
    }
    return false;
  },
  urlToHttpUrl(url,rep){
    var patt1 = new RegExp("^//");
    var result = patt1.test(url);
    if(result){
        url = rep+":"+url;
    }
    return  url;
  },
  removeDOCTYPE(html) {
    return html
      .replace(/<\?xml.*\?>\n/, '')
      .replace(/<.*!doctype.*\>\n/, '')
      .replace(/<.*!DOCTYPE.*\>\n/, '');
  },
  trimHtml(html) {
    return html
      .replace(/\r?\n+/g, '')
      .replace(/<!--.*?-->/ig, '')
      .replace(/\/\*.*?\*\//ig, '')
      .replace(/[ ]+</ig, '<')
  }
};
