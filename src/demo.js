import parse from '../lib/parse/index';

const html = `
<template name="person-card">
    <view>
        <text>位置: {{pos}}</text>
        <text>姓名: {{name}}</text>
    </view>
</template>
<template is="person-card" data="{{...person}}" />
<!--wxml-->
<wxs module="m1">var msg = "hello world";module.exports.message = msg;</wxs>

<view> {{m1.message}} </view>
<import src="../a.wxml"></import>
<view wx:if="{{display}}">
  <view wx:for="{{array}}" wx:for-index="idx" wx:for-item="itemName">
    {{idx}}: {{itemName.message}}
  </view>
<view></view>
</view>`;

// const swan = parse.wxml2swan(html);

// console.log(swan);


const jsStr = `
import MD5 from './md5';
import navToLogin from './navToLogin';

var obj = {
	wx: 12,
  	ad: wx.get()
}
var a= 'abc';
wx[a]('ad')
wx.get();

function a() {
  return wx.gaa()
}
`;

console.log(parse.wx2bdjs(jsStr));

