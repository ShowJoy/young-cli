// index.js
import * as ulog from '@lianjia/ulog';
import format from 'date-fns/format';
import { baiduAK } from '../../shared/const';
import { transform, BD09, GCJ02 } from '../../utils/bmap-wx';
import * as API from '../../apis/move';
import Utils from '../../utils/base';

// 获取应用实例
const app = getApp();
ulog.initPage({
  data: {
  },

  onLoad() {
  }
}, Page);
