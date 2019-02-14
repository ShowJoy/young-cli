const path = require('path');
const del = require('del');
const gulp = require('gulp');
const stylus = require('gulp-stylus');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const gutil = require('gulp-util');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');
const replace = require('gulp-replace');
const exec = require('child_process').exec;
const execSync = require('child_process').execSync;
const rename = require('gulp-rename');
const argv = require('minimist')(process.argv.slice(2));
const mergestream = require('merge-stream');
const customConfig = require('./young.config');

// 相关路径配置
const defaultConfig = {
  src: {
    baseDir: 'src',
    imgDir: 'src/images',
    imgFiles: 'src/images/**/*',
    stylusFiles: 'src/**/*.styl',
    baseFiles: ['src/**/*.{png,js,json}', '!src/assets/**/*', '!src/images/**/*'],
    assetsDir: 'src/assets',
    assetsImgFiles: 'src/assets/images/**/*.{png,jpg,jpeg,svg,gif}',
    htmlFiles: 'src/**/*.wxml',
    jsFiles: 'src/**/*.js'
  },
  dest: {
    baseDir: 'build',
    imgDir: 'build/images',
  },
  tmp: {
    baseDir: 'tmp',
    imgDir: 'tmp/assets/images',
    imgFiles: 'tmp/assets/images/**/*.{png,jpg,jpeg,svg,gif}'
  }
};
const youngcmd = 'young';

const config = {};
Object.keys(defaultConfig).forEach(key => {
  if (customConfig[key]) {
    config[key] = Object.assign(defaultConfig[key], customConfig[key]);
  } else {
    config[key] = defaultConfig[key];
  }
});
// const config = Object.assign(defaultConfig, customConfig);

// 当前小程序html扩展名
const htmlExtname = path.extname(config.src.htmlFiles);
// 构建后对应css扩展名
const cssExtname = {
  '.wxml': '.wxss',
  '.swan': '.css'
}[htmlExtname];

// Log for output msg.
const log = (...args) => {
  gutil.log.apply(false, args);
};

// clean 任务, build 目录
const cleanDist = () => del(config.dest.baseDir);

// clean tmp 目录
const cleanTmp = () => del(config.tmp.baseDir);

const stylusCompile = () => gulp.src('src/**/*.styl')
  .pipe(stylus())
  .pipe(rename({
    extname: cssExtname
  }))
  .pipe(gulp.dest(config.dest.baseDir));

// es6->es5
const babelJS = () => gulp.src('src/**/*.js')
  .pipe(babel())
  // .pipe(uglify())
  .pipe(gulp.dest(config.dest.baseDir));

// 复制 HTML
const copyHTML = () => gulp.src(config.src.htmlFiles, {})
  .pipe(gulp.dest(config.dest.baseDir));

// 复制基础文件
const copyBasicFiles = () => gulp.src(config.src.baseFiles, {})
  .pipe(gulp.dest(config.dest.baseDir));

// 压缩图片
const imageMin = () => gulp.src(config.src.imgFiles)
  .pipe(newer(config.dest.imgDir))
  .pipe(imagemin([
    imagemin.jpegtran({ progressive: true }),
    imagemin.optipng({ optimizationLevel: 5 }),
    imagemin.svgo({
      plugins: [{
        removeViewBox: true
      }]
    })], {
    verbose: true
  }))
  .pipe(gulp.dest(config.dest.imgDir));

// 重写SWAN 中 image 标签中的图片路径
const wxmlImgRewrite = () => gulp.src(config.src.htmlFiles)
  .pipe(replace('%ASSETS_IMG%/', ''))
  .pipe(gulp.dest(config.dest.baseDir));

const watchHandler = (type, file) => {
  const extname = path.extname(file);
  // stylus 文件
  if (extname === '.styl') {
    if (type === 'removed') {
      const tmp = file.replace('src/', 'build/').replace(extname, cssExtname);
      del([tmp]);
    } else {
      stylusCompile();
    }
  } else if (['.png', '.jpg', '.jpeg', '.svg', '.gif'].includes(extname)) {
    // 图片文件
    if (type === 'removed') {
      if (file.indexOf('assets') > -1) {
        del([file.replace('src/', 'tmp/')]);
      } else {
        del([file.replace('src/', 'build/')]);
      }
    } else {
      imageMin();
      // assetsImgMin();
      // qcloudCDN();
      // wxmlImgRewrite();
    }
  } else if (htmlExtname === extname) {
    // swan
    if (type === 'removed') {
      const tmp = file.replace('src/', 'build/');
      del([tmp]);
    } else {
      copyHTML();
      // wxmlImgRewrite();
    }
  } else if (extname === '.js') {
    // js
    if (type === 'removed') {
      const tmp = file.replace('src/', 'build/');
      del([tmp]);
    } else {
      execSync(`${youngcmd} compilejs --file=${file}`);
    }
  } else if (type === 'removed') {
    // 其余文件
    const tmp = file.replace('src/', 'build/');
    del([tmp]);
  } else {
    copyBasicFiles();
    // copyHTML();
    // wxmlImgRewrite();
  }
};

// 监听文件
const watch = cb => {
  const watcher = gulp.watch([
    config.src.baseDir,
    config.tmp.imgDir
  ], { ignored: /[\/\\]\./ });

  watcher
    .on('change', file => {
      log(`${gutil.colors.yellow(file)} is changed`);
      watchHandler('changed', file);
    })
    .on('add', file => {
      log(`${gutil.colors.yellow(file)} is added`);
      watchHandler('add', file);
    })
    .on('unlink', file => {
      log(`${gutil.colors.yellow(file)} is deleted`);
      watchHandler('removed', file);
    });
  cb();
};

const buildjs = () => new Promise((resolved, reject) => {
  exec(`${youngcmd} buildjs`, (error, stdout, stderr) => {
    if (error) {
      console.error(`执行出错: ${error}`);
      reject(error);
      return;
    }
    resolved('');
  });
});

// dev
gulp.task('default', gulp.series(
  cleanDist,
  copyBasicFiles,
  gulp.parallel(
    stylusCompile,
    imageMin,
    copyHTML,
    buildjs,
  ),
  // wxmlImgRewrite,
  // assetsImgMin,
  // qcloudCDN,
  watch
));

// build
gulp.task('build', gulp.series(
  cleanDist,
  copyBasicFiles,
  gulp.parallel(
    stylusCompile,
    imageMin,
    copyHTML,
    buildjs,
  ),
  // wxmlImgRewrite,
  // assetsImgMin,
  // qcloudCDN
));
