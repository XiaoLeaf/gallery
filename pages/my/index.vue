<template>
	<view class="common-page-root">
		<block v-if="loaded">
			<zx-navbar background="transparent" :opacity="opacity">
				<view slot="title" class="navbar-middle">
					<!-- <view class="middle-title">{{ $t('tabbar.my') }}</view> -->
				</view>
			</zx-navbar>
			<view class="common-page-box">
				<view class="mescroll-box">
					<mescroll-uni :fixed="false" :safearea="true" :up="up" @init="mescrollInit" @down="downCallback"
						@scroll="onMineScroll">
						<view class="my-mescroll-root">
							<view class="my-mescroll-box">
								<view class="mine-header" :style="{'padding-top': (statusH + 64) + 'px'}">
									<image webp="true" lazy-load="true" class="header-logo" mode="aspectFill" src="">
									</image>
								</view>
								<zx-menu :info="menuInfo"></zx-menu>
								<view class="my-content-box">
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
									<view class="setting-box">
										<view @click="onClickSwitch" class="exit-item">{{ $t('my.switch') }}</view>
										<view class="version-box">{{ $t('common.version') }}：{{ version }}</view>
									</view>
									<view style="height: 200rpx;"></view>
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
	const app = getApp()
	export default {
		data() {
			return {
				loaded: true,
				loadFail: false,
				mescroll: '',
				up: {
					use: false,
					onScroll: true
				},
				opacity: 0.0,
				version: '',
				menuList: [
					[{
							icon: 'address',
							title: 'my.calligraphy',
							url: '/mine/pages/calligraphy/index'
						},
						{
							icon: 'address',
							title: 'my.appointment.record',
							url: '/mine/pages/appointment/index'
						},
						{
							icon: 'wallet',
							title: 'my.bind',
							url: '/mine/pages/bind/index'
						},
						{
							icon: 'address',
							title: 'my.address',
							url: '/mine/pages/address/index'
						},
						{
							icon: 'setting',
							title: 'my.setting',
							url: '/mine/pages/setting/index'
						}
					]
				],
				menuInfo: {
					"title": {
						"text": "我的订单",
						"color": "#555555",
						"size": 14,
						"lr": 10,
						"t": 0,
						"b": 10,
						"right": {
							"text": "全部订单",
							"color": "#7777777",
							"size": 12,
							"params": {
								"type": 1,
								"url": "/order/pages/index/index?status=0",
								"appid": ""
							}
						}
					},
					"outer": {
						"t": 5,
						"b": 5,
						"lr": 10,
						"bgColor": ""
					},
					"inner": {
						"t": 15,
						"b": 10,
						"lr": 10,
						"gap": 10,
						"itgap": 5,
						"bgColor": "#ffffff",
						"radius": 10
					},
					"font": {
						"color": "#666666",
						"size": 12
					},
					"image": {
						"size": 30,
						"radius": 0
					},
					"cols": 5,
					"list": [{
						"image": "https://cfccl.oss-cn-hangzhou.aliyuncs.com/0/165712391910697.png",
						"text": "待付款",
						"color": "",
						"params": {
							"type": 1,
							"url": "/order/pages/index/index?status=5",
							"appid": ""
						},
						"badge": {
							"text": "",
							"type": "2",
							"bgColor": "#cc0000",
							"color": "#ffffff"
						}
					}, {
						"image": "https://cfccl.oss-cn-hangzhou.aliyuncs.com/0/165712391910866.png",
						"text": "待发货",
						"color": "",
						"params": {
							"type": 1,
							"url": "/order/pages/index/index?status=3",
							"appid": ""
						},
						"badge": {
							"text": "",
							"type": "2",
							"bgColor": "#cc0000",
							"color": "#ffffff"
						}
					}, {
						"image": "https://cfccl.oss-cn-hangzhou.aliyuncs.com/0/165712391910966.png",
						"text": "待收货",
						"color": "",
						"params": {
							"type": 1,
							"url": "/order/pages/index/index?status=2",
							"appid": ""
						},
						"badge": {
							"text": "",
							"type": "2",
							"bgColor": "#cc0000",
							"color": "#ffffff"
						}
					}],
					"iden": "order"
				}
			}
		},

		onLoad() {
			this.version = app.globalData.version
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

			onMineScroll(mescroll) {

			},

			onClickMenuItem(menu) {
				if (menu.url) {
					this.$util.miniAppRoute(menu.url)
				}
			},
			
			onClickSwitch() {
				this.$util.miniAppRoute('/mine/pages/switch-account/index')
			}
		}
	}
</script>

<style lang="less">
	page {
		.hper-100();
		background-color: @background-color;
	}

	.my-mescroll-root {
		.pbsafe();
		overflow: hidden;

		.my-mescroll-box {

			.mine-header {
				background-color: @primary-color;
				padding: 0 @padding-xs * 2 @padding-xs * 2;
				box-sizing: border-box;
				.flex-col-aic-jcc();

				.header-logo {
					width: 140rpx;
					height: 140rpx;
					border-radius: 140rpx;
					overflow: hidden;
					vertical-align: middle;
					background-color: #fff;
				}
			}

			.my-content-box {
				// margin-top: @common-blank;
				padding: 0 @padding-xs;
				box-sizing: border-box;

				.content-img {
					.wper-100();
					border-radius: @border-radius-base;
					overflow: hidden;
					vertical-align: middle;
					height: 140rpx;
				}

				.content-item-box {
					background-color: #fff;
					border-radius: @border-radius-base * 2;
					overflow: hidden;
				}
				
				.setting-box {
					box-sizing: border-box;
					margin-top: @common-blank;
				
					.exit-item {
						// padding: @padding-xs 0;
						line-height: 80rpx;
						.flex-c-aic-jcc();
						color: #FFFFFF;
						font-size: @font-size-base;
						background-color: @red-color;
						border-radius: @border-radius-base * 2;
						overflow: hidden;
					}
					
					.version-box {
						margin-top: @common-blank * 2;
						color: @text-thirdly-color;
						font-size: @font-size-sm;
						text-align: center;
					}
				}
			}
		}
	}
</style>
