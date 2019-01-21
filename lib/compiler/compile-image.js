const compiler = require('imagemin');
const jpeg = require('imagemin-jpegtran');
const png = require('imagemin-pngquant');

compiler(['images/*.{jpg,png}'], 'build/images', {
  plugins: [
    jpeg(),
    png({ quality: '65-80' })
  ]
}).then(files => {
  console.log(files);
  //= > [{data: <Buffer 89 50 4e …>, path: 'build/images/foo.jpg'}, …]
});
