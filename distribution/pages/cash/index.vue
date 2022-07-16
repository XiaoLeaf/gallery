<template>
	<view v-if="loaded" class="cash-root">
		<view class="mescroll-box">
			<mescroll-uni :fixed="false" :safearea="true" @init="mescrollInit" @down="downCallback" @up="upCallback">
				<view class="cash-box">
					<view class="cash-card-root" :style="dataBgStyle">
						<view class="cash-card-title">{{ money.name }}</view>
						<view class="cash-card-content">
							<view class="content-left">
								<u-count-to color="#fff" font-size="80" :bold="true" :end-val="money.amount" :duration="1000" separator="," :decimals="2"></u-count-to>
							</view>
							<view @click="onClickWithdraw" class="content-right">
								<view>提现</view>
								<u-icon name="arrow-right" size="24" color="#ffffff"></u-icon>
							</view>
						</view>
						<view class="cash-card-footer">
							<view class="footer-item">
								<view class="footer-item-title">{{ cashIng.name }}</view>
								<view class="footer-item-value">{{ cashIng.amount }}</view>
							</view>
							<view class="footer-item">
								<view class="footer-item-title">{{ cashEd.name }}</view>
								<view class="footer-item-value">{{ cashEd.amount }}</view>
							</view>
						</view>
					</view>
					<view class="cash-list-box">
						<view class="cash-list-header">
							<view>提现记录</view>
						</view>
						<zx-empty v-if="cashList.length <= 0" type="general"></zx-empty>
						<block v-else>
							<view v-for="(item, index) in cashList" :key="index" class="cash-item">
								<view class="item-content">
									<view class="status-str">{{ item.status_str }}</view>
									<view class="amount">+{{ item.amount }}</view>
								</view>
								<view class="item-content">
									<view class="account">{{ item.account }}</view>
									<view v-if="item.fee > 0" class="fee">手续费 {{ item.fee }}</view>
								</view>
								<view class="c-time-box">
									<view class="c-time">{{ item.c_time }}</view>
									<u-tag v-if="item.status == 3" @click="onClickRecall(item)" size="mini" text="撤销" bg-color="#f00" mode="dark"></u-tag>
								</view>
								<view v-if="item.gm_memo" class="gm-memo">{{ item.gm_memo }}</view>
							</view>
							<zx-none v-if="hasNext && loaded && cashList.length > 0"></zx-none>
						</block>
					</view>
				</view>
			</mescroll-uni>
		</view>
	</view>
</template>

<script>
	const app = getApp()
	export default {
		data() {
			return {
				loaded: false,
				loadingCash: false, //是否正在请求接口
				mescroll: '',
				hasNext: false, //是否有下一页数据
				page: 1, //页码
				cashList: '', //转出记录列表
				money: '', //账户分润信息
				cashIng: '', //提现中信息
				cashEd: '', //累计提现信息
				colors: '', //顶部背景色数组
				dataBgStyle: '', //顶部样式
			}
		},

		onLoad() {
			this.fetchCashList(true)
		},

		onShow() {
			if (!this.loadingCash) {
				this.page = 1
				this.fetchCashList(false)
			}
		},

		methods: {
			/**
			 * 提现
			 */
			onClickWithdraw() {
				this.$util.miniAppRoute('/distribution/pages/cash/withdraw/index')
			},

			/**
			 * mescroll初始化
			 */
			mescrollInit(mescroll) {
				this.mescroll = mescroll
				if (this.mescroll) {
					this.mescroll.endSuccess(this.cashList.length, this.hasNext)
					if (!this.hasNext) {
						this.mescroll.hideUpScroll()
					}
				}
			},

			/**
			 * 下拉刷新
			 */
			downCallback() {
				this.page = 1
				this.fetchCashList(false)
			},

			/**
			 * 上拉加载
			 */
			upCallback() {
				if (this.hasNext) {
					this.page++
					this.fetchCashList(false)
				}
			},

			/**
			 * 获取分销列表
			 */
			fetchCashList(loading) {
				this.loadingCash = true
				this.$util.postRequest(this.$api.ud.cash_list, this.fetchParameters(), loading,
					res => {
						this.cashList = this.page == 1 ? res.data.list : this.cashList.concat(res.data.list)
						this.hasNext = Boolean(res.data.hasNext)
						this.money = res.data.money
						this.cashIng = res.data.cash_ing
						this.cashEd = res.data.cash_ed
						this.colors = res.data.bgColor
						this.dataBgStyle = res.data.dataBgStyle
						if (this.mescroll) {
							this.mescroll.endSuccess(res.data.list.length, this.hasNext)
							if (!this.hasNext) {
								this.mescroll.hideUpScroll()
							}
						}
						this.loaded = true
						this.loadingCash = false
					},
					err => {
						this.loadingCash = false
						if (this.mescroll) {
							this.mescroll.endErr()
						}
						if (this.page != 1) {
							this.page--
						}
						this.$util.showNoIconToast(err.info)
					})
			},

			/**
			 * 参数
			 */
			fetchParameters() {
				let params = {
					page: this.page
				}
				return params
			},

			/**
			 * 撤销提现申请
			 */
			onClickRecall(item) {
				// console.log('item====>',JSON.stringify(item))
				let that = this
				uni.showModal({
					title: '温馨提示',
					content: '确认撤销当前提现？',
					confirmColor: that.themeColor,
					cancelColor: '#999999',
					success: res => {
						if (res.confirm) {
							that.fetchCashCancel(item.id)
						}
					}
				})
			},

			/**
			 * 请求撤销申请
			 */
			fetchCashCancel(id) {
				let params = {
					id: id
				}
				this.$util.postRequest(this.$api.ud.cash_cancel, params, true,
					res => {
						this.$util.showNoIconToast(res.info)
						setTimeout(() => {
							this.page = 1
							this.fetchCashList(false)
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

	.cash-root {
		.hper-100();
		.flex-col();
		
		.cash-box {
			padding: 0 @padding-xs;
			box-sizing: border-box;
			.pbsafe();
			
			.cash-header {
				background-color: #FFFFFF;
				border-radius: @border-radius-base;
				overflow: hidden;
				padding: @padding-xs;
				box-sizing: border-box;
				border-bottom: 1px solid @border-color;
				.flex-c-aic-jcb();
			
				.header-content {
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
			
				.withdraw-btn {
					width: auto;
					margin: 0;
					padding: 0 @padding-xs;
					line-height: 40rpx;
					font-size: @font-size-sm;
					background-color: @primary-color;
					color: #FFFFFF;
					.flex-c-aic-jcc();
			
					&::after {
						border: none;
					}
				}
			}
			
			.cash-card-root {
				margin-top: @common-blank * 2;
				padding: @padding-xs * 2;
				box-sizing: border-box;
				.common-shadow();
				border-radius: @border-radius-base * 2;
				color: #FFFFFF;
			
				.cash-card-title {
					font-size: @font-size-lg;
					font-weight: 500;
				}
			
				.cash-card-content {
					padding: @padding-xs 0;
					.flex-c-aic();
			
					.content-left {
						flex: 1;
						overflow: hidden;
						padding-right: @padding-xs;
						box-sizing: border-box;
					}
			
					.content-right {
						.flex-c-aic();
						font-size: @font-size-base;
						line-height: 1;
			
						.right-txt {}
					}
				}
			
				.cash-card-footer {
					.flex-c-aic-jcb();
			
					.footer-item {
						font-size: @font-size-sm;
						.flex-c-aic();
						line-height: 1;
						
						.footer-item-title {
							
						}
						
						.footer-item-value {
							.num-ff();
						}
					}
				}
			}
			
			.cash-list-box {
				margin-top: @common-blank * 2;
				
				.cash-list-header {
					padding: @padding-xs 0;
					font-size: @font-size-xl;
					font-weight: 700;
					color: @text-primary-color;
				}
			}
			
			.cash-item {
				// border-bottom: 1px solid @border-color;
				background-color: #FFFFFF;
				padding: @padding-xs;
				box-sizing: border-box;
				font-size: @font-size-sm;
				margin-bottom: @common-blank * 2;
				.common-shadow();
				border-radius: @border-radius-base;
				
				.item-content {
					.flex-c-aic-jcb();
					color: @text-primary-color;
					padding-bottom: @padding-xs / 2;
			
					.status-str {
						
					}
					
					.account {
						color: @text-secondary-color;
					}
					
					.amount {
						color: @red-color;
						.num-ff();
						font-size: @font-size-xl;
					}
					
					.fee {
						color: @text-thirdly-color;
					}
				}
			
				.cash-content {
					.flex-c-aic-jcb();
			
					.content-left {
						.flex-col();
						color: @text-primary-color;
					}
			
					.content-right {
						.flex-col-aie();
						color: @text-primary-color;
			
						.amount {
							padding-bottom: @padding-xs / 2;
							color: @red-color;
							.num-ff();
							font-size: @font-size-xl;
						}
			
						.fee {
							color: @text-thirdly-color;
						}
					}
				}
			
				.c-time-box {
					.flex-c-aic-jcb();
			
					.c-time {
						color: @text-thirdly-color;
					}
				}
			
				.gm-memo {
					color: @red-color;
					padding-top: @padding-xs / 2;
				}
			}
		}
	}
</style>
