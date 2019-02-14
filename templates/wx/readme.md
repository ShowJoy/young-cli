# 贝壳搬家百小程序
该项目是通过gulp任务流来构建的。

## 准备

```bash
npm i gulp-cli -g
npm i
```

## 启动

```bash
npm run dev-build
```

## 使用

+ 用小程序开发工具打开build文件夹
+ 勾上不校验合法域名
+ 新建文件需重新启动构建

## 文件结构约定

```javascript
{
  "components": "存放通用组件",
  "pages": "存放页面",
  "pages/components/" : "存放业务独有模块",
  "utils" : "存放一些通用方法"
}
```

## 内嵌H5页面postmessage格式约定

```javascript
{
  "share": {  // 用于设置分享
    "type": "rushi", // 渠道类型
    "image": "https://xx",  // 不设置则使用截图
    "title": "xxxx", 
    "url": "https://xxx" // 不设置则使用当前url
  },
  // 其他字段
}
```

## 埋点

具体查看：[ulog](http://git.lianjia.com/ptc-csd/ulog)
