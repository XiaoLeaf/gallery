<template>
	<view class="page-root">
		<view class="setting-root">
			<view class="setting-box">
				<view @click="onClickChangeAvatar" class="setting-item">
					<view class="item-title">{{ $t('my.avatar') }}</view>
					<view class="item-right">
						<image @click.stop="onClickAvatar" webp="true" lazy-load="true" class="avatar" mode="aspectFill" :src="userInfo.icon"></image>
					</view>
				</view>
				<view @click="onClickNickname" class="setting-item">
					<view class="item-title">{{ $t('my.nickname') }}</view>
					<view class="item-right">
						<view class="right-val">{{ userInfo.nickname }}</view>
						<u-icon name="arrow-right" size="24" color="#999"></u-icon>
					</view>
				</view>
				<view @click="onClickPhone" class="setting-item">
					<view class="item-title">{{ $t('form.phone') }}</view>
					<view class="item-right">
						<view class="right-val">{{ userInfo.country_tel }}</view>
						<u-icon name="arrow-right" size="24" color="#999"></u-icon>
					</view>
				</view>
			</view>
			<view class="setting-box">
				<view class="setting-item">
					<view class="item-title">{{ $t('my.invitation') }}</view>
					<view class="item-right">
						<view class="right-val">{{ userInfo.icode }}</view>
						<u-icon @click="onClickCopyIcode" custom-prefix="zx-icon" name="copy" size="40" color="#999"></u-icon>
					</view>
				</view>
				<view v-if="userInfo.frow" class="setting-item">
					<view class="item-title">{{ $t('my.inviter') }}</view>
					<view class="item-right">
						<view class="right-val">{{ userInfo.frow.nickname }}</view>
						<image @click="onClickFrowAvatar" webp="true" lazy-load="true" class="invite-avatar" mode="aspectFill" :src="userInfo.frow.icon"></image>
					</view>
				</view>
			</view>
			<view class="setting-box">
				<view @click="onClickResetPwd" class="setting-item">
					<view class="item-title">{{ $t('form.password') }}</view>
					<view class="item-right">
						<u-icon name="arrow-right" size="24" color="#999"></u-icon>
					</view>
				</view>
				<view @click="onClickResetPayPwd" class="setting-item">
					<view class="item-title">{{ $t('my.pay.password') }}</view>
					<view class="item-right">
						<u-icon name="arrow-right" size="24" color="#999"></u-icon>
					</view>
				</view>
			</view>
			<view class="setting-box">
				<view class="setting-item">
					<view class="item-title">{{ $t('common.version') }}</view>
					<view class="item-right">
						<view @click="onClickVersion" class="right-val">{{ version }}</view>
						<!-- #ifdef APP-PLUS -->
						<view v-if="needUpdate" @click="onClickUpdate" class="update-txt">{{ $t('common.upgrade') }}</view>
						<!-- #endif -->
					</view>
				</view>
			</view>
			<view class="setting-box">
				<view @click="onClickExit" class="exit-item">{{ $t('my.exit') }}</view>
			</view>
		</view>
		<u-popup v-model="showEdit" mode="bottom" border-radius="20" @close="onEditPopupClose">
			<view class="edit-popup-box">
				<view class="edit-popup-content">
					<block v-if="editType == 1">
						<view class="edit-popup-title">{{ $t('my.edit.nickname') }}</view>
						<view class="edit-popup-input-box">
							<u-field v-model="editUserInfo.nickname" :focus="autoFocus && showEdit" :label-width="0"
								:border-bottom="false" :placeholder="$t('my.nickname')" :placeholder-style="placeholderStyle"></u-field>
						</view>
						<view class="edit-popup-btn-box">
							<button @click="onSubmitEditNickname"
								:style="indexConfig ? indexConfig.btnStyle.primary : ''" class="submit-btn">{{ $t('common.submit') }}</button>
						</view>
					</block>
					<block v-else-if="editType == 2">
						<view class="edit-popup-title pb0">{{ $t('my.edit.phone') }}</view>
						<view class="edit-popup-subtitle">{{ $t('common.send.to') }}{{ userInfo.country_tel }}</view>
						<view class="edit-popup-input-box">
							<view class="input-box-left">
								<u-field v-model="modifyPhone.code" :focus="autoFocus && showEdit" :label-width="0"
									:border-bottom="false" type="number" maxlength="6"
									:placeholder-style="placeholderStyle" :placeholder="$t('form.captcha')"></u-field>
							</view>
							<button :style="indexConfig ? indexConfig.btnStyle.secondary : ''" :disabled="disabledBtn"
								@click="onClickModifyPhoneOldCodeBtn" type="default"
								class="code-btn">{{ codeBtnStr }}</button>
						</view>
						<view class="edit-popup-input-box">
							<view @click="onClickSelectArea" class="phone-area">+{{ modifyPhone.country }}</view>
							<view class="phone-input-box">
								<u-field v-model="modifyPhone.tel" :label-width="0" :border-bottom="false" type="number"
									:placeholder-style="placeholderStyle" :placeholder="$t('form.new.phone')"></u-field>
							</view>
						</view>
						<view class="edit-popup-input-box">
							<view class="input-box-left">
								<u-field v-model="modifyPhone.code_new" :label-width="0" :border-bottom="false"
									type="number" maxlength="6" :placeholder-style="placeholderStyle"
									:placeholder="$t('form.captcha')"></u-field>
							</view>
							<button :style="indexConfig ? indexConfig.btnStyle.secondary : ''"
								:disabled="disabledNewBtn" @click="onClickModifyPhoneNewCodeBtn" type="default"
								class="code-btn">{{ newCodeBtnStr }}</button>
						</view>
						<view class="edit-popup-btn-box">
							<button @click="onSubmitNewPhone" :style="indexConfig ? indexConfig.btnStyle.primary : ''"
								class="submit-btn">{{ $t('common.submit') }}</button>
						</view>
					</block>
				</view>
			</view>
		</u-popup>
		<u-select v-model="showArea" :list="indexConfig ? indexConfig.countryRes : []" mode="single-column" value-name="key" label-name="val" :confirm-text="$t('common.confirm')" :cancel-text="$t('common.cancel')" :default-value="defValue" @confirm="onSelectCountryConfirm"></u-select>
		<u-select v-model="showLocale" :list="localeList" :confirm-text="$t('common.confirm')" :cancel-text="$t('common.cancel')" :confirm-color="themeColor" @confirm="onSelectLocaleConfirm"></u-select>
	</view>
</template>

<script>
	const app = getApp()
	import {
		pathToBase64
	} from '@/js_sdk/mmmm-image-tools/index.js'
	export default {
		data() {
			return {
				showEdit: false,
				editType: 0,
				placeholderStyle: 'color: #c8c9cc; font-size: 28rpx;',
				autoFocus: false,
				codeBtnStr: '',
				disabledBtn: false,
				timer: '',
				newCodeBtnStr: '',
				disabledNewBtn: false,
				newTimer: '',
				userInfo: '',
				editUserInfo: '',
				phoneStr: '',
				version: '',
				modifyPhone: {
					code: '',
					tel: '',
					country: '',
					code_new: '',
				},
				modifyLoginPwd: {
					code: '',
					new_pwd: ''
				},
				showArea: false,
				defValue: [0],
				showLocale: false,
				needUpdate: false,
			}
		},
		
		computed: {
			locale() {
				return uni.getLocale()
			}
		},

		onLoad() {
			this.codeBtnStr = this.$t('common.validate.code')
			this.newCodeBtnStr = this.$t('common.validate.code')
			this.needUpdate = uni.getStorageSync(this.$api.needUpdate)
			this.userInfo = uni.getStorageSync(this.$api.userInfo)
			this.version = app.globalData.version
			this.$set(this.modifyPhone, 'country', this.userInfo.countryCode)
		},

		methods: {
			updateLocalUserInfo() {
				uni.setStorageSync(this.$api.userInfo, this.userInfo)
			},

			fetchDefValue() {
				let index = 0
				for (var i = 0; i < this.indexConfig.countryRes.length; i++) {
					let element = this.indexConfig.countryRes[i]
					if (element.key == this.modifyPhone.country) {
						index = i
						break
					}
				}
				this.defValue = [index]
			},

			fetchValidataCode(type, tel, country = 0) {
				let params = {
					type: type
				}
				if (tel) {
					params.tel = tel
				}
				if (country) {
					params.country = country
				}
				this.$util.postRequest(this.$api.auth.code, params, true,
					res => {
						if (tel) {
							this.newCountDown()
						} else {
							this.countDown()
						}
						this.$util.showNoIconToast(res.info)
					},
					err => {
						this.clearTimer()
						this.$util.showNoIconToast(err.info)
					})
			},

			countDown() {
				let num = 60
				this.codeBtnStr = num + ' s'
				this.timer = setInterval(() => {
					num--
					if (num <= 0) {
						this.codeBtnStr = this.$t('common.validate.code')
						this.disabledBtn = false
						clearInterval(this.timer)
					} else {
						this.codeBtnStr = num + ' s'
						this.disabledBtn = true
					}
				}, 1000)
			},

			newCountDown() {
				let num = 60
				this.newCodeBtnStr = num + ' s'
				this.newTimer = setInterval(() => {
					num--
					if (num <= 0) {
						this.newCodeBtnStr = this.$t('common.validate.code')
						this.disabledNewBtn = false
						clearInterval(this.newTimer)
					} else {
						this.newCodeBtnStr = num + ' s'
						this.disabledNewBtn = true
					}
				}, 1000)
			},

			openEditPopup(type) {
				this.editType = type
				this.showEdit = true
				this.editUserInfo = Object.assign({}, this.userInfo)
				setTimeout(() => {
					this.autoFocus = true
				}, 500)
			},

			closeEditPopup() {
				this.showEdit = false
				this.autoFocus = false
			},

			clearTimer() {
				clearTimeout(this.timer)
				clearTimeout(this.newTimer)
				this.codeBtnStr = this.$t('common.validate.code')
				this.disabledBtn = false
				this.newCodeBtnStr = this.$t('common.validate.code')
				this.disabledNewBtn = false
			},

			onClickChangeAvatar() {
				let thay = this
				uni.chooseImage({
					count: 1,
					success: res => {
						if (res.errMsg == 'chooseImage:ok') {
							// console.log('res====>',JSON.stringify(res))
							let that = this
							// #ifdef MP-WEIXIN
							uni.getFileSystemManager().readFile({
								filePath: res.tempFilePaths[0],
								encoding: 'base64',
								success: (res) => {
									that.fetchUpdateAvatar(encodeURIComponent(res.data))
								},
								fail: (err) => {

								}
							})
							// #endif
							// #ifdef APP-PLUS
							pathToBase64(res.tempFiles[0].path).then(res => {
								let list = res.split(',')
								let base64Img = list[1]
								that.fetchUpdateAvatar(encodeURIComponent(base64Img))
							})
							// #endif
							// #ifdef H5
							uni.request({
								url: res.tempFiles[0].path,
								method: 'GET',
								responseType: 'arraybuffer',
								success: (res) => {
									// console.log('res====>',JSON.stringify(res))
									that.fetchUpdateAvatar(encodeURIComponent(uni.arrayBufferToBase64(res.data)))
								},
								fail: (err) => {
									uni.hideLoading()
									that.$util.showNoIconToast(that.$t('common.avatar.fail'))
								}
							})
							// #endif
						}
					},
					fail: err => {

					}
				})
			},

			fetchUpdateAvatar(avatar) {
				this.$util.postRequest(this.$api.user.photo, {
						icon_base64: avatar
					}, true,
					res => {
						this.$util.showNoIconToast(res.info)
						this.$set(this.userInfo, 'icon', res.data.icon)
						this.updateLocalUserInfo()
					},
					err => {
						this.$util.showNoIconToast(err.info)
					})
			},

			onClickAvatar() {
				let that = this
				uni.previewImage({
					urls: [that.userInfo.icon],
					current: that.userInfo.icon
				})
			},

			onClickNickname() {
				this.openEditPopup(1)
			},
			
			onEditPopupClose() {
				this.closeEditPopup()
				this.clearTimer()
			},

			onSubmitEditNickname() {
				this.$util.postRequest(this.$api.user.nickname, {
						nickname: encodeURIComponent(this.editUserInfo.nickname)
					}, true,
					res => {
						this.$util.showNoIconToast(res.info)
						this.$set(this.userInfo, 'nickname', res.data.nickname)
						this.updateLocalUserInfo()
						this.closeEditPopup()
					},
					err => {
						this.$util.showNoIconToast(err.info)
					})
			},

			onClickPhone() {
				if (this.editType != 2) {
					this.clearTimer()
				}
				this.openEditPopup(2)
				this.$nextTick(() => {
					this.fetchDefValue()
				})
			},

			onClickSelectArea() {
				this.showArea = true
			},

			onSelectCountryConfirm(event) {
				let data = event[0]
				this.$set(this.modifyPhone, 'country', data.value)
				this.fetchDefValue()
			},

			onClickModifyPhoneOldCodeBtn() {
				this.fetchValidataCode(this.$api.CODE_TYPE.VALIDATE)
			},

			onClickModifyPhoneNewCodeBtn() {
				if (!this.modifyPhone.tel) {
					this.$util.showNoIconToast(that.$t('common.fillin.phone'))
					return
				}
				this.fetchValidataCode(this.$api.CODE_TYPE.BIND_NEW_PHONE, this.modifyPhone.tel, this.modifyPhone.country)
			},

			onSubmitNewPhone() {
				let params = Object.assign({}, this.modifyPhone)
				this.$util.postRequest(this.$api.user.modify_tel, params, true,
					res => {
						this.$util.showNoIconToast(res.info)
						this.$set(this.modifyPhone, 'code', '')
						this.$set(this.modifyPhone, 'tel', '')
						this.$set(this.modifyPhone, 'code_new', '')
						this.$set(this.userInfo, 'tel', res.data.tel)
						this.$set(this.userInfo, 'countryCode', res.data.countryCode)
						this.$set(this.userInfo, 'country_tel', res.data.country_tel)
						// this.phoneStr = this.$util.fetchSecretPhone(this.userInfo.tel)
						this.updateLocalUserInfo()
						this.clearTimer()
						this.closeEditPopup()
					},
					err => {
						this.clearTimer()
						this.$util.showNoIconToast(err.info)
					})
			},

			onClickCopyIcode() {
				let that = this
				uni.setClipboardData({
					data: that.userInfo.icode,
					success: res => {
						that.$util.showNoIconToast(that.$t('common.copy.success'))
					}
				})
			},
			
			onClickFrowAvatar() {
				let that = this
				uni.previewImage({
					urls: [that.userInfo.frow.icon],
					current: that.userInfo.frow.icon
				})
			},

			onClickResetPwd() {
				this.$util.miniAppRoute('/mine/pages/new-login-pwd/index')
			},

			onClickLoginPwdCodeBtn() {
				this.fetchValidataCode(this.$api.CODE_TYPE.MODIFY_LOGIN_PASSWORD)
			},

			onSubmitLoginPwd() {

			},

			onClickResetPayPwd() {
				this.$util.miniAppRoute('/mine/pages/pay-pwd/index')
			},
			
			onClickLocale() {
				this.showLocale = true
			},
			
			onSelectLocaleConfirm(event) {
				// #ifdef APP-PLUS
				let platform = 0
				if (uni.getSystemInfoSync().system.search('iOS') != -1) {
					platform = 1
				} else {
					platform = 2
				}
				if (platform == 2) {
					let that = this
					uni.showModal({
						title: that.$t('common.warm.prompt'),
						content: that.$t('common.change.locale'),
						cancelText: that.$t('common.cancel'),
						confirmText: that.$t('common.confirm'),
						success: res => {
							if (res.confirm) {
								that.changeLocale(event[0].value)
							}
						}
					})
				} else {
					this.changeLocale(event[0].value)
				}
				// #endif
				// #ifdef H5
				this.changeLocale(event[0].value)
				// #endif
			},
			
			changeLocale(locale) {
				uni.setStorageSync(this.$api.locale, locale)
				uni.setLocale(locale)
				this.$i18n.locale = locale
				uni.$emit("setMescrollGlobalOption", {i18n: {type: locale}})
			},
			
			onClickVersion() {
				// #ifdef APP-PLUS
				this.$util.showNoIconToast(that.$t('common.newest.version'))
				// #endif
			},
			
			onClickUpdate() {
				// #ifdef APP-PLUS
				let that = this
				plus.runtime.getProperty(plus.runtime.appid, (widgetInfo) => {
					//存储当前版本号
					uni.setStorageSync(that.$api.updateVersion, widgetInfo.version)
					that.$util.postRequest(that.$api.any.check_update, {}, true,
						res => {
							let updateInfo = res.data
							if (updateInfo.url) {
								uni.showModal({
									title: that.$t('common.upgrade.prompt'),
									content: updateInfo.content,
									confirmColor: that.themeColor,
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
			},

			onClickExit() {
				let that = this
				uni.showModal({
					title: that.$t('common.warm.prompt'),
					content: that.$t('common.logout'),
					confirmColor: '#999999',
					cancelColor: that.themeColor,
					success: res => {
						if (res.confirm) {
							uni.removeStorageSync(that.$api.userInfo)
							uni.removeStorageSync(that.$api.authorization)
							that.$util.showNoIconToast(that.$t('common.safe.exit'))
							setTimeout(() => {
								that.$u.vuex('loginStatus', false)
								that.userInfo = null
								that.$util.miniAppRoute('/pages/home/index', 2)
							}, 1500)
						}
					}
				})
			}
		}
	}
</script>

<style lang="less">
	page {
		.hper-100();
		background-color: @background-color;
	}

	.setting-root {
		.hper-100();
		box-sizing: border-box;
		.flex-col();

		.setting-box {
			background-color: #FFFFFF;
			padding: 0 @padding-xs;
			box-sizing: border-box;
			margin-bottom: @common-blank;

			.setting-item {
				.flex-c-aic-jcb();
				font-size: @font-size-base;
				padding: @padding-xs + 10rpx 0;
				position: relative;

				&:not(:last-child)::after {
					position: absolute;
					bottom: 0;
					left: 0;
					.wper-100();
					height: 1px;
					background-color: #f9f9f9;
					content: '';
				}

				.item-title {
					color: @text-secondary-color;
				}

				.item-right {
					.flex-c-aic();
					line-height: 1;
					line-height: normal;

					.avatar {
						width: 80rpx;
						height: 80rpx;
						vertical-align: middle;
						border-radius: 80rpx;
						overflow: hidden;
						background-color: @primary-color;
					}
					
					.invite-avatar {
						width: 40rpx;
						height: 40rpx;
						border-radius: 40rpx;
						overflow: hidden;
						vertical-align: middle;
					}

					.right-val {
						color: @text-primary-color;
						padding-right: @padding-xs / 4;
					}
					
					.update-txt {
						color: @primary-color;
						font-size: @font-size-sm;
						padding-left: @padding-xs;
						box-sizing: border-box;
					}
				}
			}

			.exit-item {
				padding: @padding-xs + 10rpx 0;
				.flex-c-aic-jcc();
				color: @text-secondary-color;
				font-size: @font-size-base;
			}
		}
	}

	.edit-popup-box {
		padding: @padding-xs * 2;
		box-sizing: border-box;
		width: 100%;
		background-color: #FFFFFF;
		min-height: 80vh;
		max-width: 80vh;
		
		/deep/ .u-flex-1 {
			flex: 1;
		}

		.edit-popup-content {
			.flex-col-aic-jcc();

			.edit-popup-title {
				color: @text-primary-color;
				font-weight: 500;
				padding-bottom: @padding-xs * 2;
			}

			.pb0 {
				padding-bottom: 0 !important;
			}

			.mb0 {
				margin-bottom: 0 !important;
			}

			.edit-popup-subtitle {
				color: @text-primary-color;
				font-size: @font-size-medium;
				padding: @padding-xs / 2 0 @padding-xs * 2 0;
			}

			.edit-popup-tips {
				color: @text-thirdly-color;
				font-size: @font-size-sm;
				padding-top: @padding-xs;
				width: 100%;
			}

			.edit-popup-input-box {
				width: 100%;
				background-color: #F9F9F9;
				border-radius: @border-radius-base;
				overflow: hidden;
				margin-bottom: @padding-xs;
				.flex-c-aic();

				/deep/.u-field {
					width: 100%;
				}

				.phone-area {
					color: @text-secondary-color;
					font-size: @font-size-base;
					padding: 0 28rpx;
					.num-ff();
					font-weight: 300;
				}

				.phone-input-box {

					/deep/.u-field {
						padding-left: 0 !important;
					}
				}

				.input-box-left {
					.flex-c-aic();
					flex: 1;
					overflow: hidden;
				}

				.code-btn {
					background-color: @primary-color;
					.flex-c-aic-jcc();
					padding: 0 @padding-xs;
					margin: 0 @padding-xs 0 0;
					width: auto;
					color: #FFFFFF;
					font-size: @font-size-sm;
					font-weight: normal;
					border-radius: @border-radius-base;
					font-family: Arial, Helvetica, sans-serif;

					&::after {
						border: none;
					}
				}
			}

			.edit-popup-btn-box {
				width: 100%;
				padding-top: @padding-xs * 2;

				.submit-btn {
					.flex-c-aic-jcc();
					padding: 0;
					margin: 0;
					font-size: @font-size-base;
					line-height: 88rpx;
					color: #FFFFFF;
					background-color: @primary-color;

					&::after {
						border: none;
					}
				}
			}
		}
	}
</style>
