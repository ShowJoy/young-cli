const env = process.env.NODE_ENV || 'production';

const lifeOrigin = {
  off: 'http://life-h5.shoff.ke.com',
  testing: 'http://life-h5.shoff.ke.com',
  // development: 'http://life-h5.shoff.ke.com',
  development: 'https://life-h5.dooioo.net',
  production: 'https://life-h5.ke.com'
}[env];

const moveAPI = `${lifeOrigin}/api/housekeeping/move`;
const baseAPI = `${lifeOrigin}/api/base`;

export default {
  lifeOrigin,
  moveAPI,
  baseAPI
};
