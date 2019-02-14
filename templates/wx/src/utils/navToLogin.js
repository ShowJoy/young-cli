export default path => {
  // default direct
  const currentPage = getCurrentPages()[(getCurrentPages().length - 1)];
  const url = path ? `/pages/login/index?redirect=/${path}` : `/pages/login/index?redirect=/${currentPage.route}`;
  const options = currentPage.options;
  let redirect = '?';
  // 有选项的话加上
  Object.keys(options).forEach((v) => {
    redirect += `${v} = ${options[v]}&`;
  });
  wx.navigateTo({
    url: path ? url : url + encodeURIComponent(redirect)
  });
};
