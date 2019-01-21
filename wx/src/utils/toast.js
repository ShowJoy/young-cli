export default {
  custom: config => wx.showToast(config),
  info: (title, mask = true) => wx.showToast({ title, mask, icon: 'none' }),
  success: (title, mask = true) => wx.showToast({ title, mask }),
  warn: title => wx.showToast({ title, image: '/images/warn.png' }),
  error: title => wx.showToast({ title, image: '/images/wrong.png' }),
  hide: (config) => wx.hideToast(config),
  hideLoading: (config) => wx.hideLoading(config),
  loading: (title, mask = true) => wx.showLoading({
    title: title || '加载中',
    mask,
  }),
};
