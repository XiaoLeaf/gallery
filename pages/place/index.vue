<template>
	<view class="common-page-root">
		<block v-if="loaded">
			<zx-navbar :background="themeColor">
				<view slot="title" class="navbar-middle">
					<view class="middle-title-white">分销中心</view>
				</view>
			</zx-navbar>
			<view class="common-page-box" :style="{'padding-top': (statusH + 44) + 'px'}">
				<view class="mescroll-box">
					<mescroll-uni :fixed="false" :safearea="true" :up="up" @init="mescrollInit" @down="downCallback">
						<view class="place-mescroll-root">
							<view class="place-mescroll-box">
								<view class="place-header">
									<view class="header-box">
										<image webp="true" lazy-load="true" class="header-avatar" mode="aspectFill" src=""></image>
										<view class="header-content">
											<view class="nickname">18850528169</view>
											<view class="ref-box">推荐人：18850528169</view>
										</view>
									</view>
									<view class="invite-box">
										<view class="invite-txt">我的邀请码：QDE</view>
										<u-icon custom-prefix="zx-icon" name="copy" :color="themeColor" size="32"></u-icon>
									</view>
								</view>
								<view class="commission-root">
									<view class="commission-header">
										<view class="header-left">
											<u-icon custom-prefix="zx-icon" name="wallet" :color="themeColor" size="40"></u-icon>
											<view class="left-title">我的佣金</view>
										</view>
										<view @click="onClickWithdraw" class="header-right">
											<view class="right-txt">佣金提现</view>
											<u-icon name="arrow-right" size="24" color="#999"></u-icon>
										</view>
									</view>
									<view class="commission-box">
										<view class="box-footer">
											<view @click="onClickMoneyResItem(item)" v-for="(item, index) in 2" :key="index" class="wealth-item" :style="{'width': (100 / 2) + '%'}">
												<u-count-to separator="," font-size="50" :bold="true" :duration="1000" :color="themeColor" end-val="1000.00" :decimals="2"></u-count-to>
												<view class="title">可提现佣金(元)</view>
												<!-- <view v-else class="item-secret">****</view> -->
											</view>
										</view>
									</view>
								</view>
								<view class="earning-center-detail">
									<view class="earning-center-detail-box">
										<view v-for="(item,index) in 4" :key="index" class="detail-item">
											<u-icon custom-prefix="zx-icon" color="#f00" size="60" name="setting"></u-icon>
											<view class="item-box">
												<view class="detail-item-name">推广佣金</view>
												<view class="detail-item-amount">100.00</view>
											</view>
										</view>
									</view>
								</view>
								<view class="place-menu-root">
									<view v-for="(item, index) in menuList" :key="index" class="content-item-box">
										<block v-for="(menu, menuIndex) in item" :key="menuIndex">
											<block v-if="menu.url == 'service'">
												<!-- #ifdef H5 -->
												<view @click="onClickMenuItem(menu)" class="common-horizontal-menu-item">
													<view class="menu-item-left">
														<view class="menu-item-icon">
															<u-icon custom-prefix="zx-icon" :name="menu.icon" color="#333"
																size="36"></u-icon>
														</view>
														<view class="menu-item-title">{{ $t(menu.title) }}</view>
														<view v-if="menu.badge" class="memu-item-badge">{{ menu.badge }}
														</view>
													</view>
													<block v-if="menu.url === 'language'">
														<view class="menu-item-right">
															<view class="menu-item-right-txt">{{ $t('common.' + locale) }}
															</view>
															<u-icon name="arrow-right" size="28" color="#999"></u-icon>
														</view>
													</block>
													<block v-else>
														<u-icon name="arrow-right" size="28" color="#999"></u-icon>
													</block>
												</view>
												<!-- #endif -->
												<!-- #ifdef APP-PLUS -->
												<view @click="onClickMenuItem(menu)" class="common-horizontal-menu-item">
													<view class="menu-item-left">
														<view class="menu-item-icon">
															<u-icon custom-prefix="zx-icon" :name="menu.icon" color="#333"
																size="36"></u-icon>
														</view>
														<view class="menu-item-title">{{ $t(menu.title) }}</view>
														<view v-if="menu.badge" class="memu-item-badge">{{ menu.badge }}
														</view>
													</view>
													<block v-if="menu.url === 'language'">
														<view class="menu-item-right">
															<view class="menu-item-right-txt">{{ $t('common.' + locale) }}
															</view>
															<u-icon name="arrow-right" size="28" color="#999"></u-icon>
														</view>
													</block>
													<block v-else>
														<u-icon name="arrow-right" size="28" color="#999"></u-icon>
													</block>
												</view>
												<!-- #endif -->
											</block>
											<block v-else>
												<view @click="onClickMenuItem(menu)" class="common-horizontal-menu-item">
													<view class="menu-item-left">
														<view class="menu-item-icon">
															<u-icon custom-prefix="zx-icon" :name="menu.icon" color="#333"
																size="36"></u-icon>
														</view>
														<view class="menu-item-title">{{ $t(menu.title) }}</view>
														<view v-if="menu.badge" class="memu-item-badge">{{ menu.badge }}
														</view>
													</view>
													<block v-if="menu.url === 'language'">
														<view class="menu-item-right">
															<view class="menu-item-right-txt">{{ $t('common.' + locale) }}
															</view>
															<u-icon name="arrow-right" size="28" color="#999"></u-icon>
														</view>
													</block>
													<block v-else>
														<u-icon name="arrow-right" size="28" color="#999"></u-icon>
													</block>
												</view>
											</block>
										</block>
									</view>
								</view>
							</view>
						</view>
					</mescroll-uni>
				</view>
			</view>
		</block>
		<block v-if="loadFail">
			<zx-error @retry="onClickRetry" :btnTxt="loginStatus ? $t('common.retry') : $t('common.login.first')"></zx-error>
		</block>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loaded: true,
				loadFail: false,
				mescroll: '',
				up: {
					use: false
				},
				menuList: [
					[{
							icon: 'wallet',
							title: 'place.performance.statistics',
							url: '/distribution/pages/performance/index'
						}
					]
				],
			}
		},
		
		onLoad() {
			
		},
		
		methods: {
			onClickRetry() {
				if (this.loginStatus) {
					
				} else {
					
				}
			},
			
			mescrollInit(mescroll) {
				this.mescroll = mescroll
			},
			
			downCallback() {
				setTimeout(() => {
					this.mescroll.endSuccess()
				}, 1500)
			},
			
			onClickWithdraw() {
				this.$util.miniAppRoute('/distribution/pages/cash/index')
			},
			
			onClickMenuItem(menu) {
				if (menu.url) {
					this.$util.miniAppRoute(menu.url)
				}
			}
		}
	}
</script>

<style lang="less">
	page {
		.hper-100();
		background-color: @background-color;
	}
	
	.place-mescroll-root {
		.pbsafe();
		
		.place-mescroll-box {
			
			.place-header {
				
				.header-box {
					padding: @padding-xs + 10rpx;
					box-sizing: border-box;
					background-color: @primary-color;
					.flex-c-aic();
					
					.header-avatar {
						width: 140rpx;
						height: 140rpx;
						border-radius: 140rpx;
						vertical-align: middle;
						overflow: hidden;
						background-color: #fff;
					}
					
					.header-content {
						flex: 1;
						overflow: hidden;
						padding-left: @padding-xs;
						box-sizing: border-box;
						color: #fff;
						
						.nickname {
							font-weight: 600;
							font-size: 46rpx;
						}
						
						.ref-box {
							font-size: @font-size-base;
						}
					}
				}
				
				.invite-box {
					.flex-c-aic();
					padding: @padding-xs @padding-xs + 10rpx;
					box-sizing: border-box;
					color: @text-primary-color;
					font-size: @font-size-base;
					background-color: #fff;
					
					.invite-txt {
						margin-right: @common-blank;
					}
				}
			}
		
			.commission-root {
				background-color: #fff;
				margin-top: @common-blank * 2;
				
				.commission-header {
					.flex-c-aic-jcb();
					padding: @padding-xs;
					box-sizing: border-box;
					position: relative;
					
					&::after {
						bottom: 0;
						left: 0;
						.wper-100();
						height: 1px;
						background-color: @background-color;
						content: '';
						position: absolute;
					}
					
					.header-left {
						.flex-c-aic();
						color: @text-primary-color;
						font-size: @font-size-base;
						
						.left-title {
							padding-left: @padding-xs / 2;
						}
					}
					
					.header-right {
						font-size: @font-size-sm;
						color: @text-thirdly-color;
						.flex-c-aic();
					}
				}
				
				.commission-box {
					padding: @padding-xs + 10rpx @padding-xs;
					box-sizing: border-box;
					
					.box-footer {
						.flex-c-aic-jca();
						flex-wrap: wrap;
						font-size: @font-size-sm;
					
						.wealth-item {
							.flex-col-aic-jcc();
							font-size: @font-size-base;
							position: relative;
							padding: @padding-xs 0 0;
							box-sizing: border-box;
					
							&:not(:last-child)::after {
								position: absolute;
								content: '';
								.wper-100();
								height: 50%;
								top: 25%;
								left: 0;
								border-right: 1px solid rgba(255, 255, 255, .3);
							}
							
							&:nth-child(3n)::after {
								position: absolute;
								content: '';
								width: calc(100% - 40rpx);
								.hper-100();
								top: 0;
								right: 40rpx;
								border-right: none!important;
							}
					
							.value {
								font-size: @font-size-base;
								font-weight: 500;
								color: #FFFFFF;
							}
					
							.title {
								padding-top: @padding-xs;
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
		
			.earning-center-detail {
				margin-top: @common-blank * 2;
			
				.earning-center-detail-box {
					box-sizing: border-box;
					overflow: hidden;
					background-color: #FFFFFF;
					.flex-c-aic();
					flex-wrap: wrap;
			
					.detail-item {
						width: 50%;
						padding: @padding-xs + 10rpx;
						.flex-c-aic-jcs();
						box-sizing: border-box;
						position: relative;
						
						.item-box {
							padding-left: @padding-xs;
							font-size: @font-size-base;
						}
			
						&::after {
							position: absolute;
							content: '';
							.wper-100();
							.hper-100();
							top: 0;
							left: 0;
							border-right: 1px solid #f1f1f1;
							border-bottom: 1px solid #f1f1f1;
						}
			
						&:nth-child(2n)::after {
							position: absolute;
							content: '';
							width: calc(100% - 40rpx);
							.hper-100();
							top: 0;
							right: 40rpx;
							border-right: none;
						}
			
						&:nth-child(2n + 1)::after {
							position: absolute;
							content: '';
							width: calc(100% - 40rpx);
							.hper-100();
							top: 0;
							left: 40rpx;
						}
			
						&:nth-last-child(2)::after {
							position: absolute;
							content: '';
							.wper-100();
							height: calc(100% - 40rpx);
							bottom: 40rpx;
							left: 0;
							top: 0 !important;
							border-bottom: none;
						}
			
						&:nth-child(1)::after {
							position: absolute;
							content: '';
							width: calc(100% - 40rpx);
							height: calc(100% - 40rpx);
							bottom: 40rpx;
							left: 40rpx;
							top: 40rpx !important;
						}
			
						&:nth-last-child(1)::after {
							position: absolute;
							content: '';
							.wper-100();
							.hper-100();
							top: 0;
							left: 0;
							border-bottom: none;
						}
			
						.detail-item-amount {
							.num-ff();
							color: @text-secondary-color;
						}
			
						.detail-item-name {
							padding-top: @padding-xs / 2;
							font-size: @font-size-base;
							color: @text-primary-color;
						}
					}
				}
			}
		
			.place-menu-root {
				background-color: #FFFFFF;
				margin-top: @common-blank * 2;
				
				.content-item-box {
					background-color: #fff;
					border-radius: @border-radius-base * 2;
					overflow: hidden;
				}
			}
		}
	}
</style>
