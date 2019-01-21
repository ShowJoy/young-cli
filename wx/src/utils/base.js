import format from 'date-fns/format';
import navToLogin from './navToLogin';
import toast from './toast';
import validLocation from './getLocation';
import { req } from './request';
import * as event from './event';

const formatNumber = n => {
  n = n.toString();
  return n[1] ? n : `0${n}`;
};

const formatTime = date => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`;
};

const distanceInMinutes = date => parseInt((format(date, 'x') - format(new Date(), 'x')) / 60000, 10);

const distanceInSecond = date => parseInt((format(date, 'x') - format(new Date(), 'x')) / 1000, 10);

export default {
  distanceInMinutes,
  distanceInSecond,
  formatTime,
  validLocation,
  req,
  toast,
  navToLogin,
  event,

  makePhone(num) {
    return new Promise((resolve, reject) => {
      wx.makePhoneCall({
        phoneNumber: num,
        success: () => {
          resolve();
        },
        fail() {
          reject();
        }
      });
    });
  },

  /**
   * 倒计时
   * @param { number } duration 毫秒
   */
  countDown(duration, cbk, f = 'mm:ss', diff = 1000) {
    let timer = null;
    if (!timer) {
      timer = setInterval(() => {
        if (duration >= 0) {
          cbk(format(duration, f), duration, timer);
          duration -= diff;
        } else {
          clearInterval(timer);
          timer = null;
        }
      }, diff);
    }
  },

  getUserInfo() {
    const app = getApp();
    return new Promise((resolve) => {
      if (app.globalData.userInfo) {
        resolve(app.globalData.userInfo);
      } else {
        wx.getUserInfo({
          success(res) {
            console.log('getUserInfo', res);
            app.globalData.userInfo = res.userInfo;
            resolve(res.userInfo);
          }
        });
      }
    });
  },
  getSystemInfo() {
    return new Promise((resolve) => {
      if (this.read('device')) {
        resolve(this.read('device'));
      } else {
        wx.getSystemInfo({
          success: res => {
            this.save('device', res);
            resolve(res);
          }
        });
      }
    });
  },
  save(key, data) {
    return wx.setStorageSync(key, data);
  },
  read(key) {
    return wx.getStorageSync(key);
  },
  redirectTo(url) {
    wx.redirectTo({ url });
  },
  reLaunch(url) {
    wx.reLaunch({ url });
  },
  navBackLastPage() {
    wx.navigateBack({
      delta: 1
    });
  },
  nav(url, cbk) {
    // todo one nav on onetime
    if (global.nav) {
      return;
    }
    if (!cbk) {
      global.nav = true;
      cbk = () => {};
    }
    wx.navigateTo({
      url,
      success: cbk,
      complete() {
        global.nav = false;
      }
    });
  },
  login() {
    return new Promise((resolve, reject) => {
      wx.login({
        success(res) {
          resolve(res);
        },
        fail(e) {
          reject(e);
        }
      });
    });
  },
  isOnline() {
    return !!this.read('session_id');
  },
  getSetting() {
    return new Promise((resolve, reject) => {
      wx.getSetting({
        success(v) {
          resolve(v);
        },
        fail(v) {
          reject(v);
        }
      });
    });
  },
  checkSession() {
    return new Promise((resolve, reject) => {
      wx.checkSession({
        success: () => {
          // 未过期
          resolve();
        },
        fail: () => {
          // 过期
          this.save('session_id', '');
        }
      });
    });
  },
  pay(params) {
    return new Promise((resolve, reject) => {
      wx.requestPayment({
        ...params,
        success (res) {
          resolve(res);
        },
        fail (res) {
          reject(res);
        }
      });
    });
  },
  showShareMenu(ticket = true) {
    return new Promise((resolve, reject) => {
      wx.showShareMenu({
        withShareTicket: ticket,
        success (res) {
          resolve(res);
        },
        fail (res) {
          reject(res);
        }
      });
    });
  }
};
