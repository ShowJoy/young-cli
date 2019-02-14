export default {
  // 分析数据接收地址
  server_url: process.env.NODE_ENV === 'development' ? 'http://test.dig.lianjia.com/bigc.gif' : 'https://dig.lianjia.com/bigc.gif',
  // 传入的字符串最大长度限制
  max_string_length: 300,
  // 发送事件的时间使用客户端时间还是服务端时间
  use_client_time: false,
  // 是否自动采集如下事件
  autoTrack: {
    // $MPLaunch
    appLaunch: false, // 得问pm要定义好的appLaunch的event和evt
    // $MPShow
    appShow: false,
    // $MPHide
    appHide: false,
    // $MPViewScreen
    pageShow: {
      evt: '1,3'
    }
  },
  // 设置公共属性 全部埋点会传 但不会写入storage
  register: {
    cid: '110000',
    fr: 'bkbdmp',
    pid: 'bigc_apph5_life'
  }
};
