<template>
	<view v-if="loaded" class="withdraw-root">
		<view class="withdraw-header">
			<view class="header-box">
				<view class="name">{{ withdrawInfo.money.name }}</view>
				<view class="amount">{{ withdrawInfo.money.amount || 0 }}</view>
			</view>
		</view>
		<view class="gather-box">
			<view class="gather-header">
				<view>收款账户</view>
				<!-- <view v-if="withdrawInfo.account.is_bind" class="modify-amount">我要修改</view> -->
			</view>
			<!-- <view v-if="withdrawInfo.account.is_bind" class="account-box">
				<view>收款人：{{ withdrawInfo.account.realname }}</view>
				<view>收款方式：{{ withdrawInfo.account.bank_str }}</view>
				<view>收款账号：{{ withdrawInfo.account.card_id }}</view>
				<view v-if="withdrawInfo.account.bank">开户行：{{ withdrawInfo.account.bank }}</view>
			</view>
			<view v-else>
				<view @click="onClickSettingAccount" class="unset-box">暂未设置收款账户，请前往设置</view>
			</view> -->
			<view class="gather-item-container">
				<radio-group @change="onRadioChange">
					<label v-for="(item, index) in withdrawInfo.accountArr" :key="index" class="gather-item">
						<view class="gather-item-box">
							<image v-if="item.icon" webp="true" lazy-load="true" class="item-icon" mode="aspectFill" :src="item.icon"></image>
							<view class="item-content">
								<view class="item-title">{{ item.title }}</view>
								<view v-if="item.desc" class="item-desc">
									<view class="desc-txt">{{ item.desc }}</view>
								</view>
							</view>
						</view>
						<radio v-if="!item.disabled" style="transform: scale(0.8);" :color="themeColor" :value="item.type.toString()" :checked="radio == item.type" />
						<block v-if="item.disabled && !item.is_bind">
							<view @click.stop="onClickBindAccount(item.type)" class="modify-amount">立即绑定</view>
						</block>
					</label>
				</radio-group>
			</view>
		</view>
		<view class="withdraw-box">
			<u-form ref="withdrawForm" :model="withdraw" :error-type="['toast']" label-position="top">
				<u-form-item label="提现金额" prop="amount" :required="true">
					<u-input v-model="withdraw.amount" @input="onAmountChange" :customStyle="inputStyle" type="number" placeholder="填写提现金额"></u-input>
					<view slot="right" @click="onClickMaxAmount" class="all-amount">最大金额</view>
				</u-form-item>
				<view v-if="withdraw.amount && withdrawInfo.accountArr[fetchTypeIndex()].per > 0 && radio" class="fee-box">
					<view>手续费：{{ fee }}</view>
					<view class="real">实际到账： {{ real }}</view>
				</view>
			</u-form>
			<view class="submit-box">
				<button :style="indexConfig.btnStyle.primary" @click="submitWithdrawForm" class="submit-btn">提交</button>
			</view>
			<view v-if="withdrawInfo.tips" class="rick-box">
				<u-parse :html="withdrawInfo.tips"></u-parse>
			</view>
		</view>
		<u-popup v-model="showPassword" mode="bottom">
			<view class="password-popup-box">
				<view class="password-title">
					<view>支付密码</view>
				</view>
				<view class="input-box">
					<u-message-input :dot-fill="true" :value="withdraw.ppwd" :maxlength="6" :width="90"></u-message-input>
				</view>
				<view class="keyboard-box">
					<zx-keyboard ref="zxkeyboard" @click="onClickKeyboardItem" @delete="onClickKeyboardDelete"></zx-keyboard>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	const app = getApp()
	export default {
		data() {
			return {
				loaded: false, 
				loadingWithdraw: false, //是否正在请求接口
				withdrawInfo: '', //提现信息
				withdraw: {
					amount: '',
					ppwd: ''
				}, //提现表单
				inputStyle: {
					fontSize: '50rpx',
					'margin-top': '20rpx',
					lineHeight: '50rpx'
				}, //u-input样式
				fee: '', //手续费
				real: '', //实际到账
				showPassword: false, //是否显示密码弹窗
				paypwd: '', //支付密码
				rules: {
					amount: [{
						required: true,
						message: '填写提现金额',
						trigger: ['blur', 'change']
					}]
				},
				radio: '', //radio默认选中
			}
		},
		
		onLoad() {
			this.fetchUdCash(0, true)
		},
		
		onShow() {
			if (!this.loadingWithdraw) {
				this.fetchUdCash(0, false)
			}
		},
		
		methods: {
			/**
			 * 提交提现
			 */
			fetchUdCash(is_save, loading) {
				this.loadingWithdraw = true
				this.$util.postRequest(this.$api.ud.cash, this.fetchParameters(is_save), loading,
					res => {
						this.loadingWithdraw = false
						if (is_save == 0) {
							this.loaded = true
							this.withdrawInfo = res.data
							// if (!this.withdrawInfo.account.is_bind) {
							// 	let that = this
							// 	uni.showModal({
							// 		title: '温馨提示',
							// 		content: '未设置收款账户，请先设置',
							// 		cancelText: '暂不设置',
							// 		confirmText: '去设置',
							// 		cancelColor: '#999',
							// 		confirmColor: that.themeColor,
							// 		success(res) {
							// 			if (res.confirm) {
							// 				that.$util.miniAppRoute('/distribution/pages/cash/withdraw/account?from=2')
							// 			}
							// 		}
								
							// 	})
							// }
						} else {
							this.$util.showNoIconToast(res.info)
							let that = this
							setTimeout(() => {
								this.$util.navigateBack()
							}, 1500)
						}
					},
					err => {
						this.$util.showNoIconToast(err.info)
						this.loadingWithdraw = false
						this.loaded = true
						if (is_save == 0) {
							setTimeout(() => {
								this.$util.navigateBack()
							}, 1500)
						} else {
							this.$set(this.withdraw, 'ppwd', '')
							if (err.status == 201) {
								let that = this
								uni.showModal({
									title: '温馨提示',
									content: '未设置交易密码，请先设置',
									cancelText: '暂不设置',
									confirmText: '去设置',
									confirmColor: that.themeColor,
									success: res => {
										if (res.confirm) {
											that.$util.miniAppRoute('/mine/pages/pay-pwd/index')
										}
									}
								})
							}
						}
					})
			},

			/**
			 * 获取参数
			 */
			fetchParameters(is_save) {
				let params = {
					is_save: is_save
				}
				if (is_save != 0) {
					params.amount = this.withdraw.amount
					params.ppwd = this.withdraw.ppwd
					params.type = this.radio
				}
				return params
			},
			
			/**
			 * 修改提现账户
			 */
			onClickModifyAccount() {
				this.$util.miniAppRoute('/distribution/pages/cash/withdraw/account?from=2')
			},
			
			/**
			 * 设置提现账户
			 */
			onClickSettingAccount() {
				this.$util.miniAppRoute('/distribution/pages/cash/withdraw/account?from=2')
			},
			
			/**
			 * 设置账户
			 */
			onClickBindAccount(type) {
				this.$util.miniAppRoute('/mine/pages/withdraw-account/index?type=' + type)
			},
			
			/**
			 * 最大金额
			 */
			onClickMaxAmount() {
				if (this.withdrawInfo.max) {
					this.$set(this.withdraw, 'amount', this.withdrawInfo.max)
					this.calculateFee()
				}
			},
			
			/**
			 * 提现金额-change
			 */
			onAmountChange() {
				this.calculateFee()
			},
			
			/**
			 * 计算手续费
			 */
			calculateFee() {
				if (this.withdraw.amount && this.radio) {
					let index = this.fetchTypeIndex()
					this.fee = Math.round(this.withdraw.amount * this.withdrawInfo.accountArr[index].per * 100) / 100
					let max = this.withdrawInfo.accountArr[index].max
					let min = this.withdrawInfo.accountArr[index].min
					if (this.fee > max) {
						this.fee = max
					}
					if (this.fee < min) {
						this.fee = min
					}
					this.real = Math.round((this.withdraw.amount - this.fee) * 100) / 100
					if (this.real < 0) {
						this.real = 0
					}
				}
			},
			
			/**
			 * 提交提现
			 */
			submitWithdrawForm() {
				// this.$refs.withdrawForm.validate(valid => {
				// 	if (valid) {
						
				// 	}
				// })
				this.showPassword = true
			},
			
			/**
			 * 键盘-输入
			 */
			onClickKeyboardItem(value) {
				if (this.withdraw.ppwd.length >= 6) return
				this.$set(this.withdraw, 'ppwd', this.withdraw.ppwd + value)
				if (this.withdraw.ppwd.length == 6) {
					this.showPassword = false
					this.fetchUdCash(1, true)
				}
			},
			
			/**
			 * 键盘-删除
			 */
			onClickKeyboardDelete() {
				if (this.withdraw.ppwd.length <= 0) return
				this.$set(this.withdraw, 'ppwd', this.withdraw.ppwd.substring(0, this.withdraw.ppwd.length - 1))
			},
			
			/**
			 * 收款账户-change
			 */
			onRadioChange(event) {
				this.radio = event.detail.value
				if (this.withdrawInfo.accountArr[this.fetchTypeIndex()].per) {
					// this.$set(this.withdrawInfo, 'per', this.withdrawInfo.accountArr[this.radio].per)
					this.calculateFee()
				}
			},
			
			/**
			 * 获取索引
			 */
			fetchTypeIndex() {
				let index = 0
				for (var i = 0; i < this.withdrawInfo.accountArr.length; i++) {
					let element = this.withdrawInfo.accountArr[i]
					if (element.type == this.radio) {
						index = i
						break
					}
				}
				return index
			}
		}
	}
</script>

<style lang="less">
	page {
		.hper-100();
		background-color: @background-color;
	}
	
	.withdraw-root {
		.hper-100();
		padding: @padding-xs @padding-xs 0;
		.pbsafe();
		box-sizing: border-box;
		
		.withdraw-header {
			background-color: #FFFFFF;
			border-radius: @border-radius-base;
			overflow: hidden;
			padding: @padding-xs + 10rpx;
			border-bottom: 1px solid @border-color;
			
			.header-box {
				.flex-c-aic();
				font-weight: 500;
				
				.name {
					color: @text-primary-color;
					font-size: @font-size-lg;
				}
				
				.amount {
					color: @red-color;
					padding-left: @padding-xs + 10rpx;
					font-size: 40rpx;
				}
			}
		}
		
		.gather-box {
			background-color: #FFFFFF;
			border-radius: @border-radius-base;
			overflow: hidden;
			padding: @padding-xs + 10rpx;
			border-bottom: 1px solid @border-color;
			color: @text-primary-color;
			font-size: @font-size-lg;
			
			.gather-header {
				font-weight: 600;
				.flex-c-aic-jcb();
				
				.modify-amount {
					font-weight: 300;
					color: @text-thirdly-color;
					font-size: @font-size-sm;
				}
			}
			
			.gather-item-container {
				// margin-top: @common-blank * 2;
			}
			
			.gather-item-highlight {
				position: relative;
				
				&::after {
					position: absolute;
					top: 0;
					left: 0;
					.wper-100();
					.hper-100();
					content: '';
					border: 1px solid @primary-color;
					border-radius: @border-radius-base;
				}
			}
			
			.gather-item {
				padding: @padding-xs;
				box-sizing: border-box;
				.common-shadow();
				.flex-c-aic-jcb();
				margin-top: @common-blank * 2;
				
				.gather-item-box {
					flex: 1;
					padding-right: @padding-xs;
					box-sizing: border-box;
					.flex-c-aic();
					line-height: 1;
					
					.item-icon {
						width: 80rpx;
						height: 80rpx;
						vertical-align: middle;
						border-radius: @border-radius-base;
						overflow: hidden;
						margin-right: @common-blank * 2;
					}
					
					.item-content {
						// padding-left: @padding-xs;
						flex: 1;
						overflow: hidden;
						box-sizing: border-box;
						
						.item-title {
							color: @text-primary-color;
							font-size: @font-size-base;
							.line-1();
							font-weight: 700;
						}
						
						.item-desc {
							color: @text-thirdly-color;
							font-size: @font-size-sm;
							padding-top: @padding-xs;
							
							.desc-txt {
								.line-1();
							}
						}
					}
				}
				
				.modify-amount {
					font-weight: 300;
					color: @primary-color;
					font-size: @font-size-sm;
				}
			}
			
			.account-box {
				font-size: @font-size-base;
				
				>view {
					padding-top: @padding-xs;
				}
			}
			
			.unset-box {
				padding-top: @padding-xs;
				color: @red-color;
				font-size: @font-size-base;
				font-weight: 500;
			}
		}
	
		.withdraw-box {
			background-color: #FFFFFF;
			padding: 0 @padding-xs + 10rpx;
			box-sizing: border-box;
			
			.all-amount {
				color: @red-color;
				font-size: @font-size-base;
			}
			
			.fee-box {
				color: @red-color;
				padding-top: @padding-xs / 2;
				font-size: @font-size-xxs;
				.flex-c-aic();
				
				.real {
					padding-left: @padding-xs / 2;
				}
			}
			
			.submit-box {
				padding: @padding-xs * 2 0;
				
				.submit-btn {
					background-color: @primary-color;
					margin: 0;
					padding: 0;
					.wper-100();
					color: #FFFFFF;
					font-weight: normal;
					font-size: @font-size-base;
					
					&::after {
						border: none;
					}
				}
			}
			
			.rick-box {
				padding-bottom: @padding-xs * 2;
				color: @text-thirdly-color;
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
	}
</style>
