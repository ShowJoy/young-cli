import { req } from './request';

function getCityList() {
  return req({
    url: '/config/city/list/'
  });
}
function getLocation() {
  function wxLocation() {
    return new Promise((resolve, reject) => {
      wx.getLocation({
        type: 'wgs84',
        success (res) {
          resolve(res);
        },
        fail() {
          const error = { error: true, msg: '用户拒绝地理位置授权' };
          reject(error);
        }
      });
    });
  }
  return new Promise((solve, rej) => {
    Promise.all([wxLocation()]).then(res => {
      res = res[0];
      const url = '/map/location';
      req({ url, data: { latitude: res.latitude, longitude: res.longitude } }).then((v) => {
        solve(v.data);
      }).catch(() => {
        const error = { error: true, msg: `${url}请求出错` };
        rej(error);
      });
    }).catch(err => {
      rej(err);
    });
  });
}
const relocate = () => new Promise((resolve) => {
  function fail() {
    return { city: { name: '无法获取当前位置', id: '110000' }, error: true };
  }
  Promise.all([getCityList(), getLocation()]).then(v => {
    try {
      //
      const citys = v[0].data;
      const address = v[1];
      let tpl;


      const adcode = address.addressComponent.adcode;


      const cityName = address.addressComponent.city;
      // 取所在市的code
      const cityGBCode = `${adcode - (adcode % 100)}`;
      Object.keys(citys.city_list).forEach((key, val) => {
        // 常规定位 || 自治县等 || 降级查找所在市
        val = citys.city_list[key];
        if (`${val.name}市` === cityName || val.id === adcode || val.id === cityGBCode) {
          tpl = val;
        }
      });
      tpl = tpl ? { city: tpl } : { city: { name: `定位为:${cityName},贝壳找房暂不支持~`, id: '110000' }, error: true };
      resolve(tpl);
    } catch (err) {
      console.log(err);
      resolve(fail());
    }
  }).catch((err) => {
    console.log(err);
    resolve(fail());
  });
});
module.exports = relocate;
