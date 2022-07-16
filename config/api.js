const common = require('@/config/common.js')

module.exports = {
	
	ORDER_STATUS: {},
	
	CODE_TYPE: {
		REGISTER: 1,
		LOGIN: 2,
		FIND_PASSWORD: 3,
		VALIDATE: 4,
		BIND_NEW_PHONE: 5,
		MODIFY_LOGIN_PASSWORD: 6,
		MODIFY_PAY_PASSWORD: 7,
		MODIFY_WITHDRAW: 8,
		BIND_WECHAT: 9,
		APPLY: 10
	},
	
	white_list: [
		'/login/pages/index/index',
		'/pages/home/index',
		'/login/pages/register/index',
		'/login/pages/forget/index'
	],
	
	tab_list: [
		'/pages/index/index',
		'/pages/team/index',
		'/pages/my/index'
	],
	
	userInfo: common.storagePrefix + 'userInfo',

	authorization: common.storagePrefix + 'authorization',

	unionUser: common.storagePrefix + 'unionUser',

	version: common.storagePrefix + 'version',
	
	updateVersion: common.storagePrefix + 'updateVersion',
	
	needUpdate: common.storagePrefix + 'needUpdate',

	defPhoto: common.storagePrefix + 'defPhoto',

	openid: common.storagePrefix + 'openid',

	cartInfo: common.storagePrefix + 'cartInfo',

	ref: common.storagePrefix + 'ref',
	
	indexConfigVersion: common.storagePrefix + 'configVersion',
	
	capsule: common.storagePrefix + 'capsule',
	
	messageBadge: common.storagePrefix + 'message',
	
	locale: common.storagePrefix + 'locale',
	
	userList: common.storagePrefix + 'userList',
	
	keyStr: 'QpbTkP',
	
	index: {
		start: '/index/start',
		get_config: '/index/get_config',
	},
	
	user: {
		index: '/user/index',
		userinfo: '/user/user_info',
		photo: '/user/photo',
		nickname: '/user/nickname',
		modify_tel: '/user/modify_tel',
		modify_pay_pwd: '/user/modify_pay_pwd',
		modify_login_pwd: '/user/modify_login_pwd',
		modify_pwd: '/user/modify_pwd',
		account: '/user/account',
	},
	
	auth: {
		code: '/auth/code',
		pwd_login: '/auth/pwd_login',
		reg: '/auth/reg',
		find_pwd: '/auth/find_pwd',
	},
	
	ud: {
		account_list: '/ud/account_list',
		account_info: '/ud/account_info',
		account_opt: '/ud/account_opt',
		fund_list: '/ud/fund_list',
		order_list: '/ud/order_list',
		customer_service: '/ud/customer_service',
		addr: '/ud/addr',
		addr_info: '/ud/addr_info',
		addr_opt: '/ud/addr_opt',
		share: '/ud/share',
		wallet: '/ud/wallet',
		recharge: '/ud/recharge',
		recharge_list: '/ud/recharge_list',
		cash: '/ud/cash',
		cash_list: '/ud/cash_list',
		cash_cancel: '/ud/cash_cancel',
		money_list: '/ud/money_list',
		score_list: '/ud/score_list'
	},
	
	any: {
		check_update: '/any/check_update',
	},
	
	message: {
		index: '/message/index',
		item: '/message/item',
		opt: '/message/opt',
		mark_read: '/message/mark_read',
	},
	
	order: {
		get_list: '/order/get_list',
		get_goods: "/order/get_goods",
	},
	
	vip: {
		index: '/vip/index',
		buy: '/vip/buy'
	},
	
	dsc: {
		index: '/dsc/index',
		task: '/dsc/task',
	},
	
	goods: {
		gb_list: '/goods/gb_list',
		item: '/goods/item',
		order: '/goods/order',
		gb_history: '/goods/gb_history',
	},
	
	cms: {
		get_list: '/cms/get_list',
		item: '/cms/item',
		page: '/cms/page',
		faq: '/cms/faq'
	}
}
