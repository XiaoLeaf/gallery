<template>
	<view v-if="loaded" class="common-page-root">
		<view class="common-page-box">
			<view class="form-root">
				<view class="form-content-box">
					<view class="form-content-title">{{ $t('bind.bank.gather') }}</view>
					<view class="form-content-item">
						<view class="item-left">
							<view>{{ $t('bind.bank') }}</view>
						</view>
						<view class="item-right">
							<u-field v-model="bindForm.bank_name" :label-width="0" input-align="right" :border-bottom="false" :placeholder="$t('bind.bank')"></u-field>
						</view>
					</view>
					<view class="form-content-item">
						<view class="item-left">
							<view>{{ $t('bind.account.bank') }}</view>
						</view>
						<view class="item-right">
							<u-field v-model="bindForm.bank" :label-width="0" input-align="right" :border-bottom="false" :placeholder="$t('bind.account.bank')"></u-field>
						</view>
					</view>
					<view class="form-content-item">
						<view class="item-left">
							<view>{{ $t('bind.bank.card') }}</view>
						</view>
						<view class="item-right">
							<u-field v-model="bindForm.card" :label-width="0" input-align="right" :border-bottom="false" :placeholder="$t('bind.bank.card')"></u-field>
						</view>
					</view>
					<view class="form-content-item">
						<view class="item-left">
							<view>{{ $t('bind.bank.user') }}</view>
						</view>
						<view class="item-right">
							<u-field v-model="bindForm.realname" :label-width="0" input-align="right" :border-bottom="false" :placeholder="$t('bind.bank.user')"></u-field>
						</view>
					</view>
				</view>
				<view class="form-content-box">
					<view class="form-content-title">{{ $t('bind.wx.gather') }}</view>
					<view class="form-content-item">
						<view class="item-left">
							<view class="icon-box">
								<u-icon name="weixin-circle-fill" size="50" color="#57BE6A"></u-icon>
							</view>
							<view>{{ $t('bind.wx.qrcode') }}</view>
						</view>
						<view class="item-right">
							<block v-if="bindForm.wx_code">
								<image webp="true" lazy-load="true" class="upload-img" mode="aspectFill" :src="bindForm.wx_code"></image>
							</block>
							<block v-else>
								<view @click="onClickSelectImage(1)" class="item-upload">
									<u-icon name="plus" size="50" color="#999"></u-icon>
									<view class="f8 pt3"></view>
								</view>
							</block>
						</view>
					</view>
				</view>
				<view class="form-content-box">
					<view class="form-content-title">{{ $t('bind.usdt.gather') }}</view>
					<view class="form-content-item">
						<view class="item-left">
							<view>{{ $t('bind.usdt.address') }}</view>
						</view>
						<view class="item-right">
							<u-field v-model="bindForm.usdt" :label-width="0" input-align="right" :border-bottom="false" :placeholder="$t('bind.usdt.address')"></u-field>
						</view>
					</view>
					<view class="form-content-item">
						<view class="item-left">
							<view class="icon-box">
								<u-icon name="weixin-circle-fill" size="50" color="#57BE6A"></u-icon>
							</view>
							<view>{{ $t('bind.usdt.qrcode') }}</view>
						</view>
						<view class="item-right">
							<block v-if="bindForm.usdt_code">
								<image webp="true" lazy-load="true" class="upload-img" mode="aspectFill" :src="bindForm.usdt_code"></image>
							</block>
							<block v-else>
								<view @click="onClickSelectImage(2)" class="item-upload">
									<u-icon name="plus" size="50" color="#999"></u-icon>
									<view class="f8 pt3"></view>
								</view>
							</block>
						</view>
					</view>
				</view>
				<view class="form-content-box">
					<view class="form-content-title">{{ $t('bind.alipay.gather') }}</view>
					<view class="form-content-item">
						<view class="item-left">
							<view>{{ $t('bind.alipay.account') }}</view>
						</view>
						<view class="item-right">
							<u-field v-model="bindForm.alipay" :label-width="0" input-align="right" :border-bottom="false" :placeholder="$t('bind.alipay.account')"></u-field>
						</view>
					</view>
					<view class="form-content-item">
						<view class="item-left">
							<view class="icon-box">
								<u-icon name="weixin-circle-fill" size="50" color="#57BE6A"></u-icon>
							</view>
							<view>{{ $t('bind.alipay.qrcode') }}</view>
						</view>
						<view class="item-right">
							<block v-if="bindForm.alipay_code">
								<image webp="true" lazy-load="true" class="upload-img" mode="aspectFill" :src="bindForm.alipay_code"></image>
							</block>
							<block v-else>
								<view @click="onClickSelectImage(3)" class="item-upload">
									<u-icon name="plus" size="50" color="#999"></u-icon>
									<view class="f8 pt3"></view>
								</view>
							</block>
						</view>
					</view>
				</view>
				<view class="form-content-box">
					<view class="form-captcha-item">
						<view class="captcha-item-left">
							<u-field v-model="bindForm.vcode" :label-width="0" :border-bottom="false" :placeholder="$t('register.security.captcha')"></u-field>
						</view>
						<view class="captcha-item-right">
							<image @click="$u.debounce(onClickRefreshCaptcha, 400, true)" webp="true" lazy-load="true" class="content-img" mode="widthFix" :src="captchaImg"></image>
						</view>
					</view>
					<view class="form-captcha-item">
						<view class="captcha-item-left">
							<u-field v-model="bindForm.code" :label-width="0" :border-bottom="false" :placeholder="$t('register.sms.captcha')"></u-field>
						</view>
						<view class="captcha-item-right">
							<button :style="indexConfig ? indexConfig.btnStyle.secondary : ''" :disabled="disabled" @click="$u.debounce(onClickCodeBtn, 400, true)" class="code-btn">{{ codeBtnStr }}</button>
						</view>
					</view>
				</view>
				<view class="form-submit-box">
					<button @click="onClickSubmit" class="submit-btn" :style="indexConfig ? indexConfig.btnStyle.primary : ''">{{ $t('common.submit') }}</button>
				</view>
			</view>
		</view>
		<u-popup v-model="showPassword" mode="bottom">
			<view class="password-popup-box">
				<view class="password-title">
					<view>{{ $t('my.pay.password') }}</view>
				</view>
				<view class="input-box">
					<u-message-input :dot-fill="true" :value="paypwd" :maxlength="6" :width="90"></u-message-input>
				</view>
				<view class="keyboard-box">
					<zx-keyboard ref="zxkeyboard" @click="onClickKeyboardItem" @delete="onClickKeyboardDelete">
					</zx-keyboard>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loaded: true,
				captchaImg: '',
				disabled: false,
				bindForm: {
					bank_name: '',
					bank: '',
					card: '',
					realname: '',
					wx_code: '',
					usdt: '',
					usdt_code: '',
					alipay: '',
					alipay_code: '',
					vcode: '',
					code: ''
				},
				showPassword: false,
				paypwd: '',
				pwdVal: '',
				codeBtnStr: '',
				timer: ''
			}
		},
		
		watch: {
			indexConfig: {
				handler(val) {
					if (this.indexConfig) {
						this.refreshCaptcha()
					}
				},
				deep: true
			}
		},
		
		onLoad() {
			this.codeBtnStr = this.$t('common.validate.code')
			if (this.indexConfig) {
				this.refreshCaptcha()
			}
		},
		
		methods: {
			refreshCaptcha() {
				this.$set(this.bindForm, 'vcode', '')
				this.captchaImg = this.indexConfig.captcha_url + '?imei=' + uni.getStorageSync(this.$api.unionUser) + '&time=' + Date.now()
			},
			
			onClickSelectImage(type) {
				let that = this
				uni.chooseImage({
					count: 1,
					success: res => {
						let path = res.tempFilePaths[0]
						switch(type) {
							case 1:
							{
								that.$set(that.bindForm, 'wx_code', path)
							}
							break
							case 2:
							{
								that.$set(that.bindForm, 'usdt_code', path)
							}
							break
							case 3:
							{
								that.$set(that.bindForm, 'alipay_code', path)
							}
							break
							default:
							break
						}
					}
				})
			},
			
			onClickRefreshCaptcha() {
				this.refreshCaptcha()
			},
			
			onClickCodeBtn() {
				if (!this.bindForm.vcode) {
					this.$util.showNoIconToast(this.$t('common.fillin.vcode'))
					return
				}
				let params
				params = {
					tel: this.register.tel,
					type: this.$api.CODE_TYPE.REGISTER,
					vcode: this.register.vcode,
				}
				params.country = this.register.country
				this.$util.postRequest(this.$api.auth.code, params, true,
					res => {
						this.countDown()
						this.$util.showNoIconToast(res.info)
					},
					err => {
						this.$util.showNoIconToast(err.info)
						clearInterval(this.timer)
						this.codeBtnStr = this.$t('common.validate.code')
						this.disabled = false
					})
			},
			
			countDown() {
				let num = 60
				this.codeBtnStr = num + ' s'
				this.timer = setInterval(() => {
					num--
					if (num <= 0) {
						this.codeBtnStr = this.$t('common.validate.code')
						this.disabled = false
						clearInterval(this.timer)
					} else {
						this.codeBtnStr = num + ' s'
						this.disabled = true
					}
				}, 1000)
			},
			
			onClickSubmit() {
				this.showPassword = true
			},

			onClickKeyboardItem(num) {
				if (this.pwdVal.length >= 6) return
				this.pwdVal = this.pwdVal + num
				this.paypwd = this.paypwd + num
				let that = this
				if (this.pwdVal.length == 6) {
					this.showPassword = false
				}
			},

			onClickKeyboardDelete() {
				if (this.pwdVal.length <= 0) return
				this.pwdVal = this.pwdVal.substring(0, this.pwdVal.length - 1)
				this.paypwd = this.paypwd.substring(0, this.paypwd.length - 1)
			},
		}
	}
</script>

<style lang="less">
	page {
		.hper-100();
		background-color: @background-color;
	}
	
	/deep/ .u-flex-1 {
		flex: 1;
	}
	
	/deep/ .u-field {
		padding: 0!important;
	}
	
	.common-page-box {
		overflow: auto!important;
	}
	
	.form-root {
		padding: @padding-xs;
		box-sizing: border-box;
		.wper-100();
		
		.form-content-box {
			background-color: #fff;
			border-radius: @border-radius-base * 2;
			overflow: hidden;
			padding: @padding-xs;
			box-sizing: border-box;
			.wper-100();
			
			&:not(:first-child) {
				margin-top: @common-blank * 2;
			}
			
			.form-content-title {
				color: @text-secondary-color;
				font-size: @font-size-sm;
			}
			
			.form-content-item {
				.flex-c-aic();
				.wper-100();
				position: relative;
				padding: @padding-xs + 10rpx 0;
				
				&:not(:last-child)::after {
					position: absolute;
					bottom: 0;
					left: 0;
					.wper-100();
					height: 1px;
					background-color: #f1f1f1;
					content: '';
				}
				
				.item-left {
					.flex-c-aic();
					color: @text-primary-color;
					font-size: @font-size-base;
					
					.icon-box {
						margin-right: @common-blank;
					}
				}
				
				.item-right {
					padding-left: @padding-xs;
					box-sizing: border-box;
					flex: 1;
					overflow: hidden;
					.flex-c-aic-jce();
					
					.upload-img {
						width: 120rpx;
						height: 120rpx;
						border-radius: @border-radius-base * 2;
						overflow: hidden;
						vertical-align: middle;
					}
					
					.item-upload {
						width: 120rpx;
						height: 120rpx;
						border-radius: @border-radius-base * 2;
						overflow: hidden;
						.flex-col-aic-jcc();
						color: @text-thirdly-color;
						border: 2rpx dashed #e1e1e1;
					}
				}
			}
			
			.form-captcha-item {
				.flex-c-aic();
				.wper-100();
				position: relative;
				padding: @padding-xs + 10rpx 0;
				
				&:not(:last-child)::after {
					position: absolute;
					bottom: 0;
					left: 0;
					.wper-100();
					height: 1px;
					background-color: #f1f1f1;
					content: '';
				}
				
				.captcha-item-left {
					flex: 1;
					overflow: hidden;
					padding-right: @padding-xs;
					box-sizing: border-box;
				}
				
				.captcha-item-right {
					
					.content-img {
						margin-left: 25rpx;
						width: 180rpx;
						height: 60rpx;
						border-radius: 12rpx;
						overflow: hidden;
						vertical-align: middle;
						background-color: @primary-color;
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
				}
			}
		}
	
		.form-submit-box {
			margin: @common-blank * 2 0 100rpx;
			
			.submit-btn {
				.wper-100();
				line-height: 80rpx;
				border-radius: @border-radius-base * 2;
				overflow: hidden;
				padding: 0;
				margin: 0;
				color: #fff;
				background-color: @primary-color;
				font-size: @font-size-lg;
				
				&::after {
					border: none;
				}
			}
		}
	}

	.password-popup-box {
		padding: @padding-xs * 2 0;
		background-color: #FFFFFF;
		box-sizing: border-box;
		.flex-col-aic();
		border-radius: @border-radius-base;
		overflow: hidden;
	
		.password-title {
			padding: 0 @padding-xs * 2 @padding-xs *2;
			box-sizing: border-box;
			color: @text-primary-color;
			font-size: @font-size-xxxl + 2rpx;
			font-weight: 500;
		}
	
		.input-box {
			width: 100%;
			padding: 0 @padding-xs * 2;
			box-sizing: border-box;
		}
	
		.keyboard-box {
			width: 100%;
		}
	}
</style>
