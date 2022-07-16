<template>
	<view v-if="loaded" class="gp-root">
		<zx-navbar>
			<view slot="left" :style="{ 'width': capsule ? capsule.width + 20 + 'px' : '110px' }" class="navbar-left">
				<u-icon @click="onClickBack" custom-prefix="zx-icon" name="nav-back" size="44" color="#000"></u-icon>
			</view>
			<view slot="title" class="navbar-title">
				<view class="title-str">{{ moneyInfo.title }}</view>
			</view>
			<view slot="right" class="navbar-right" :style="{ 'width': capsule ? capsule.width + 20 + 'px' : '110px' }">

			</view>
		</zx-navbar>
		<view class="gp-content-box"
			:style="{'padding-top': capsule ? capsule.top + 40 + 'px' : (statusH + 44) + 'px'}">
			<view class="earning-center-header">
				<view class="earning-header-box" :style="moneyInfo.dataBgStyle">
					<view class="box-title-box">
						<view>{{ moneyInfo.money.name }}</view>
						<view class="eye-box">
							<u-icon @click="onClickEye" custom-prefix="zx-icon" color="#fff" size="40" :name="showBalance ? 'eye-on' : 'eye-off'"></u-icon>
						</view>
					</view>
					<view class="box-header">
						<view class="balance-box">
							<u-count-to v-if="showBalance" :decimals="moneyInfo.money.decimals" :end-val="moneyInfo.money.amount" :duration="1000" color="#fff" separator="," font-size="40" :bold="true"></u-count-to>
							<view class="balance-secret" v-else>****</view>
						</view>
						<view class="header-btn-box">
							<view v-if="moneyInfo.ebtn" class="btn-item">
								<button @click="onClickTransfer" class="withdraw-btn" :style="moneyInfo.ebtn.style">{{ moneyInfo.ebtn.txt }}</button>
							</view>
							<view v-if="moneyInfo.btn" class="btn-item">
								<button @click="onClickWithdraw" class="withdraw-btn" :style="moneyInfo.btn.style">{{ moneyInfo.btn.txt }}</button>
							</view>
						</view>
					</view>
					<view v-if="moneyInfo.statArr" class="box-footer">
						<view @click="onClickMoneyResItem(item)" v-for="(item, index) in moneyInfo.statArr" :key="index" class="wealth-item" :style="{'width': (100 / 3) + '%'}">
							<view class="title">{{ item.name }}</view>
							<u-count-to v-if="showBalance" separator="," font-size="28" :duration="1000" color="#fff" :end-val="item.amount" :decimals="item.decimals"></u-count-to>
							<view v-else class="item-secret">****</view>
						</view>
					</view>
				</view>
			</view>
			<view class="gp-home-title-box">
				<view>{{ moneyInfo.listTitle }}</view>
				<view @click="onClickFilter" class="title-box-right">
					<view>{{ typeTitle }}</view>
					<u-icon name="arrow-right" size="24" color="#666"></u-icon>
				</view>
			</view>
			<view class="mescroll-box">
				<mescroll-uni :fixed="false" :safearea="true" @init="mescrollInit" @down="downCallback" @up="upCallback">
					<view class="chain-gp-list-box">
						<block v-if="moneyList.length > 0">
							<view v-for="(item, index) in moneyList" :key="index" class="chain-gp-item">
								<view class="item-box">
									<view class="item-left">
										<view class="title">{{ item.title }}</view>
										<view class="c-time">{{ item.c_time }}</view>
									</view>
									<view class="item-right">
										<view class="amount">{{ item.amount }}</view>
										<view class="remain">{{ $t('my.wallet.remain') }} {{ item.remain }}</view>
									</view>
								</view>
								<view v-if="item.memo" class="memo">{{ item.memo }}</view>
							</view>
						</block>
						<block v-else>
							<zx-empty></zx-empty>
						</block>
					</view>
				</mescroll-uni>
			</view>
		</view>
		<u-select v-model="showFilter" :list="moneyInfo.typeArr" :confirm-text="$t('common.confirm')" :cancel-text="$t('common.cancel')" :confirm-color="themeColor" :default-value="defValue" value-name="key" label-name="val" @confirm="onTypeFilterConfirm"></u-select>
	</view>
</template>

<script>
	const app = getApp()
	export default {
		data() {
			return {
				loaded: false,
				loadingMoney: false,
				showBalance: true,
				refeshing: false,
				moneyInfo: '',
				moneyList: '',
				mescroll: '',
				page: 1,
				hasNext: false,
				showFilter: false,
				typeTitle: '',
				type: 0,
				defValue: [0],
			}
		},

		onLoad() {
			this.typeTitle = this.$t('common.all')
			this.fetchUdmoneyList(true)
		},
		
		onShow() {
			if (!this.loadingMoney) {
				this.fetchUdmoneyList(false)
			}
		},

		methods: {
			onClickBack() {
				this.$util.navigateBack()
			},
			
			onClickRefresh() {
				this.refeshing = true
			},
			
			onClickEye() {
				this.showBalance = !this.showBalance
			},
			
			onClickTransfer() {
				if (this.moneyInfo.ebtn.url) {
					this.$util.miniAppRoute(this.moneyInfo.ebtn.url)
				}
			},
			
			onClickWithdraw() {
				if (this.moneyInfo.btn.url) {
					this.$util.miniAppRoute(this.moneyInfo.btn.url)
				}
			},
			
			onClickMoneyResItem(item) {
				if (item.url) {
					this.$util.miniAppRoute(item.url)
				}
			},
			
			onClickFilter() {
				this.showFilter = !this.showFilter
			},
			
			mescrollInit(mescroll) {
				this.mescroll = mescroll
				this.mescroll.endSuccess(this.moneyList.length, this.hasNext)
				if (!this.hasNext) {
					this.mescroll.hideUpScroll()
				}
			},
			
			downCallback() {
				this.page = 1
				this.fetchUdmoneyList(false)
			},
			
			upCallback() {
				if (this.hasNext) {
					this.page++
					this.fetchUdmoneyList(false)
				}
			},
			
			fetchUdmoneyList(loading) {
				this.loadingMoney = true
				this.$util.postRequest(this.$api.ud.money_list, this.fetchParameters(), loading,
					res => {
						if (this.page == 1) {
							this.moneyInfo = res.data
							let that = this
							uni.setNavigationBarTitle({
								title: that.moneyInfo.title
							})
						}
						this.moneyList = this.page == 1 ? res.data.list : this.moneyList.concat(res.data.list)
						this.hasNext = Boolean(res.data.hasNext)
						if (this.mescroll) {
							this.mescroll.endSuccess(res.data.list.length, this.hasNext)
							if (!this.hasNext) {
								this.mescroll.hideUpScroll()
							}
						}
						this.loaded = true
						this.loadingMoney = false
					},
					err => {
						this.loadingMoney = false
						if (this.mescroll) {
							this.mescroll.endErr()
						}
						this.$util.showNoIconToast(err.info)
						if (this.page == 1) {
							setTimeout(() => {
								uni.navigateBack({
									delta: 1
								})
							}, 1500)
						} else {
							this.page--
						}
					})
			},
			
			fetchParameters() {
				let params = {
					page: this.page,
					type: this.type
				}
				return params
			},
			
			onTypeFilterConfirm(event) {
				let res = event[0]
				this.typeTitle = res.label
				this.type = res.value
				this.updateDefValue()
				this.page = 1
				this.fetchUdmoneyList(true)
			},
			
			updateDefValue() {
				let index = 0
				for (var i = 0; i < this.moneyInfo.typeArr.length; i++) {
					let element = this.moneyInfo.typeArr[i]
					if (element.key == this.type) {
						index = i
						break
					}
				}
				this.defValue = [index]
			},
		}
	}
</script>

<style lang="less">
	page {
		.hper-100();
		background-color: @background-color;
	}

	.gp-root {
		.hper-100();

		.navbar-left {
			.hper-100();
			padding-left: @padding-xs;
			.flex-c-aic();
			box-sizing: border-box;
			line-height: 1;
			line-height: normal;

			.refresh-box {
				padding-left: @padding-xs / 2;
				box-sizing: border-box;

				.refresh-icon {
					animation: turn 500ms linear infinite;
				}

				@keyframes turn {
					0% {
						-webkit-transform: rotate(0deg);
					}

					25% {
						-webkit-transform: rotate(90deg);
					}

					50% {
						-webkit-transform: rotate(180deg);
					}

					75% {
						-webkit-transform: rotate(270deg);
					}

					100% {
						-webkit-transform: rotate(360deg);
					}
				}
			}
		}

		.navbar-title {
			.hper-100();
			overflow: hidden;
			.wper-100();
			.flex-c-jcc();

			.title-str {
				overflow: hidden;
				font-size: @font-size-xxl;
				font-weight: 500;
				.line-1();
				padding-right: 6rpx;
				box-sizing: border-box;
				color: @text-primary-color;

			}
		}

		.navbar-right {
			.wper-100();
			.hper-100();
		}

		.gp-content-box {
			.hper-100();
			.flex-col();

			.earning-center-header {
				padding: @padding-xs;
				box-sizing: border-box;

				.earning-header-box {
					border-radius: @border-radius-base * 2;
					overflow: hidden;
					padding: @padding-xs * 2;
					box-sizing: border-box;
					color: rgba(255, 255, 255, .8);

					.box-title-box {
						font-size: @font-size-xxs;
						.flex-c-aic();

						.eye-box {
							padding-left: @padding-xs;
						}
					}

					.box-header {
						.flex-c-aic-jcb();
						padding: @padding-xs / 2 0;

						.balance-box {
							.flex-c-aic();

							.balance-secret {
								line-height: 56rpx;
								font-size: 50rpx;
								color: #FFFFFF;
							}

							.u-count-num {
								line-height: 56rpx !important;
							}
						}
						
						.header-btn-box {
							.flex-c-aic();
							
							.btn-item {
								
								&:not(:last-child) {
									margin-right: @common-blank * 2;
								}
							}
						}

						.withdraw-btn {
							background-color: #FFFFFF;
							border-radius: 80rpx;
							font-size: @font-size-xxs;
							color: @primary-color;
							margin: 0;
							padding: 0 @padding-xs * 2;
							line-height: 50rpx;

							&::after {
								border: none;
							}
						}
					}

					.box-footer {
						.flex-c-aic-jca();
						flex-wrap: wrap;
						font-size: @font-size-sm;

						.wealth-item {
							.flex-col-aic-jcc();
							font-size: @font-size-xxs;
							position: relative;
							padding: @padding-xs 0 0;
							box-sizing: border-box;

							// &:not(:last-child)::after {
							// 	position: absolute;
							// 	content: '';
							// 	.wper-100();
							// 	height: 50%;
							// 	top: 25%;
							// 	left: 0;
							// 	border-right: 1px solid rgba(255, 255, 255, .3);
							// }

							// &:nth-child(3n)::after {
							// 	position: absolute;
							// 	content: '';
							// 	width: calc(100% - 40rpx);
							// 	.hper-100();
							// 	top: 0;
							// 	right: 40rpx;
							// 	border-right: none !important;
							// }

							.value {
								font-size: @font-size-base;
								font-weight: 500;
								color: #FFFFFF;
							}

							.title {
								padding-bottom: @padding-xs / 4;
								font-size: @font-size-xxs;
							}

							.u-count-num {
								line-height: 34rpx !important;
							}

							.item-secret {
								line-height: 34rpx;
							}
						}
					}
				}
			}

			.gp-home-title-box {
				padding: @padding-xs / 2 @padding-xs @padding-xs + 10rpx @padding-xs;
				box-sizing: border-box;
				font-size: @font-size-xl;
				font-weight: 700;
				color: @text-primary-color;
				.flex-c-aic-jcb();

				.title-box-right {
					.flex-c-aic();
					padding-left: @padding-xs;
					box-sizing: border-box;
					font-weight: normal;
					font-size: @font-size-base;
					color: @text-secondary-color;
					line-height: 1;

					.right-txt {
						padding-right: 6rpx;
					}
				}
			}
		}
	}
</style>
