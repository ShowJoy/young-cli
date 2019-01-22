// 渠道双括号的属性数组
const removeBraceAttrs = ['wx:if', 'wx:elif', 'wx:for', 'wx:key'];

// 微信映射到百度属性名
const wxMapToSwanAttrs = [
	['wx:if', 's-if'],
	['wx:elif', 's-elif'],
	['wx:else', 's-else'],
	['wx:for', 's-for'],
	['wx:for-item', 's-for-item'],
	['wx:key', 's-key'],
	['wx:for-index', 's-for-index']
];

// 微信映射到百度前缀
const wxMapToSwanPrefix = ['wx.', 'swan.'];

// 文件引入后缀修改的标签
const modifySuffixTags = ['import', 'included', 'wxs'];

export {
	removeBraceAttrs,
	wxMapToSwanAttrs,
	wxMapToSwanPrefix,
	modifySuffixTags
}