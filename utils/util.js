const api = require("@/config/api.js")

const common = require("@/config/common.js")

const store = require('@/store')

const serverHelper = (method, url, data, showLoad, response, error, loadTitle) => {
	let page = fetchCurrentPage()
	if (!loadTitle) {
		loadTitle = page && page.$t ? page.$t('common.loading') : ''
	}
	if (showLoad) {
		uni.showLoading({
			title: loadTitle,
			mask: true
		})
	}
	
	data['time'] = (currentTimeStamp(new Date()) / 1000).toString()
	
	// #ifdef APP-PLUS
	if (uni.getSystemInfoSync().system.search('iOS') != -1) {
		data.platform = '1'
	} else {
		data.platform = '2'
	}
	// #endif
	// #ifdef MP-WEIXIN
	data.platform = '3'
	// #endif
	// #ifdef H5
	data.platform = '4'
	// #endif

	data['imei'] = uni.getStorageSync(api.unionUser).toString()
	data['version'] = uni.getStorageSync(api.version).toString()
	data['token'] = sha1(hexMD5(sortObjectByKey(data)) + hexMD5(api.keyStr))
	// console.log('data====>', JSON.stringify(data))

	var authorization = uni.getStorageSync(api.authorization)
	// console.log('authorization======>',authorization)
	let lang = uni.getLocale() 
	if (lang === 'zh-Hans') {
		lang = 'zh-cn'
	}
	if (lang === 'en') {
		lang = 'en-us'
	}
	var headerObj = {
		'Accept-Language': lang
	}

	if (authorization) {
		headerObj.authorization = authorization
	}

	const task = uni.request({
		url: common.serverUrl + url,
		method: method,
		data: data,
		timeout: 15000,
		sslVerify: false,
		header: headerObj,
		success: res => {
			// console.log(res)
			if (res.statusCode == 500) {
				return error({
					status: 500,
					data: {},
					info: page && page.$t ? page.$t('common.system.error') : 'Service System Error'
				});
			}

			if (res.data.status === 200) {
				if (showLoad) {
					uni.hideLoading()
				}

				return response(res.data)
			} else if (res.data.status > 1000) {
				uni.hideLoading()
				//清除本地的缓存信息
				uni.removeStorageSync(api.authorization)
				uni.removeStorageSync(api.userInfo)
				store.default.commit('loginStatus', false)
				showNoIconToast(res.data.info)
				setTimeout(() => {
					miniAppRoute('/pages/home/index', 2)
				}, 1500)
				return error(res.data)
			} else {
				if (showLoad) {
					uni.hideLoading()
				}

				return error(res.data)
			}
		},
		fail: err => {
			// console.log('err===>',err)
			if (showLoad) {
				uni.hideLoading()
			}
			//请求超时处理
			if (err.errMsg && err.errMsg === 'request:fail timeout') {
				// showNoIconToast('请求超时')
				task.abort()
				return error({
					info: page && page.$t ? page.$t('common.timeout') : 'Request Timeout'
				});
			}

			return error(err)
		},
		complete: info => { // if (showLoad) {
			//   uni.hideLoading()
			// }
		}
	})
};
/**
 * SHA1加密
 */
function encodeUTF8(s) {
	var i,
		r = [],
		c,
		x;

	for (i = 0; i < s.length; i++)
		if ((c = s.charCodeAt(i)) < 0x80) r.push(c);
		else if (c < 0x800) r.push(0xC0 + (c >> 6 & 0x1F), 0x80 + (c & 0x3F));
	else {
		if ((x = c ^ 0xD800) >> 10 == 0) //对四字节UTF-16转换为Unicode
			c = (x << 10) + (s.charCodeAt(++i) ^ 0xDC00) + 0x10000, r.push(0xF0 + (c >> 18 & 0x7), 0x80 + (c >> 12 &
				0x3F));
		else r.push(0xE0 + (c >> 12 & 0xF));
		r.push(0x80 + (c >> 6 & 0x3F), 0x80 + (c & 0x3F));
	}

	;
	return r;
}

;

function sha1(s) {
	var data = new Uint8Array(encodeUTF8(s));
	var i, j, t;
	var l = (data.length + 8 >>> 6 << 4) + 16,
		s = new Uint8Array(l << 2);
	s.set(new Uint8Array(data.buffer)), s = new Uint32Array(s.buffer);

	for (t = new DataView(s.buffer), i = 0; i < l; i++) s[i] = t.getUint32(i << 2);

	s[data.length >> 2] |= 0x80 << 24 - (data.length & 3) * 8;
	s[l - 1] = data.length << 3;

	var w = [],
		f = [function() {
			return m[1] & m[2] | ~m[1] & m[3];
		}, function() {
			return m[1] ^ m[2] ^ m[3];
		}, function() {
			return m[1] & m[2] | m[1] & m[3] | m[2] & m[3];
		}, function() {
			return m[1] ^ m[2] ^ m[3];
		}],
		rol = function(n, c) {
			return n << c | n >>> 32 - c;
		},
		k = [1518500249, 1859775393, -1894007588, -899497514],
		m = [1732584193, -271733879, null, null, -1009589776];

	m[2] = ~m[0], m[3] = ~m[1];

	for (i = 0; i < s.length; i += 16) {
		var o = m.slice(0);

		for (j = 0; j < 80; j++) w[j] = j < 16 ? s[i + j] : rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1), t =
			rol(m[0],
				5) + f[j / 20 | 0]() + m[4] + w[j] + k[j / 20 | 0] | 0, m[1] = rol(m[1], 30), m.pop(), m.unshift(t);

		for (j = 0; j < 5; j++) m[j] = m[j] + o[j] | 0;
	}

	;
	t = new DataView(new Uint32Array(m).buffer);

	for (var i = 0; i < 5; i++) m[i] = t.getUint32(i << 2);

	var hex = Array.prototype.map.call(new Uint8Array(new Uint32Array(m).buffer), function(e) {
		return (e < 16 ? "0" : "") + e.toString(16);
	}).join("");
	return hex;
}

;
/**
 * MD5加密
 */

function safe_add(x, y) {
	var lsw = (x & 0xFFFF) + (y & 0xFFFF);
	var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
	return msw << 16 | lsw & 0xFFFF;
}
/* 
 * Bitwise rotate a 32-bit number to the left. 
 */


function rol(num, cnt) {
	return num << cnt | num >>> 32 - cnt;
}
/* 
 * These functions implement the four basic operations the algorithm uses. 
 */


function cmn(q, a, b, x, s, t) {
	return safe_add(rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
}

function ff(a, b, c, d, x, s, t) {
	return cmn(b & c | ~b & d, a, b, x, s, t);
}

function gg(a, b, c, d, x, s, t) {
	return cmn(b & d | c & ~d, a, b, x, s, t);
}

function hh(a, b, c, d, x, s, t) {
	return cmn(b ^ c ^ d, a, b, x, s, t);
}

function ii(a, b, c, d, x, s, t) {
	return cmn(c ^ (b | ~d), a, b, x, s, t);
}
/* 
 * Calculate the MD5 of an array of little-endian words, producing an array 
 * of little-endian words. 
 */


function coreMD5(x) {
	var a = 1732584193;
	var b = -271733879;
	var c = -1732584194;
	var d = 271733878;

	for (var i = 0; i < x.length; i += 16) {
		var olda = a;
		var oldb = b;
		var oldc = c;
		var oldd = d;
		a = ff(a, b, c, d, x[i + 0], 7, -680876936);
		d = ff(d, a, b, c, x[i + 1], 12, -389564586);
		c = ff(c, d, a, b, x[i + 2], 17, 606105819);
		b = ff(b, c, d, a, x[i + 3], 22, -1044525330);
		a = ff(a, b, c, d, x[i + 4], 7, -176418897);
		d = ff(d, a, b, c, x[i + 5], 12, 1200080426);
		c = ff(c, d, a, b, x[i + 6], 17, -1473231341);
		b = ff(b, c, d, a, x[i + 7], 22, -45705983);
		a = ff(a, b, c, d, x[i + 8], 7, 1770035416);
		d = ff(d, a, b, c, x[i + 9], 12, -1958414417);
		c = ff(c, d, a, b, x[i + 10], 17, -42063);
		b = ff(b, c, d, a, x[i + 11], 22, -1990404162);
		a = ff(a, b, c, d, x[i + 12], 7, 1804603682);
		d = ff(d, a, b, c, x[i + 13], 12, -40341101);
		c = ff(c, d, a, b, x[i + 14], 17, -1502002290);
		b = ff(b, c, d, a, x[i + 15], 22, 1236535329);
		a = gg(a, b, c, d, x[i + 1], 5, -165796510);
		d = gg(d, a, b, c, x[i + 6], 9, -1069501632);
		c = gg(c, d, a, b, x[i + 11], 14, 643717713);
		b = gg(b, c, d, a, x[i + 0], 20, -373897302);
		a = gg(a, b, c, d, x[i + 5], 5, -701558691);
		d = gg(d, a, b, c, x[i + 10], 9, 38016083);
		c = gg(c, d, a, b, x[i + 15], 14, -660478335);
		b = gg(b, c, d, a, x[i + 4], 20, -405537848);
		a = gg(a, b, c, d, x[i + 9], 5, 568446438);
		d = gg(d, a, b, c, x[i + 14], 9, -1019803690);
		c = gg(c, d, a, b, x[i + 3], 14, -187363961);
		b = gg(b, c, d, a, x[i + 8], 20, 1163531501);
		a = gg(a, b, c, d, x[i + 13], 5, -1444681467);
		d = gg(d, a, b, c, x[i + 2], 9, -51403784);
		c = gg(c, d, a, b, x[i + 7], 14, 1735328473);
		b = gg(b, c, d, a, x[i + 12], 20, -1926607734);
		a = hh(a, b, c, d, x[i + 5], 4, -378558);
		d = hh(d, a, b, c, x[i + 8], 11, -2022574463);
		c = hh(c, d, a, b, x[i + 11], 16, 1839030562);
		b = hh(b, c, d, a, x[i + 14], 23, -35309556);
		a = hh(a, b, c, d, x[i + 1], 4, -1530992060);
		d = hh(d, a, b, c, x[i + 4], 11, 1272893353);
		c = hh(c, d, a, b, x[i + 7], 16, -155497632);
		b = hh(b, c, d, a, x[i + 10], 23, -1094730640);
		a = hh(a, b, c, d, x[i + 13], 4, 681279174);
		d = hh(d, a, b, c, x[i + 0], 11, -358537222);
		c = hh(c, d, a, b, x[i + 3], 16, -722521979);
		b = hh(b, c, d, a, x[i + 6], 23, 76029189);
		a = hh(a, b, c, d, x[i + 9], 4, -640364487);
		d = hh(d, a, b, c, x[i + 12], 11, -421815835);
		c = hh(c, d, a, b, x[i + 15], 16, 530742520);
		b = hh(b, c, d, a, x[i + 2], 23, -995338651);
		a = ii(a, b, c, d, x[i + 0], 6, -198630844);
		d = ii(d, a, b, c, x[i + 7], 10, 1126891415);
		c = ii(c, d, a, b, x[i + 14], 15, -1416354905);
		b = ii(b, c, d, a, x[i + 5], 21, -57434055);
		a = ii(a, b, c, d, x[i + 12], 6, 1700485571);
		d = ii(d, a, b, c, x[i + 3], 10, -1894986606);
		c = ii(c, d, a, b, x[i + 10], 15, -1051523);
		b = ii(b, c, d, a, x[i + 1], 21, -2054922799);
		a = ii(a, b, c, d, x[i + 8], 6, 1873313359);
		d = ii(d, a, b, c, x[i + 15], 10, -30611744);
		c = ii(c, d, a, b, x[i + 6], 15, -1560198380);
		b = ii(b, c, d, a, x[i + 13], 21, 1309151649);
		a = ii(a, b, c, d, x[i + 4], 6, -145523070);
		d = ii(d, a, b, c, x[i + 11], 10, -1120210379);
		c = ii(c, d, a, b, x[i + 2], 15, 718787259);
		b = ii(b, c, d, a, x[i + 9], 21, -343485551);
		a = safe_add(a, olda);
		b = safe_add(b, oldb);
		c = safe_add(c, oldc);
		d = safe_add(d, oldd);
	}

	return [a, b, c, d];
}
/* 
 * Convert an array of little-endian words to a hex string. 
 */


function binl2hex(binarray) {
	var hex_tab = "0123456789abcdef";
	var str = "";

	for (var i = 0; i < binarray.length * 4; i++) {
		str += hex_tab.charAt(binarray[i >> 2] >> i % 4 * 8 + 4 & 0xF) + hex_tab.charAt(binarray[i >> 2] >> i % 4 * 8 &
			0xF);
	}

	return str;
}
/* 
 * Convert an array of little-endian words to a base64 encoded string. 
 */


function binl2b64(binarray) {
	var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	var str = "";

	for (var i = 0; i < binarray.length * 32; i += 6) {
		str += tab.charAt(binarray[i >> 5] << i % 32 & 0x3F | binarray[i >> 5 + 1] >> 32 - i % 32 & 0x3F);
	}

	return str;
}
/* 
 * Convert an 8-bit character string to a sequence of 16-word blocks, stored 
 * as an array, and append appropriate padding for MD4/5 calculation. 
 * If any of the characters are >255, the high byte is silently ignored. 
 */


function str2binl(str) {
	var nblk = (str.length + 8 >> 6) + 1; // number of 16-word blocks  

	var blks = new Array(nblk * 16);

	for (var i = 0; i < nblk * 16; i++) blks[i] = 0;

	for (var i = 0; i < str.length; i++) blks[i >> 2] |= (str.charCodeAt(i) & 0xFF) << i % 4 * 8;

	blks[i >> 2] |= 0x80 << i % 4 * 8;
	blks[nblk * 16 - 2] = str.length * 8;
	return blks;
}
/* 
 * Convert a wide-character string to a sequence of 16-word blocks, stored as 
 * an array, and append appropriate padding for MD4/5 calculation. 
 */


function strw2binl(str) {
	var nblk = (str.length + 4 >> 5) + 1; // number of 16-word blocks  

	var blks = new Array(nblk * 16);

	for (var i = 0; i < nblk * 16; i++) blks[i] = 0;

	for (var i = 0; i < str.length; i++) blks[i >> 1] |= str.charCodeAt(i) << i % 2 * 16;

	blks[i >> 1] |= 0x80 << i % 2 * 16;
	blks[nblk * 16 - 2] = str.length * 16;
	return blks;
}
/* 
 * External interface 
 */


function hexMD5(str) {
	return binl2hex(coreMD5(str2binl(str)));
}

function hexMD5w(str) {
	return binl2hex(coreMD5(strw2binl(str)));
}

function b64MD5(str) {
	return binl2b64(coreMD5(str2binl(str)));
}

function b64MD5w(str) {
	return binl2b64(coreMD5(strw2binl(str)));
}
/* Backward compatibility */


function calcMD5(str) {
	return binl2hex(coreMD5(str2binl(str)));
}

/**
 * 获取当前时间戳
 */
function currentTimeStamp(date) {
	return Date.parse(date);
}

/**
 * Object根据key值排序
 */
function sortObjectByKey(obj) {
	var newObj = {};
	Object.keys(obj).sort().forEach(function(key) {
		newObj[key] = obj[key];
	});
	return JSON.stringify(newObj);
}

/**
 * toast提示
 */
function showNoIconToast(text) {
	if (!text) {
		return
	}
	uni.showToast({
		title: text,
		icon: "none",
		duration: 1500
	});
}

/**
 * 
 * @param {跳转页面路径} path 
 * @param {跳转路由类型:1:switchTab; 2:reLaunch; 3:redirectTo; 4:navigateTo.} type 
 */
function miniAppRoute(path, type = 4) {
	let page = fetchCurrentPage()
	//路由白名单过滤，判断当前页面是否需要用户鉴权。需要鉴权的在未登录情况下，跳转到登录页。
	// if (!api.white_list.includes(path.split('?')[0])) {
	// 	let auth = uni.getStorageSync(api.authorization);

	// 	if (!auth) {
	// 		uni.reLaunch({
	// 			url: '/pages/home/index'
	// 		})
	// 		return;
	// 	}
	// }

	/**
	 * 判断当前路径是否为tab页，是则将type置为1
	 */
	if (api.tab_list.includes(path.split('?')[0])) {
		type = 1;
	}
	
	switch (type) {
		case 1: {
			uni.switchTab({
				url: path
			});
		}
		break;

	case 2: {
		uni.reLaunch({
			url: path
		});
	}
	break;

	case 3: {
		uni.redirectTo({
			url: path
		});
	}
	break;

	case 4: {
		uni.navigateTo({
			url: path
		});
	}
	break;

	default:
		break;
	}
}

/**
 * 页面配置
 * @param {Object} pageConfig
 */
function setPageConfig(pageConfig) {
	uni.setNavigationBarTitle({
		title: pageConfig.title
	});
	uni.setNavigationBarColor({
		backgroundColor: pageConfig.navBackgroundColor,
		frontColor: pageConfig.frontColor
	});
	uni.setBackgroundColor({
		backgroundColor: pageConfig.backgroundColor,
		backgroundColorTop: pageConfig.backgroundColorTop,
		backgroundColorBottom: pageConfig.backgroundColorBottom
	});
	uni.setBackgroundTextStyle({
		textStyle: pageConfig.loadingTextStyle
	});
}

/**
 * 页面分享配置
 * @param {Object} config
 */
function pageShareConfig(config) {
	return {
		title: config.shareTitle,
		imageUrl: config.shareCover
	};
}

/**
 * 用户信息
 */
function setLocalUserInfo(userInfo) {
	uni.setStorageSync(api.userInfo, userInfo)
}

function getLocalUserInfo() {
	return uni.getStorageSync(api.userInfo)
}

/**
 * 用户token
 */
function setLocalAuthorization(auth) {
	uni.setStorageSync(api.authorization, auth)
}

function getLocalAuthorization() {
	return uni.getStorageSync(api.authorization)
}

/**
 * 调用接口获取登录凭证（code）
 */
function fetchWxLogin() {
	return new Promise((resolve, reject) => {
		uni.login({
			success: (res) => {
				resolve(res.code)
			},
			fail: (err) => {
				reject(err)
			}
		})
	})
}

/**
 * 购物车页面badge
 * @param {Object} num
 */
function setCartBadge(num) {
	if (uni.getStorageSync(api.authorization)) {
		if (parseInt(num) > 0) {
			uni.setTabBarBadge({
				index: 2,
				text: num.toString()
			})
			let tabbarList = store.default.state.tabbarList
			let index = fetchCartIndex(tabbarList)
			tabbarList[index].count = num
			store.default.commit('$uStore', {name: 'tabbarList', value: tabbarList})
		} else {
			clearCartBadge();
		}
	} else {
		clearCartBadge();
	}
}

/**
 * 清除购物车badge
 */
function clearCartBadge() {
	uni.removeTabBarBadge({
		index: 2
	})
	let tabbarList = store.default.state.tabbarList
	let index = fetchCartIndex(tabbarList)
	tabbarList[index].count = 0
	store.default.commit('$uStore', {name: 'tabbarList', value: tabbarList})
}

/**
 * 获取购物车的index
 */
function fetchCartIndex(tabbarList) {
	let index = 0
	tabbarList.forEach((element, position) => {
		if (element.pagePath == '/pages/cart/index') {
			index = position
			return index
		}
	})
	return index
}

/**
 * 手机号码脱敏处理
 */
function fetchSecretPhone(phone) {
	let pat = /(\d{3})\d*(\d{4})/
	return phone.replace(pat, '$1****$2')
}

/**
 * 小程序分享通用参数设置
 * @param {Object} path 当前分享的页面路径
 */
function commonShareConfig(path) {
	let userInfo = getLocalUserInfo()
	if(userInfo.icode) {
		if (path.indexOf('?') != -1) {
			path += ('&ref=' + userInfo.icode)
		} else {
			path += ('?ref=' + userInfo.icode)
		}
		return path
	}
	let ref = uni.getStorageSync(api.ref)
	if (ref) {
		if (path.indexOf('?') != -1) {
			path += ('&ref=' + ref)
		} else {
			path += ('?ref=' + ref)
		}
		return path
	}
	return path
}

/**
 * 小程序分享朋友圈query
 */
function fetchTimeLineQuery(query) {
	let userInfo = getLocalUserInfo()
	if (userInfo.icode) {
		query.ref = userInfo.icode
	}
	let localRef = uni.getStorageSync(api.ref)
	if (localRef) {
		query.ref = localRef
	}
	query = fetchQueryParams(query, false)
	// console.log('query=====>',query)
	return query
}

/**
 * 回退页面
 */
function navigateBack() {
	let pages = getCurrentPages()
	if (pages.length >= 2) {
		uni.navigateBack({
			delta: 1
		})
	} else {
		miniAppRoute('/pages/index/index')
	}
}

/**
 * 消息页面badge
 * @param {Object} num
 */
function setMessageBadge(num) {
	if (parseInt(num) > 0) {
		uni.setTabBarBadge({
			index: 3,
			text: num.toString()
		})
	} else {
		clearMessageBadge();
	}
}

/**
 * 清除消息badge
 */
function clearMessageBadge() {
	uni.removeTabBarBadge({
		index: 3
	})
}

/**
 * 对象转url参数
 * @param {*} data,对象
 * @param {*} isPrefix,是否自动加上"?"
 */
function fetchQueryParams(data = {}, isPrefix = true, arrayFormat = 'brackets') {
	let prefix = isPrefix ? '?' : ''
	let _result = []
	if (['indices', 'brackets', 'repeat', 'comma'].indexOf(arrayFormat) == -1) arrayFormat = 'brackets';
	for (let key in data) {
		let value = data[key]
		// 去掉为空的参数
		if (['', undefined, null].indexOf(value) >= 0) {
			continue;
		}
		// 如果值为数组，另行处理
		if (value.constructor === Array) {
			// e.g. {ids: [1, 2, 3]}
			switch (arrayFormat) {
				case 'indices':
					// 结果: ids[0]=1&ids[1]=2&ids[2]=3
					for (let i = 0; i < value.length; i++) {
						_result.push(key + '[' + i + ']=' + value[i])
					}
					break;
				case 'brackets':
					// 结果: ids[]=1&ids[]=2&ids[]=3
					value.forEach(_value => {
						_result.push(key + '[]=' + _value)
					})
					break;
				case 'repeat':
					// 结果: ids=1&ids=2&ids=3
					value.forEach(_value => {
						_result.push(key + '=' + _value)
					})
					break;
				case 'comma':
					// 结果: ids=1,2,3
					let commaStr = "";
					value.forEach(_value => {
						commaStr += (commaStr ? "," : "") + _value;
					})
					_result.push(key + '=' + commaStr)
					break;
				default:
					value.forEach(_value => {
						_result.push(key + '[]=' + _value)
					})
			}
		} else {
			_result.push(key + '=' + value)
		}
	}
	return _result.length ? prefix + _result.join('&') : ''
}

function fetchCurrentPage() {
	let pages = getCurrentPages()
	// #ifdef APP-PLUS
	return pages.length > 0 &&  pages[pages.length - 1].$vm ? pages[pages.length - 1].$vm : ''
	// #endif
	// #ifdef H5
	return pages.length > 0 &&  pages[pages.length - 1] ? pages[pages.length - 1] : ''
	// #endif
}

function uploadOssFile(host, filePath, key, policy, ossAccessKeyId, signature, success, fail, complete) {
	uni.uploadFile({
		url: host,
		filePath: filePath,
		name: 'file',
		formData: {
			key,
			policy,
			OSSAccessKeyId: ossAccessKeyId,
			signature
		},
		success: res => {
			success(res)
		},
		fail: err => {
			fail(err)
		},
		complete: res => {
			complete(res)
		}
	})
}

/**
 * 本地用户列表操作
 */

/**
 * 根据用户名查询本地用户记录是否存在当前登录用户
 * @param { 本地列表 } userList
 * @param { 当前用户 } current
 */
function localExistCurrentUser(userList, current) {
	let position = -1
	for (let i = 0; i < userList.length; i++) {
		let user = userList[i]
		if (user.id == current.id) {
			position = i
			return position
		}
	}
	return position
}

/**
 * 更新本地用户信息
 * @param { 本地列表 } userList
 * @param { 更新索引 } index
 * @param { 当前用户 } user
 */
function updateLocalUserWithIndex(userList, index, user) {
	if (index < 0) return
	userList = Object.assign([], userList)
	userList.splice(index, 1, user)
	uni.setStorageSync(api.userList, JSON.stringify(userList))
}

/**
 * 新增本地用户信息
 * @param { 本地列表 } userList
 * @param { 当前用户 } user
 */
function insertLocalUserWithUser(userList, user) {
	userList = Object.assign([], userList)
	userList.push(user)
	uni.setStorageSync(api.userList, JSON.stringify(userList))
}

/**
 * 清除本地用户记录
 */
function clearLocalUser() {
	uni.removeStorageSync(api.userList)
}

/**
 * 删除某条本地用户记录信息
 */
function removeLocalUserWithIndex(userList, index) {
	if (index < 0) return
	userList = Object.assign([], userList)
	userList.splice(index, 1)
	uni.setStorageSync(api.userList, JSON.stringify(userList))
}


module.exports = {
	sha1: sha1,
	md5: hexMD5,
	sortObjectByKey: sortObjectByKey,
	currentTimeStamp: currentTimeStamp,
	showNoIconToast: (text) => showNoIconToast(text),
	miniAppRoute: (path, type) => miniAppRoute(path, type),
	setPageConfig: pageConfig => setPageConfig(pageConfig),
	pageShareConfig: config => pageShareConfig(config),
	setLocalUserInfo: (userinfo) => setLocalUserInfo(userinfo),
	getLocalUserInfo: getLocalUserInfo,
	setLocalAuthorization: (auth) => setLocalAuthorization(auth),
	getLocalAuthorization: getLocalAuthorization,
	fetchWxLogin: fetchWxLogin,
	setCartBadge: num => setCartBadge(num),
	clearCartBadge: clearCartBadge,
	fetchSecretPhone: phone => fetchSecretPhone(phone),
	commonShareConfig: path => commonShareConfig(path),
	navigateBack: navigateBack,
	setMessageBadge: num => setMessageBadge(num),
	clearMessageBadge: clearMessageBadge,
	fetchQueryParams: (data, isPrefix, arrayFormat) => fetchQueryParams(data, isPrefix, arrayFormat),
	fetchTimeLineQuery: query => fetchTimeLineQuery(query),
	uploadOssFile: (host, filePath, key, policy, ossAccessKeyId, signature, success, fail, complete) => uploadOssFile(host, filePath, key, policy, ossAccessKeyId, signature, success, fail, complete),
	localExistCurrentUser: (userList, current) => localExistCurrentUser(userList, current),
	updateLocalUserWithIndex: (userList, index, user) => updateLocalUserWithIndex(userList, index, user),
	insertLocalUserWithUser: (userList, user) => insertLocalUserWithUser(userList, user),
	clearLocalUser: clearLocalUser,
	postRequest: (url, data, showLoad, response, error, loadTitle) => serverHelper('POST', url, data, showLoad, response, error, loadTitle)
};
