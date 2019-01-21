const fs = require('fs');
const fse = require('fs-extra');
const utils = require('../../utils/index');

const config = utils.getProjectConfig().css.config;
const log = utils.log;
const projectConfig = utils.getProjectConfig();

module.exports = async (path) => {
  const output = utils.getOutputFile(path.replace(projectConfig.css.ext, '.wxss'));
  const option = Object.assign({ file: path }, config);
  try {
    const result = await projectConfig.css.compiler(option);
    fse.outputFileSync(output, result.css, );
    log.tag('写入css', `${utils.getOutputFile(output)}`);
  } catch (err) {
    console.log(err);
  }
};
