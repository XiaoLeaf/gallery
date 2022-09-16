<template>
	<view class="sms-root">
		<button @click="$u.debounce(onClickCodeBtn, 400, true)" :disabled="disabled" class="sms-code-btn">{{ codeBtnStr }}</button>
		<u-popup v-model="showCaptcha" mode="center" :mask-close-able="false">
			<view class="captcha-popup-root">
				<view class="captcha-popup-box">
					<view class="captcha-popup-title flex-c-aic-jcb">
						<view>{{ $t('placeholder.vcode') }}</view>
					</view>
					<view class="captcha-close-box">
						<u-icon @click="onClickClose" name="close" size="32" color="#999"></u-icon>
					</view>
					<zx-captcha @click="onClickSubmit" :loading="captchaLoading"></zx-captcha>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		name:"zx-sms",
		
		props: {
			type: {
				type: String,
				default: ''
			},
			
			tel: {
				type: String,
				default: ''
			},
			
			checkTel: {
				type: Boolean,
				default: false
			},
			
			needCaptcha: {
				type: Boolean,
				default: true
			},
			
			locale: {
				type: String,
				default: 'zh-Hans'
			}
		},
		
		data() {
			return {
				captcha: '',
				timer: '',
				codeBtnStr: '',
				disabled: false,
				showCaptcha: false,
				captchaLoading: false,
			}
		},
		
		updated() {
			this.codeBtnStr = this.$t('common.validate.code')
		},
		
		beforeMount() {
			this.codeBtnStr = this.$t('common.validate.code')
		},
		
		methods: {
			onClickCodeBtn() {
				if (this.checkTel && !this.tel) {
					this.$util.showNoIconToast(this.$t('common.fillin.phone'))
					return
				}
				if (this.needCaptcha) {
					this.showCaptcha = true
				} else {
					this.fetchAuthCode()
				}
			},
			
			fetchAuthCode() {
				let params = {
					type: this.$api.CODE_TYPE[this.type]
				}
				if (this.checkTel) {
					params.tel = this.tel
				}
				if (this.needCaptcha) {
					params.vcode  = this.captcha
				}
				this.$util.postRequest(this.$api.auth.code, params, false,
					res => {
						this.countDown()
						this.$util.showNoIconToast(res.info)
						this.captchaLoading = false
						this.showCaptcha = false
					},
					err => {
						this.$util.showNoIconToast(err.info)
						clearInterval(this.timer)
						this.codeBtnStr = this.$t('common.validate.code')
						this.disabled = false
						this.captchaLoading = false
						this.showCaptcha = false
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
			
			onClickClose() {
				this.showCaptcha = false
			},
			
			onClickSubmit(event) {
				this.captcha = event.captcha
				this.captchaLoading = true
				this.fetchAuthCode()
			},
		}
	}
</script>

<style lang="less">
	.sms-root {
		margin-left: @common-blank * 2;
		
		.sms-code-btn {
			line-height: 60rpx;
			border-radius: 12rpx;
			color: #FFFFFF;
			margin: 0;
			padding: 0 20rpx;
			font-size: @font-size-base;
			background-color: @primary-color;
			
			&::after {
				border: none;
			}
		}
		
		/deep/.u-mode-center-box {
			background-color: transparent;
		}
		
		.captcha-popup-root {
			padding: @padding-xs * 2;
			box-sizing: border-box;
			
			.captcha-popup-title {
				padding: @padding-xs @padding-xs + 10rpx 0 @padding-xs + 10rpx;
				color: @text-primary-color;
				font-size: @font-size-lg;
				font-weight: 500;
				line-height: normal;
			}
			
			.captcha-close-box {
				position: absolute;
				top: 20rpx;
				right: 20rpx;
			}
			
			.captcha-popup-box {
				position: relative;
				width: 80vw;
				border-radius: @border-radius-base * 2;
				overflow: hidden;
				background-color: #FFFFFF;
				padding: @padding-xs;
				box-sizing: border-box;
			}
		}
	}
</style>