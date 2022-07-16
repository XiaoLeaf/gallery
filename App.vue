<script>
	const version = '1.0.0'
	export default {
		globalData: {
			version: version,
		},

		onLaunch(options) {
			let locale = uni.getStorageSync(this.$api.locale)
			if (!locale) {
				locale = 'zh-Hans'
				uni.setLocale(locale)
				this.$i18n.locale = locale
				uni.$emit("setMescrollGlobalOption", {i18n: {type: locale}})
			}
			
			if (uni.getStorageSync(this.$api.authorization)) {
				this.$u.vuex('loginStatus', true)
			}
			// console.log('options====>',JSON.stringify(options))
			if (options.query.scene) {
				let scene = decodeURIComponent(options.query.scene)
				let params = scene.split('&')
				let newParams = {}
				for (var i in params) {
					let tmp = params[i].split('=')
					newParams[tmp[0]] = tmp[1]
				}
				if (newParams.ref) {
					uni.setStorageSync(this.$api.ref, newParams.ref)
				}
			}
			if (options.query.ref) {
				uni.setStorageSync(this.$api.ref, options.query.ref)
			}
			
			uni.setStorageSync(this.$api.version, version)
			
			if (!uni.getStorageSync(this.$api.unionUser)) {
				uni.setStorageSync(this.$api.unionUser, this.$u.guid(32, false))
			}
			
			// #ifdef APP-PLUS
			let that = this
			//install-app
			plus.runtime.getProperty(plus.runtime.appid, (widgetInfo) => {
				// console.log('widgetInfo====>',JSON.stringify(widgetInfo))
				uni.setStorageSync(that.$api.updateVersion, widgetInfo.version)
				that.$util.postRequest(that.$api.any.check_update, {}, false,
					res => {
						let updateInfo = res.data
						// console.log('updateInfo====>',JSON.stringify(updateInfo))
						if (updateInfo.url) {
							uni.showModal({
								title: that.$t('common.upgrade.prompt'),
								content: updateInfo.content,
								confirmColor: that.$options.globalData.themeColor,
								cancelColor: '#999999',
								confirmText: that.$t('common.confirm'),
								cancelText: that.$t('common.cancel'),
								success: (modalRes) => {
									if (modalRes.confirm) {
										if (updateInfo.type == 1) {
											plus.runtime.openURL(updateInfo.url)
										} else {
											uni.downloadFile({
												url: updateInfo.url,
												success: res => {
													// console.log('res====>',JSON.stringify(res))
													if (res.statusCode === 200) {
														plus.runtime.install(res.tempFilePath, {force: false},
														(res) => {
															// console.log('install-res=====>',JSON.stringify(res))
															plus.runtime.restart()
														},
														(err) => {
															uni.setStorageSync(that.$api.needUpdate, true)
															// console.log('install-err=====>',JSON.stringify(err))
														})
													} else {
														uni.setStorageSync(that.$api.needUpdate, true)
													}
												}
											})
										}
									} else {
										uni.setStorageSync(that.$api.needUpdate, true)
									}
								}
							})
						}
					},
					err => {
						// console.log('err====>',JSON.stringify(err))
						uni.setStorageSync(that.$api.needUpdate, false)
					})
			})
			// #endif
			
			uni.getSystemInfo({
				success: res => {
					// this.$options.globalData.statusH = res.statusBarHeight
					this.$u.vuex('statusH', res.statusBarHeight)
				}
			})
			
			this.updateLocalUserInfo()
		},
		
		onShow() {
			this.fetchIndexConfig()
		},

		methods: {
			updateLocalUserInfo() {
				if (uni.getStorageSync(this.$api.authorization) && !uni.getStorageSync(this.$api.userInfo)) {
					this.$util.postRequest(this.$api.user.userinfo, {}, false,
						res => {
							uni.setStorageSync(this.$api.userInfo, res.data.userRow)
						},
						err => {

						})
				}
			},
			
			fetchIndexConfig() {
				this.$util.postRequest(this.$api.index.get_config, {}, false,
					res => {
						// console.log('res====>',JSON.stringify(res.data))
						uni.setStorageSync(this.$api.indexConfigVersion, res.data.version)
						this.$options.globalData.indexConfig = res.data.config
						this.$u.vuex('indexConfig', res.data.config)
					},
					err => {
						console.log('err====>',JSON.stringify(err))
					})
			}
		}
	}
</script>

<style lang="less">
	/* #ifndef APP-PLUS */
	@import "common/default.less";
	/* #endif */

	.u-badge {
		min-width: 32rpx;
		.num-ff();
		font-size: 20rpx !important;
	}

	.u-tabbar__content__item__text {
		bottom: 4rpx !important;
		font-size: 20rpx !important;
	}
	
	image {
		height: auto;
	}
</style>

<style lang="scss">
	@import "./static/iconfont/iconfont.css";
	/* #ifndef APP-PLUS */
	@import "uview-ui/index.scss";
	/* #endif */
</style>
