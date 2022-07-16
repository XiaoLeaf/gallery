import api from '@/config/api.js'
module.exports = {
	data() {
		return {
			capsule: '',
		}
	},
	
	onReady() {
		// #ifdef MP-WEIXIN
		let systemInfo = uni.getSystemInfoSync()
		let localCapsule = uni.getStorageSync(api.capsule)
		if (localCapsule) {
			this.capsule = localCapsule
		} else {
			this.capsule = uni.getMenuButtonBoundingClientRect()
			if (!this.capsule || !this.capsule.width || !this.capsule.top || !this.capsule.height || !this.capsule.left || !this.capsule.right || !this.capsule.bottom) {
				this.capsule.width = 87
				this.capsule.height = 32
				this.capsule.top = systemInfo.statusBarHeight + 4
				this.capsule.bottom = systemInfo.statusBarHeight + 4 + 32
				this.capsule.left = systemInfo.screenWidth - 87 - 7
				this.capsule.right = systemInfo.screenWidth - 7
			}
			uni.setStorageSync(api.capsule, this.capsule)
		}
		// #endif
	},
	
	created() {
		// #ifdef MP-WEIXIN
		let systemInfo = uni.getSystemInfoSync()
		let localCapsule = uni.getStorageSync(api.capsule)
		if (localCapsule) {
			this.capsule = localCapsule
		} else {
			this.capsule = uni.getMenuButtonBoundingClientRect()
			if (!this.capsule || !this.capsule.width || !this.capsule.top || !this.capsule.height || !this.capsule.left || !this.capsule.right || !this.capsule.bottom) {
				this.capsule.width = 87
				this.capsule.height = 32
				this.capsule.top = systemInfo.statusBarHeight + 4
				this.capsule.bottom = systemInfo.statusBarHeight + 4 + 32
				this.capsule.left = systemInfo.screenWidth - 87 - 7
				this.capsule.right = systemInfo.screenWidth - 7
			}
			uni.setStorageSync(api.capsule, this.capsule)
		}
		// #endif
	},
	
	methods: {
		
	}
}