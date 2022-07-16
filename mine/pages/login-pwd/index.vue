<template>
	<view class="paypwd-root">
		<view class="paypwd-box">
			<view class="account-form">
				<u-form ref="withdrawForm" :model="modify" :error-type="['toast']" label-position="top">
					<u-form-item :label="$t('form.password')" prop="ppwd" :required="true">
						<u-input v-model="modify.ppwd" type="password" :placeholder="$t('form.password')"></u-input>
					</u-form-item>
					<u-form-item :label="$t('form.captcha')" prop="code" :required="true">
						<u-input v-model="modify.code" type="number" maxlength="6" :placeholder="$t('common.send.to') + userInfo.country_tel"></u-input>
						<button slot="right" :disabled="disabled" :style="indexConfig ? indexConfig.btnStyle.secondary : ''" @click="onClickCodeBtn" class="code-btn">{{ codeBtnStr }}</button>
					</u-form-item>
				</u-form>
				<view class="btn-box">
					<button @click="submitWithdrawForm" :style="indexConfig ? indexConfig.btnStyle.primary : ''" class="save-btn">{{ $t('common.save') }}</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	const app = getApp()
	export default {
		data() {
			return {
				timer: '',
				codeBtnStr: '',
				disabled: false,
				userInfo: '',
				modify: {
					code: '',
					ppwd: '',
				}
			}
		},
		
		onLoad() {
			this.codeBtnStr = this.$t('common.validate.code')
			this.userInfo = uni.getStorageSync(this.$api.userInfo)
		},
		
		methods: {
			onClickCodeBtn() {
				this.fetchValidateCode()
			},
			
			fetchValidateCode() {
				let params = {
					type: this.$api.CODE_TYPE.MODIFY_PAY_PASSWORD
				}
				this.$util.postRequest(this.$api.auth.code, params, true,
					res => {
						this.countDown()
						this.$util.showNoIconToast(res.info)
					},
					err => {
						clearInterval(this.timer)
						this.codeBtnStr = this.$t('common.validate.code')
						this.disabled = false
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
						this.disabled = false
						clearInterval(this.timer)
					} else {
						this.codeBtnStr = num + ' s'
						this.disabled = true
					}
				}, 1000)
			},
			
			submitWithdrawForm() {
				let params = {
					code: this.modify.code,
					val: this.modify.ppwd
				}
				this.$util.postRequest(this.$api.user.modify_login_pwd, params, true,
					res => {
						this.$util.showNoIconToast(res.info)
						setTimeout(() => {
							uni.navigateBack({
								delta: 1
							})
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
		background-color: @background-color;
	}
	
	.paypwd-root {
		.hper-100();
		padding: @padding-xs / 2 @padding-xs / 2 0;
		box-sizing: border-box;
		
		.paypwd-box {
			
			.account-form {
				padding: 0 @padding-xs * 2;
				box-sizing: border-box;
				background-color: #FFFFFF;
				
				.gap-box {
					background-color: @background-color;
					height: 20rpx;
					margin-left: -40rpx;
					width: calc(100% + 80rpx);
				}
				
				.code-btn {
					padding: 0 @padding-xs;
					.flex-c-aic-jcc();
					margin: 0;
					background-color: @primary-color;
					line-height: 50rpx;
					color: #FFFFFF;
					width: auto;
					font-size: @font-size-sm;
					font-weight: normal;
					
					&::after {
						border: none;
					}
				}
				
				.btn-box {
					padding: @padding-xs * 2 0;
					
					.save-btn {
						background-color: @primary-color;
						.wper-100();
						padding: 0;
						margin: 0;
						font-size: @font-size-base;
						font-weight: normal;
						color: #FFFFFF;
						line-height: 80rpx;
						
						&::after {
							border: none;
						}
					}
				}
			}
		}
	}
</style>
