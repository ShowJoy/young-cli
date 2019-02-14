// app.js

import * as ulog from '@lianjia/ulog';
import { request } from './utils/request';
import Utils from './utils/base';
import ulogConfig from './ulogConfig';
import { baiduAK } from './shared/const';
import bmapwx from './utils/bmap-wx';

ulog.initApp({
  onLaunch (options) {
    Utils.checkSession();
    Utils.getSystemInfo().then(res => {
      this.globalData.windowWidth = res.windowWidth;
      this.globalData.windowHeight = res.windowHeight;
    });
    this.scopeSetting();
    ulog.initConfig(ulogConfig);
  },
  scopeSetting() {
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success: () => {
              this.getCityCode();
            },
            fail() {
              wx.showModal({
                title: '提示',
                content: '定位失败，您尚未开启定位权限，点击开启定位权限',
                success: (res) => {
                  if (res.confirm) {
                    wx.openSetting({
                      success: (res) => {
                        if (res.authSetting['scope.userLocation']) {
                          this.getCityCode();
                        } else {
                          Utils.event.emit('hasLocated', true);
                          console.error('用户未同意地理位置权限');
                        }
                      }
                    });
                  }
                }
              });
            }
          });
        } else {
          this.getCityCode();
        }
      }
    });
  },
  getCityCode() {
    const bmap = new bmapwx.BMapWX({
      ak: baiduAK
    });
    wx.getLocation({
      success: res => {
        bmap.regeocoding({
          location: `${res.latitude},${res.longitude}`,
          success: result => {
            ulogConfig.register.cid = `${result.originalData.result.addressComponent.adcode.substr(0, 2)}0000`;
            this.globalData.cityName = result.originalData.result.addressComponent.city;
            ulog.initConfig(ulogConfig);
            Utils.event.emit('hasLocated', { dialog: true });
          },
          fail: e => {
            Utils.event.emit('hasLocated', { dialog: true });
            console.error(e);
          }
        });
      }
    });
  },
  // 项目全局数据
  globalData: {
    channelCode: 'bdxcx',
    isProd: process.env.NODE_ENV === 'production',
    cityName: '',
    windowWidth: 0, // 屏幕宽度
    windowHeight: 0 // 屏幕高度
  },
  requestData: request,
  sendUlog: ulog.sendUlog
}, App);
