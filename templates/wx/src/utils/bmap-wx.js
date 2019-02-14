/**
 * @file 微信小程序JSAPI
 */

/**
 * 百度地图微信小程序API类
 *
 * @class
 */
class BMapWX {
  /**
     * 百度地图微信小程序API类
     *
     * @constructor
     */
  constructor(param) {
    this.ak = param.ak;
  }

  /**
     * 使用微信接口进行定位
     *
     * @param {string} type 坐标类型
     * @param {Function} success 成功执行
     * @param {Function} fail 失败执行
     * @param {Function} complete 完成后执行
     */
  getWXLocation(type, success, fail, complete) {
    const that = this;
    type = type || 'gcj02';
    success = success || function () {};
    fail = fail || function () {};
    complete = complete || function () {};
    wx.getLocation({
      type,
      success,
      fail,
      complete
    });
  }

  /**
     * POI周边检索
     *
     * @param {Object} param 检索配置
     * 参数对象结构可以参考
     * http://lbsyun.baidu.com/index.php?title=webapi/guide/webservice-placeapi
     */
  search(param) {
    const that = this;
    param = param || {};
    const searchparam = {
      query: param.query || '房地产$生活服务&酒店',
      scope: param.scope || 1,
      filter: param.filter || '',
      coord_type: param.coord_type || 2,
      page_size: param.page_size || 10,
      page_num: param.page_num || 0,
      output: param.output || 'json',
      ak: that.ak,
      sn: param.sn || '',
      timestamp: param.timestamp || '',
      radius: param.radius || 2000,
      ret_coordtype: 'gcj02ll'
    };
    const otherparam = {
      iconPath: param.iconPath,
      iconTapPath: param.iconTapPath,
      width: param.width,
      height: param.height,
      alpha: param.alpha || 1,
      success: param.success || function () {},
      fail: param.fail || function () {}
    };
    const type = 'gcj02';
    const locationsuccess = function (result) {
      searchparam.location = `${result.latitude},${result.longitude}`;
      wx.request({
        url: 'https://api.map.baidu.com/place/v2/search',
        data: searchparam,
        header: {
          'content-type': 'application/json'
        },
        method: 'GET',
        success(data) {
          const res = data.data;
          if (res.status === 0) {
            const poiArr = res.results;
            // outputRes 包含两个对象，
            // originalData为百度接口返回的原始数据
            // wxMarkerData为小程序规范的marker格式
            const outputRes = {};
            outputRes.originalData = res;
            outputRes.wxMarkerData = [];
            for (let i = 0; i < poiArr.length; i++) {
              outputRes.wxMarkerData[i] = {
                id: i,
                latitude: poiArr[i].location.lat,
                longitude: poiArr[i].location.lng,
                title: poiArr[i].name,
                iconPath: otherparam.iconPath,
                iconTapPath: otherparam.iconTapPath,
                address: poiArr[i].address,
                telephone: poiArr[i].telephone,
                alpha: otherparam.alpha,
                width: otherparam.width,
                height: otherparam.height
              };
            }
            otherparam.success(outputRes);
          } else {
            otherparam.fail({
              errMsg: res.message,
              statusCode: res.status
            });
          }
        },
        fail(data) {
          otherparam.fail(data);
        }
      });
    };
    const locationfail = function (result) {
      otherparam.fail(result);
    };
    const locationcomplete = function (result) {
    };
    if (!param.location) {
      that.getWXLocation(type, locationsuccess, locationfail, locationcomplete);
    } else {
      const longitude = param.location.split(',')[1];
      const latitude = param.location.split(',')[0];
      const errMsg = 'input location';
      const res = {
        errMsg,
        latitude,
        longitude
      };
      locationsuccess(res);
    }
  }

  /**
     * 地点详情检索服务
     *
     * @param {Object} param 检索配置
     * 参数对象结构可以参考
     * http://lbsyun.baidu.com/index.php?title=webapi/guide/webservice-placeapi
     */
  detail(param) {
    const that = this;
    param = param || {};
    const searchparam = {
      uid: param.uid,
      scope: param.scope || 1,
      output: param.output || 'json',
      ak: that.ak,
      sn: param.sn || '',
      timestamp: param.timestamp || ''
    };
    const otherparam = {
      iconPath: param.iconPath,
      iconTapPath: param.iconTapPath,
      width: param.width,
      height: param.height,
      alpha: param.alpha || 1,
      success: param.success || function () {},
      fail: param.fail || function () {}
    };
    const locationsuccess = function (result) {
      wx.request({
        url: 'https://api.map.baidu.com/place/v2/detail',
        data: searchparam,
        header: {
          'content-type': 'application/json'
        },
        method: 'GET',
        success(data) {
          const res = data.data;
          if (res.status === 0) {
            otherparam.success(res.result);
          } else {
            otherparam.fail({
              errMsg: res.message,
              statusCode: res.status
            });
          }
        },
        fail(data) {
          otherparam.fail(data);
        }
      });
    };
    const errMsg = 'input location';
    const res = {
      errMsg,
    };
    locationsuccess(res);
  }

  /**
     * sug模糊检索
     *
     * @param {Object} param 检索配置
     * 参数对象结构可以参考
     * http://lbsyun.baidu.com/index.php?title=webapi/place-suggestion-api
     */
  suggestion(param) {
    const that = this;
    param = param || {};
    const suggestionparam = {
      query: param.query || '',
      region: param.region || '全国',
      city_limit: param.city_limit || false,
      output: param.output || 'json',
      ak: that.ak,
      sn: param.sn || '',
      timestamp: param.timestamp || '',
      coord_type: param.coordtype || 'gcj02ll',
      ret_coordtype: 'gcj02ll'
    };
    const otherparam = {
      success: param.success || function () {},
      fail: param.fail || function () {}
    };
    wx.request({
      url: 'https://api.map.baidu.com/place/v2/suggestion',
      data: suggestionparam,
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success(data) {
        const res = data.data;
        if (res.status === 0) {
          otherparam.success(res);
        } else {
          otherparam.fail({
            errMsg: res.message,
            statusCode: res.status
          });
        }
      },
      fail(data) {
        otherparam.fail(data);
      }
    });
  }

  /**
     * rgc检索（坐标->地点描述）
     *
     * @param {Object} param 检索配置
     * 参数对象结构可以参考
     * http://lbsyun.baidu.com/index.php?title=webapi/guide/webservice-geocoding
     */
  regeocoding(param) {
    const that = this;
    param = param || {};
    const regeocodingparam = {
      coordtype: param.coordtype || 'gcj02ll',
      pois: param.pois || 0,
      output: param.output || 'json',
      ak: that.ak,
      sn: param.sn || '',
      timestamp: param.timestamp || '',
      ret_coordtype: 'gcj02ll'
    };
    const otherparam = {
      iconPath: param.iconPath,
      iconTapPath: param.iconTapPath,
      width: param.width,
      height: param.height,
      alpha: param.alpha || 1,
      success: param.success || function () {},
      fail: param.fail || function () {}
    };
    const type = 'gcj02';
    const locationsuccess = function (result) {
      regeocodingparam.location = `${result.latitude},${result.longitude}`;
      wx.request({
        url: 'https://api.map.baidu.com/geocoder/v2/',
        data: regeocodingparam,
        header: {
          'content-type': 'application/json'
        },
        method: 'GET',
        success(data) {
          const res = data.data;
          if (res.status === 0) {
            const poiObj = res.result;
            // outputRes 包含两个对象，
            // originalData为百度接口返回的原始数据
            // wxMarkerData为小程序规范的marker格式
            const outputRes = {};
            outputRes.originalData = res;
            outputRes.wxMarkerData = [];
            outputRes.wxMarkerData[0] = {
              id: 0,
              latitude: result.latitude,
              longitude: result.longitude,
              address: poiObj.formatted_address,
              iconPath: otherparam.iconPath,
              iconTapPath: otherparam.iconTapPath,
              desc: poiObj.sematic_description,
              business: poiObj.business,
              alpha: otherparam.alpha,
              width: otherparam.width,
              height: otherparam.height
            };
            otherparam.success(outputRes);
          } else {
            otherparam.fail({
              errMsg: res.message,
              statusCode: res.status
            });
          }
        },
        fail(data) {
          otherparam.fail(data);
        }
      });
    };
    const locationfail = function (result) {
      otherparam.fail(result);
    };
    const locationcomplete = function (result) {
    };
    if (!param.location) {
      that.getWXLocation(type, locationsuccess, locationfail, locationcomplete);
    } else {
      const longitude = param.location.split(',')[1];
      const latitude = param.location.split(',')[0];
      const errMsg = 'input location';
      const res = {
        errMsg,
        latitude,
        longitude
      };
      locationsuccess(res);
    }
  }

  /**
     * 天气检索
     *
     * @param {Object} param 检索配置
     */
  weather(param) {
    const that = this;
    param = param || {};
    const weatherparam = {
      coord_type: param.coord_type || 'gcj02',
      output: param.output || 'json',
      ak: that.ak,
      sn: param.sn || '',
      timestamp: param.timestamp || ''
    };
    const otherparam = {
      success: param.success || function () {},
      fail: param.fail || function () {}
    };
    const type = 'gcj02';
    const locationsuccess = function (result) {
      weatherparam.location = `${result.longitude},${result.latitude}`;
      wx.request({
        url: 'https://api.map.baidu.com/telematics/v3/weather',
        data: weatherparam,
        header: {
          'content-type': 'application/json'
        },
        method: 'GET',
        success(data) {
          const res = data.data;
          if (res.error === 0 && res.status === 'success') {
            const weatherArr = res.results;
            // outputRes 包含两个对象，
            // originalData为百度接口返回的原始数据
            // wxMarkerData为小程序规范的marker格式
            const outputRes = {};
            outputRes.originalData = res;
            outputRes.currentWeather = [];
            outputRes.currentWeather[0] = {
              currentCity: weatherArr[0].currentCity,
              pm25: weatherArr[0].pm25,
              date: weatherArr[0].weather_data[0].date,
              temperature: weatherArr[0].weather_data[0].temperature,
              weatherDesc: weatherArr[0].weather_data[0].weather,
              wind: weatherArr[0].weather_data[0].wind
            };
            otherparam.success(outputRes);
          } else {
            otherparam.fail({
              errMsg: res.message,
              statusCode: res.status
            });
          }
        },
        fail(data) {
          otherparam.fail(data);
        }
      });
    };
    const locationfail = function (result) {
      otherparam.fail(result);
    };
    const locationcomplete = function (result) {
    };
    if (!param.location) {
      that.getWXLocation(type, locationsuccess, locationfail, locationcomplete);
    } else {
      const longitude = param.location.split(',')[0];
      const latitude = param.location.split(',')[1];
      const errMsg = 'input location';
      const res = {
        errMsg,
        latitude,
        longitude
      };
      locationsuccess(res);
    }
  }
}

module.exports.BMapWX = BMapWX;
