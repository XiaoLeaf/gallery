import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

let lifeData = {};

try{
	// 尝试获取本地是否存在lifeData变量，第一次启动APP时是不存在的
	lifeData = uni.getStorageSync('lifeData');
}catch(e){
	
}

// 需要永久存储，且下次APP启动需要取出的，在state中的变量名
let saveStateKeys = ['vuex_user', 'vuex_token'];

// 保存变量到本地存储中
const saveLifeData = function(key, value){
	// 判断变量名是否在需要存储的数组中
	if(saveStateKeys.indexOf(key) != -1) {
		// 获取本地存储的lifeData对象，将变量添加到对象中
		let tmp = uni.getStorageSync('lifeData');
		// 第一次打开APP，不存在lifeData变量，故放一个{}空对象
		tmp = tmp ? tmp : {};
		tmp[key] = value;
		// 执行这一步后，所有需要存储的变量，都挂载在本地的lifeData对象中
		uni.setStorageSync('lifeData', tmp);
	}
}
const store = new Vuex.Store({
	state: {
		vuex_version: '1.0.0',
		loginStatus: false,
		indexConfig: '',
		themeColor: '#0066FF',
		statusH: 20.0 ,
		localeList: [
			{
				label: 'English',
				value: 'en'
			},
			{
				label: 'Nederlands',
				value: 'nl'
			},
			{
				label: 'Persian',
				value: 'fa'
			}
		]
	},
	mutations: {
		$uStore(state, payload) {
			
			let nameArr = payload.name.split('.');
			let saveKey = '';
			let len = nameArr.length;
			if(len >= 2) {
				let obj = state[nameArr[0]];
				for(let i = 1; i < len - 1; i ++) {
					obj = obj[nameArr[i]];
				}
				obj[nameArr[len - 1]] = payload.value;
				saveKey = nameArr[0];
			} else {
				
				state[payload.name] = payload.value;
				saveKey = payload.name;
			}
			
			saveLifeData(saveKey, state[saveKey])
		},
		
		loginStatus(state, provider) {
			state.loginStatus = provider.status 
		},
		
		indexConfig(state, provider) {
			state.indexConfig = provider.indexConfig
		},
		
		themeColor(state, provider) {
			state.themeColor = provider.themeColor
		},
		
		tabbarList(state, provider) {
			state.tabbarList = provider.tabbarList
		}
	}
})

export default store
