import regeneratorRuntime from 'regenerator-runtime';
import navToLogin from './navToLogin';

let wxInfo;
// 获取微信系统信息
const getWxSystemInfo = () => new Promise((resolve, reject) => {
  if (wxInfo) {
    resolve(wxInfo);
  } else {
    wx.getSystemInfo({
      success(res) {
        wxInfo = res;
        resolve(wxInfo);
      },
      fail() {
        reject();
      }
    });
  }
});

const getStorage = (key, isObj) => {
  try {
    const value = wx.getStorageSync(key);
    if (isObj) {
      return JSON.parse(value || '{}');
    }
    return value || '';
  } catch (e) {
    return isObj ? {} : '';
  }
};

// const saveStorage = (key, value) => {
//   wx.setStorage({
//     key,
//     data: typeof value === 'object' ? JSON.stringify(value) : value
//   });
// };

export const request = config => {
  const { success, fail, url, data = {}, method, header = {} } = config;
  return new Promise(async (resolve, reject) => {
    const beikeHeader = {};
    // id 黄盼 2000000023470067
    // id 免费预约 2000000023470305
    // id 建祥 2000000023470346
    beikeHeader['X-BeiKe-Ucid'] = getStorage('session_id');
    beikeHeader['X-BeiKe-IP'] = '10.120.112.207';
    beikeHeader['X-BeiKe-Source'] = 'bkbdmp';
    config.data = data || {};
    config.header = Object.assign(header || {}, beikeHeader);

    if (method && method.toUpperCase() === 'POST') {
      config.header['Content-Type'] = header['Content-Type'] || 'application/json';
    }

    config.success = res => {
      const { data } = res;
      const { code } = data;
      if (code !== 'undefiend' && Number(code) === 1) {
        const resData = data.data;
        if (resData && resData.code === 101) {
          if (!config.custom) {
            navToLogin();
            console.log('用户未登录');
          }
        } else if (resData && resData.code === 1) {
          resolve(resData);
          // 如果接口自定义了success则执行
          success && success(resData);
        } else {
          reject(resData);
          // 如果接口自定义了fail则执行
          fail && fail(resData);
        }
      } else if (Number(code) === 100002) {
        if (!config.custom) {
          navToLogin();
          console.log('用户未登录');
        }
      } else {
        reject(data);
        fail && fail(data);
      }
    };
    config.fail = res => {
      console.log('fail res', res);
      const resData = res.data;
      reject(resData);
      // 如果接口自定义了fail则执行
      fail && fail(resData);
    };
    wx.request(config);
  });
};

export const req = config => {
  // console.log('config', config);
  if (typeof config === 'string') {
    config = { url: config };
  }
  config = config || {};
  config.method = config.method ? config.method.toUpperCase() : 'GET';

  if (config.method === 'POST') {
    config.header = config.header ? config.header : {};
    config.header['Content-Type'] = config.header['Content-Type'] || 'application/json';
  }
  if (config.custom) {
    return new Promise((resolve, reject) => {
      config.success = res => {
        resolve(res.data);
      };
      config.fail = res => {
        reject(res);
      };
      wx.request(config);
    });
  }
  return request(config);
};

export default {
  request,
  req
};
