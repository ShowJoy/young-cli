module.exports = {
  tpl: {
    page: '', // must be directory
  },
  js: {
    ext: '.js',
    compiler: 'babel',
    config: {
      // sourceMaps: false,
      presets: ['@babel/preset-env'],
      plugins: [
        'transform-node-env-inline',
        '@babel/proposal-object-rest-spread'],
    },
  },
  ignore: ['node_modules', 'dist', '.DB_store', '.DS_Store'],
  cdnPath: '',
  src: {
    htmlFiles: "src/**/*.wxml"
  },
  dest: {}
};
