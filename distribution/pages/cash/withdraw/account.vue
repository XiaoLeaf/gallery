<template>
	<view v-if="loaded" class="account-root">
		<view class="account-form">
			<u-form ref="withdrawForm" :model="withdraw" :error-type="['toast']" label-position="top">
				<view class="gap-box"></view>
				<u-form-item label="姓名" prop="realname" :required="true">
					<u-input v-model="withdraw.realname" placeholder="填写姓名"></u-input>
				</u-form-item>
				<u-form-item label="身份证" prop="sid" :border-bottom="false" :required="true">
					<u-input v-model="withdraw.sid" placeholder="填写身份证号码"></u-input>
				</u-form-item>
				<view class="gap-box"></view>
				<u-form-item label="收款方式" prop="bank_name" :required="true">
					<u-input v-model="withdraw.bank_name" placeholder="选择银行/支付宝" @click="showPicker = true" type="select"></u-input>
					<u-picker v-model="showPicker" mode="selector" :default-selector="defRang" :range="bankList" range-key="name" @confirm="selectBankConfirm" @cancel="selectBankCancel"></u-picker>
				</u-form-item>
				<u-form-item label="卡号/账号" prop="card_id" :required="true">
					<u-input v-model="withdraw.card_id" placeholder="填写卡号/账号"></u-input>
				</u-form-item>
				<u-form-item label="开户行" :border-bottom="false" prop="bank">
					<u-input v-model="withdraw.bank" placeholder="填写开户行(非必填)"></u-input>
				</u-form-item>
				<view class="gap-box"></view>
				<u-form-item label="验证码" prop="code" :required="true">
					<u-input v-model="withdraw.code" type="number" maxlength="4" :placeholder="'将发送至' + phoneStr"></u-input>
					<button slot="right" :style="indexConfig.btnStyle.secondary" :disabled="disabled" @click="onClickCodeBtn" class="code-btn">{{ codeBtnStr }}</button>
				</u-form-item>
			</u-form>
			<view class="btn-box">
				<button @click="submitWithdrawForm" :style="indexConfig.btnStyle.primary" class="save-btn">保存</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loaded: false,
				from: 1, //页面来源 1：设置页面进入（默认） 2： 提现页面进入
				showPicker: false, //是否显示picker
				codeBtnStr: '获取验证码', //验证码按钮文本
				disabled: false, //是否禁用验证码按钮
				phoneStr: '', //手机号码
				bankList: [], //收款方式列表
				defRang: [], //收款方式默认选中
				withdraw: {
					realname: '',
					sid: '',
					bank_type: '',
					bank_name: '',
					card_id: '',
					bank: '',
					code: ''
				},
				rules: {
					realname: [{
						required: true,
						message: '填写姓名',
						trigger: ['blur', 'change']
					}],
					sid: [{
						required: true,
						message: '填写身份证',
						trigger: ['blur', 'change']
					}],
					bank_type: [{
						required: true,
						message: '选择银行/支付宝',
						trigger: ['blur', 'change']
					}],
					card_id: [{
						required: true,
						message: '填写卡号/账号',
						trigger: ['blur', 'change']
					}],
					code: [{
						required: true,
						message: '填写验证码',
						trigger: ['blur', 'change']
					}],
					timer: '', //计时器
				}
			}
		},
		
		onLoad(options) {
			let userInfo = this.$util.getLocalUserInfo()
			this.from = options.from ? options.from : 1
			this.phoneStr = userInfo.tel_str
			this.fetchWithdrawInfo(true)
		},
		
		methods: {
			/**
			 * 获取提现账户信息
			 */
			fetchWithdrawInfo(loading) {
				this.$util.postRequest(this.$api.user.account, {
						is_save: 0
					}, loading,
					res => {
						// console.log('res=====>',JSON.stringify(res))
						this.defRang = [0]
						this.bankList = res.data.bankArr
						let user = res.data.user
						this.$set(this.withdraw, 'realname', user.realname)
						this.$set(this.withdraw, 'sid', user.sid)
						this.$set(this.withdraw, 'bank_type', user.bank_type)
						this.$set(this.withdraw, 'bank_name', this.fetchBankNameWithId(user.bank_type))
						this.$set(this.withdraw, 'card_id', user.card_id)
						this.$set(this.withdraw, 'bank', user.bank)
						this.$set(this.withdraw, 'code', '')
						this.loaded = true
						setTimeout(() => {
							this.$refs.withdrawForm.setRules(this.rules)
						}, 200)
					},
					err => {
						this.$util.showNoIconToast(err.info)
						setTimeout(() => {
							this.$util.navigateBack()
						}, 1500)
					})
			},
			
			/**
			 * 根据id获取银行名称
			 */
			fetchBankNameWithId(id) {
				let name = ''
				for (var i = 0; i < this.bankList.length; i++) {
					let element = this.bankList[i]
					if (element.id == id) {
						this.defRang.splice(0, 1, i)
						name = element.name
						break
					}
				}
				return name
			},
			
			/**
			 * 收款方式确认
			 */
			selectBankConfirm(event) {
				let index = event[0]
				this.$set(this.withdraw, 'bank_type', this.bankList[index].id.toString())
				this.$set(this.withdraw, 'bank_name', this.bankList[index].name)
			},
			
			/**
			 * 收款方式取消
			 */
			selectBankCancel() {
				this.showPicker = false
			},
			
			/**
			 * 获取验证码
			 */
			onClickCodeBtn() {
				let params = {
					type: this.$api.CODE_TYPE.VALIDATE_CODE
				}
				this.$util.postRequest(this.$api.auth.code, params, true,
					res => {
						this.countDown()
						this.$util.showNoIconToast(res.info)
					},
					err => {
						this.disabled = false
						clearInterval(this.timer)
						this.codeBtnStr = '获取验证码'
						this.$util.showNoIconToast(err.info)
					})
			},

			/**
			 * 倒计时
			 */
			countDown() {
				let num = 60
				this.codeBtnStr = num + ' s'
				this.timer = setInterval(() => {
					num--
					if (num <= 0) {
						this.codeBtnStr = '获取验证码'
						this.disabled = false
						clearInterval(this.timer)
					} else {
						this.codeBtnStr = num + ' s'
						this.disabled = true
					}
				}, 1000)
			},
			
			/**
			 * 保存
			 */
			submitWithdrawForm() {
				// this.$refs.withdrawForm.validate(valid => {
				// 	if (valid) {
						
				// 	}
				// })
				let params = {
					is_save: 1,
					realname: encodeURIComponent(this.withdraw.realname),
					sid: this.withdraw.sid,
					bank_type: this.withdraw.bank_type,
					card_id: encodeURIComponent(this.withdraw.card_id),
					bank: encodeURIComponent(this.withdraw.bank),
					code: this.withdraw.code
				}
				this.$util.postRequest(this.$api.user.account, params, true,
					res => {
						this.$util.showNoIconToast(res.info)
						if (this.from == 1) {
							this.fetchWithdrawInfo(false)
						} else {
							setTimeout(() => {
								uni.navigateBack({
									delta: 1
								})
							}, 1500)
						}
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
	
	.account-root {
		.hper-100();
		.pbsafe();
		padding: 0 @padding-xs / 2;
		box-sizing: border-box;
		
		.account-form {
			padding: 0 @padding-xs * 2;
			box-sizing: border-box;
			background-color: #FFFFFF;
			
			.gap-box {
				background-color: @background-color;
				height: @padding-xs / 2;
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
				margin-bottom: @common-blank;
				
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
</style>
