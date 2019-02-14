import { req } from '../utils/request';
import Origins from './host';

// 微信登录
export const mpLogin = params => req({ url: `${Origins.moveAPI}/weChatLogin`, data: params, method: 'post' });

export const mpSendSMSCode = params => req({ url: `${Origins.moveAPI}/sendMsg`, data: params });

export const mpFastLogin = params => req({ url: `${Origins.moveAPI}/fastLogin`, data: params, method: 'post' });
