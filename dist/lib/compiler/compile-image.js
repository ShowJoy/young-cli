"use strict";

var compiler = require('imagemin');

var jpeg = require('imagemin-jpegtran');

var png = require('imagemin-pngquant');

compiler(['images/*.{jpg,png}'], 'build/images', {
  plugins: [jpeg(), png({
    quality: '65-80'
  })]
}).then(function (files) {
  console.log(files); //= > [{data: <Buffer 89 50 4e …>, path: 'build/images/foo.jpg'}, …]
});