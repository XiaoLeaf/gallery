<template>
	<view v-if="loaded" class="page-root login-root">
		<zx-navbar>
			<view slot="left" class="navbar-left" :style="{ 'width': capsule ? capsule.width + 20 + 'px' : '110px' }">
				<u-icon @click="onClickBack" custom-prefix="zx-icon" name="nav-back" size="44" color="#333"></u-icon>
			</view>
			<view slot="title" class="navbar-middle">
				<view class="middle-title"></view>
			</view>
			<view slot="right" class="navbar-right" :style="{ 'width': capsule ? capsule.width + 20 + 'px' : '110px' }">
				
			</view>
		</zx-navbar>
		<view class="login-content" :style="{'padding-top': capsule ? capsule.top + 50 + 'px' : (statusH + 54) + 'px'}">
			<view class="header-box">
				<view class="header-title">{{ $t('login.title') }}</view>
				<view class="login-container">
					<view>
						<view class="component-box">
							<view class="code-login-root">
								<form>
									<u-form ref="loginForm" label-position="top" :model="login" :error-type="['toast']">
										<u-form-item :label="$t('form.phone')" :label-style="labelStyle"
											:left-icon-style="iconStyle" prop="tel">
											<view class="phone-input-box">
												<view class="icon-box">
													<u-icon custom-prefix="zx-icon" name="phone" size="32" color="#999">
													</u-icon>
												</view>
												<u-input v-model="login.tel" type="number"
													:placeholder="$t('form.phone')"></u-input>
											</view>
										</u-form-item>
										<u-form-item :label="$t('form.password')" :label-style="labelStyle"
											:left-icon-style="iconStyle" prop="code">
											<view class="icon-box">
												<u-icon custom-prefix="zx-icon" name="password" size="32" color="#999">
												</u-icon>
											</view>
											<u-input v-model="login.pwd" type="password"
												:placeholder="$t('form.password')"></u-input>
										</u-form-item>
									</u-form>
									<view class="btn-box">
										<button @click="$u.debounce(submitLoginForm, 400, true)" :style="indexConfig ? indexConfig.btnStyle.primary : ''"
											class="login-btn">{{ $t('login.title') }}</button>
										<view class="btn-footer">
											<view>{{ $t('login.new.user') }}<text class="btn-txt" @click="onClickRegister">{{ $t('login.register') }}</text></view>
										</view>
										<view class="btn-footer">
											<view @click="onClickForget" class="forget-txt">{{ $t('login.forget') }}</view>
										</view>
									</view>
								</form>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<u-select v-model="showArea" :list="indexConfig ? indexConfig.countryRes : []" :confirm-text="$t('common.confirm')" :cancel-text="$t('common.cancel')" mode="single-column" value-name="key" label-name="val" :default-value="defValue" @confirm="onSelectConfirm"></u-select>
		<u-select v-model="showLocale" :list="localeList" :default-value="localeDefVal" :confirm-text="$t('common.confirm')" :cancel-text="$t('common.cancel')" :confirm-color="themeColor" @confirm="onSelectLocaleConfirm"></u-select>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loaded: true,
				login: {
					tel: '',
					pwd: '',
				},
				iconStyle: {
					fontSize: '18px',
					color: '#c0c4cc',
					lineHeight: '20px'
				},
				labelStyle: {
					fontSize: '24rpx',
					color: '#666666'
				},
				showArea: false,
				defValue: [0],
				showLocale: false,
				localeDefVal: [0],
			}
		},
		
		computed: {
			locale() {
				let locale = uni.getLocale()
				let index = 0
				for (var i = 0; i < this.localeList.length; i++) {
					let element = this.localeList[i]
					if (element.value == locale) {
						index = i
						break
					}
				}
				this.localeDefVal = [index]
				return locale
			}
		},

		watch: {
			indexConfig: {
				handler(val) {
					if (this.indexConfig) {
						this.$set(this.login, 'country', this.indexConfig.defCountryCode)
						this.fetchDefValue()
					}
				},
				deep: true,
			}
		},

		onLoad() {
			if (this.indexConfig) {
				this.$set(this.login, 'country', this.indexConfig.defCountryCode)
				this.fetchDefValue()
			}
		},

		methods: {
			onClickBack() {
				this.$util.navigateBack()
			},
			
			onClickSelectArea() {
				this.showArea = true
			},

			fetchDefValue() {
				let index = 0
				for (var i = 0; i < this.indexConfig.countryRes.length; i++) {
					let element = this.indexConfig.countryRes[i]
					if (element.key == this.login.country) {
						index = i
						break
					}
				}
				this.defValue = [index]
			},

			onSelectConfirm(event) {
				let data = event[0]
				this.$set(this.login, 'country', data.value)
				this.fetchDefValue()
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

			onClickRegister() {
				this.$util.miniAppRoute('/login/pages/register/index')
			},

			onClickForget() {
				this.$util.miniAppRoute('/login/pages/forget/index')
			},

			submitLoginForm() {
				let params = Object.assign({}, this.login)
				this.$util.postRequest(this.$api.auth.pwd_login, params, true,
					res => {
						this.$util.showNoIconToast(res.info)
						uni.setStorageSync(this.$api.authorization, res.data.authorization)
						uni.setStorageSync(this.$api.userInfo, res.data.useRow)
						//更新本地用户列表记录
						let userList = uni.getStorageSync(this.$api.userList)
						userList = userList ? JSON.parse(userList) : []
						let currentUser = Object.assign({}, res.data.userRow)
						currentUser.authorization = res.data.authorization
						if (userList.length > 0) {
							//查询本地是否存在当前用户记录,不存在新增，存在更新
							let index = this.$util.localExistCurrentUser(Object.assign([], userList), currentUser)
							if (index >= 0) {
								//存在记录-更新
								this.$util.updateLocalUserWithIndex(Object.assign([], userList), index, currentUser)
							} else {
								//记录不存在-新增
								this.$util.insertLocalUserWithUser(Object.assign([], userList), currentUser)
							}
						} else {
							//直接新增记录
							this.$util.insertLocalUserWithUser(Object.assign([], userList), currentUser)
						}
						let that = this
						setTimeout(() => {
							that.$u.vuex('loginStatus', true)
							that.$util.miniAppRoute('/pages/index/index')
						}, 1500)
					},
					err => {
						this.$util.showNoIconToast(err.info)
					})
			}
		}
	}
</script>

<style lang="less">
	page {
		.hper-100();
		// background-color: @background-color;
	}

	.login-root {
		position: relative;
		
		.local-txt {
			padding-right: @padding-xs / 4;
		}

		.login-content {
			.flex-col-jcb();
			padding: 0 @padding-xs;
			box-sizing: border-box;
			height: 100%;
			overflow: scroll;
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;

			.header-box {
				flex: 1;

				.header-title {
					padding: @padding-xs * 2 @padding-xs * 2 0;
					box-sizing: border-box;
					font-size: 40rpx;
					font-weight: 500;
					color: @text-primary-color;
				}

				.code-login-root {

					/deep/ .u-flex-1 {
						flex: 1;
					}

					.icon-box {
						margin-right: @common-blank * 2;
					}

					.phone-input-box {
						.flex-c-aic();
						.wper-100();

						.phone-area {
							color: @text-secondary-color;
							font-size: @font-size-base;
							padding-right: @padding-xs;
							.num-ff();
							font-weight: 300;
						}
					}

					.code-btn {
						padding: 0 @padding-xs;
						.flex-c-aic-jcc();
						margin: 0;
						background-color: transparent;
						line-height: 50rpx;
						color: @primary-color;
						width: auto;
						font-size: @font-size-sm;
						font-weight: normal;

						&::after {
							border: none;
						}
					}

					.register-tips {
						padding-top: @padding-xs;
						font-size: @font-size-sm;
						color: @text-secondary-color;
					}

					.btn-box {
						padding: @padding-xs * 2 0;

						.login-btn {
							background-color: @primary-color;
							width: 100%;
							color: #FFFFFF;
							font-weight: normal;
							font-size: @font-size-base;
							border-radius: @border-radius-base;
							overflow: hidden;
							padding: 0;
							margin: 0;
							line-height: 80rpx;
							.flex-c-aic-jcc();

							&::after {
								border: none;
							}
						}

						.btn-footer {
							padding-top: @padding-xs * 2;
							.flex-c-aic-jcc();
							font-size: @font-size-sm;
							color: @text-secondary-color;

							.btn-txt {
								color: @primary-color;
							}

							.forget-txt {
								color: #9BB2D4;
							}
						}
					}
				}
			}
		}
	}
</style>
