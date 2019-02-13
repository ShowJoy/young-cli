## 小程序脚手架
1.微信小程序模板
2.提供es6->es5, stylus->css功能
3.微信转百度

## 准备
```
npm install young-cli gulp-cli -g --registry=http://registry.npmjs.lianjia.com:7001/
young new projectname
cd projectname
// 测试
npm run dev-build
// 生产
npm run prod-build
```

## 微信转百度
```
young wx2bd <微信小程序目录地址> <百度小程序目录地址> //  微信小程序目录地址可不填，默认为当前目录所在地址
```