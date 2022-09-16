<template>
	<view class="login-form-box captcha-root">
		<view class="login-form-item">
			<view class="login-form-item-box">
				<view class="form-item-content">
					<view class="input-box">
						<u-field v-model="captcha" :label-width="0" :border-bottom="false" :placeholder-style="placeholderStyle" :field-style="fieldStyle" :placeholder="$t('placeholder.vcode')"></u-field>
					</view>
					<image @click="$u.debounce(onClickRefreshCaptcha, 400, true)" webp="true" lazy-load="true" class="content-img" mode="widthFix" :src="captchaImg"></image>
				</view>
			</view>
			<view class="form-btn-box catptcha-btn-box">
				<button @click="onClickSubmit" :loading="loading" hover-class="none" class="form-btn">{{ loading ? '' : $t('common.submit') }}</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"zx-captcha",
		
		props: {
			loading: {
				type: Boolean,
				default: false
			}
		},
		
		data() {
			return {
				captcha: '',
				captchaImg: '',
				placeholderStyle: "color:#b6b6b6;fontSize:26rpx;",
				fieldStyle: {
					color: '#313131',
					fontSize: '32rpx'
				},
			}
		},
		
		beforeMount() {
			this.refreshCaptcha()
		},
		
		methods: {
			onClickRefreshCaptcha() {
				
			},
			
			refreshCaptcha() {
				this.captcha = ''
				this.captchaImg = this.indexConfig.captcha_url + '?imei=' + uni.getStorageSync(this.$api.unionUser) + '&time=' + Date.now()
			},
			
			onClickRefreshCaptcha() {
				this.refreshCaptcha()
			},
			
			onClickSubmit() {
				if (!this.captcha) {
					this.$util.showNoIconToast(this.$t('common.fillin.captcha'))
					return
				}
				this.$emit('click', {captcha: this.captcha})
			}
		}
	}
</script>

<style lang="less">
	.captcha-root {
		padding: 0!important;
	
		/deep/ .u-flex {
			.flex-c-aic()!important;
		}
		
		/deep/ .u-flex-1 {
			flex: 1!important;
		}
		
		.login-form-item {
			box-shadow: none;
			// padding: @padding-xs + 10rpx;
			margin-bottom: 0;
			
			/deep/ .u-field {
				padding: 0 20rpx!important;
				box-sizing: border-box;
				background-color: @background-color;
				border-radius: 12rpx;
				overflow: hidden;
				
				.u-field__input-wrap {
					height: 60rpx!important;
				}
			}
		}
		
		.catptcha-btn-box {
			margin-top: @common-blank * 4;
			
			.form-btn {
				line-height: 72rpx;
				font-size: @font-size-base;
			}
		}
	}
</style>