import { req } from '../utils/request';
import Origins from './host';

// 获取预估价信息
export const demo = params => req({ url: `${Origins.moveAPI}/demo`, data: params, method: 'post' });

export default {
  demo
};
