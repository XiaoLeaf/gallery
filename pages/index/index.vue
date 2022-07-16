<template>
	<view class="home-root">
		<view class="home-root-box">
			<block v-if="loaded">
				<view class="home-box" :style="{'background-color': homeData.pageConfig.backgroundColor}">
					<zx-navbar :background="$u.colorToRgba(homeData.pageConfig.navBackgroundColor, opacity)">
						<view v-if="!homeData.shopRow" slot="left" class="nav-bar-left">
							<image v-if="homeData.pageConfig.logo" webp="true" lazy-load="true" mode="heightFix" class="left-img" :src="homeData.pageConfig.logo"></image>
							<view v-else @click="onClickAvatar" :style="{'color': homeData.pageConfig.frontColor}" class="left-title">
								<image v-if="homeData.pageConfig.icon" class="left-title-img" mode="aspectFill" lazy-load="true" webp="true" :src="homeData.pageConfig.icon"></image>
								<text class="title-text">{{ homeData.pageConfig.title }}</text>
							</view>
						</view>
						<navigator slot="title" v-if="homeData.pageConfig.search.display" url="/goods/pages/search/index" hover-class="none" class="nav-bar-title" :style="{'padding-left': homeData.shopRow ? '10px' : '0px'}">
							<view class="title-content" :style="{'border-radius': homeData.pageConfig.search.input.radius * 2 + 'rpx', 'background-color': $u.colorToRgba(homeData.pageConfig.search.input.bgColor, homeData.pageConfig.search.input.alpha), 'justify-content': homeData.pageConfig.search.input.textAlign == 'left' ? 'flex-start' : homeData.pageConfig.search.input.textAlign == 'center' ? 'center' : homeData.pageConfig.search.input.textAlign == 'right' ? 'flex-end' : 'flex-start'}">
								<u-icon v-if="homeData.pageConfig.search.input.icon" :color="homeData.pageConfig.search.input.color" :size="homeData.pageConfig.search.input.size * 2" name="search"></u-icon>
								<view class="nav-title" :style="{'text-transform': 'uppercase', 'color': homeData.pageConfig.search.input.color, 'font-size': homeData.pageConfig.search.input.size * 2 + 'rpx'}">
									{{homeData.pageConfig.search.input.text}}
								</view>
							</view>
						</navigator>
					</zx-navbar>
					<view class="home-content" :style="{'padding-top': homeData.shopRow ? '0px' : capsule ? capsule.top + 40 + 'px' : '44px'}">
						<mescroll-uni :fixed="false" :safearea="true" @init="mescrollInit" @down="downCallback" :up="up" :down="down" @scroll="onIndexScroll">
							<view v-if="homeData.shopRow" class="shop-header-root" :style="{'padding-bottom': '30rpx', 'padding-top': capsule ? capsule.top + 40 + 'px' : '44px', 'color': homeData.shopRow.color ? homeData.shopRow.color : '', 'background-color': homeData.shopRow.shop_bgcolor ? homeData.shopRow.shop_bgcolor : '', 'background-image': homeData.shopRow.shop_bg ? 'url(' + homeData.shopRow.shop_bg + ')' : ''}">
								<view class="shop-header-box">
									<view class="info-box">
										<image webp="true" lazy-load="true" class="shop-logo" mode="aspectFill" :src="homeData.shopRow.shop_logo"></image>
										<view class="info-right">
											<view class="shop-title">{{ homeData.shopRow.shop_name }}</view>
											<view class="shop-contact">{{ homeData.shopRow.shop_addr }}</view>
										</view>
									</view>
									<view @click="onClickShopIntro" class="intro-box">
										<view class="intro-txt">
											<u-parse class="intro-txt" :html="homeData.shopRow.shop_intro"></u-parse>
										</view>
										<u-icon name="arrow-right" size="20" :color="homeData.shopRow.color"></u-icon>
									</view>
								</view>
							</view>
							<view class="zx-common-box" :style="{'margin-top': homeData.shopRow ? '-20rpx' : '0px', 'border-radius': homeData.shopRow ? '20rpx' : '0px'}">
								<zx-common class="zx-common" :needNone="false" :common="homeData" @change="onChange"></zx-common>
							</view>
						</mescroll-uni>
					</view>
				</view>
				<view class="suspend-root" :style="{bottom: homeData.pageConfig.floatBtn.size * 2 + 80 + 'rpx'}">
					<block v-for="(item, index) in homeData.pageConfig.floatBtn.list" :key="index">
						<view v-if="item.image" class="suspend-item" :style="{width: homeData.pageConfig.floatBtn.size * 2 + 'rpx', height: homeData.pageConfig.floatBtn.size * 2 + 'rpx', 'margin-bottom': homeData.pageConfig.floatBtn.gap * 2 + 'rpx'}">
							<block v-if="item.url == 'contact'">
								<button open-type="contact" class="item-btn-content">
									<image webp="true" lazy-load="true" class="item-image" :src="item.image"></image>
								</button>
							</block>
							<block v-else>
								<view @click="onClickSuspendItem(item)" class="item-content">
									<image webp="true" lazy-load="true" class="item-image" :src="item.image"></image>
								</view>
							</block>
						</view>
					</block>
				</view>
			</block>
			<block v-if="loadFail">
				<zx-error @retry="onClickRetry" class="error-box" :btnTxt="loginStatus ? $t('common.retry') : $t('common.login.first')"></zx-error>
			</block>
		</view>
		<!-- <zx-tabbar :tabbarList="tabbarList"></zx-tabbar> -->
		<u-popup v-model="showPoster" mode="center" :maskCustomStyle="maskCustomStyle">
			<zx-poster :poster="homePoster"></zx-poster>
		</u-popup>
	</view>
</template>

<script>
	const app = getApp()
	export default {
		data() {
			return {
				loaded: false,
				loadFail: false,
				mescroll: '',
				homeData: '',
				down: {

				},
				up: {
					use: false,
					onScroll: true,
					toTop: {
						bottom: 80
					}
				},
				showPoster: false, //是否显示海报弹窗
				homePoster: '', //海报链接
				maskCustomStyle: {
					'background-color': 'rgba(0, 0, 0, .7)'
				}, //popup-up弹层mask-style
				opacity: 0.0, //导航栏透明度
			}
		},

		watch: {
			loginStatus: {
				handler(val) {
					this.fetchIndexStart(false)
				},
				deep: true,
			}
		},

		onLoad() {
			this.fetchIndexStart(true)
		},

		onShareAppMessage(event) {
			let config = this.$util.pageShareConfig(this.homeData.pageConfig)
			let path = this.$util.commonShareConfig('/pages/index/index')
			config.path = path
			return config
		},

		onShareTimeline() {
			let config = this.$util.pageShareConfig(this.homeData.pageConfig)
			let query = this.$util.fetchTimeLineQuery({})
			config.query = query
			return config
		},

		methods: {
			/**
			 * 获取首页数据
			 */
			fetchIndexStart(loading) {
				let params = {}
				let ref = uni.getStorageSync(this.$api.ref)
				if (ref) {
					params.ref = ref
				}
				this.$util.postRequest(this.$api.index_start, params, loading,
					res => {
						this.loaded = true
						this.loadFail = false
						if (this.mescroll) {
							this.mescroll.endSuccess()
						}
						if (res.data.pageConfig) {
							this.$util.setPageConfig(res.data.pageConfig)
						}
						this.homeData = res.data
						// this.$set(this.homeData, 'shopRow', '')
						// this.$set(this.homeData.pageConfig.search, 'display', true)
						this.opacity = this.homeData.shopRow ? 0.0 : 1.0
						this.$set(this.down, 'textColor', this.homeData.pageConfig.loadingColor)
						//设置购物车badge
						uni.setStorageSync(this.$api.cartInfo, this.homeData.cart_total)
						this.$util.setCartBadge(this.homeData.cart_total)
						//设置消息badge
						this.$util.setMessageBadge(this.homeData.messageCount)
						//设置回到顶部按钮的size
						this.$set(this.up.toTop, 'width', this.homeData.pageConfig.floatBtn.size * 2)
					},
					err => {
						// console.log('err====>',JSON.stringify(err))
						this.loaded = false
						this.loadFail = true
						if (this.mescroll) {
							this.mescroll.endErr()
						}
						this.$util.showNoIconToast(err.info)
					})
			},

			/**
			 * mescroll初始化
			 */
			mescrollInit(mescroll) {
				this.mescroll = mescroll
			},

			/**
			 * 下拉刷新
			 */
			downCallback() {
				this.fetchIndexStart(false)
			},
			
			/**
			 * mescroll滚动监听
			 */
			onIndexScroll(mescroll) {
				if (!this.homeData.shopRow) {
					this.opacity = 1.0
					return
				}
				let height = this.capsule.top + 40
				let top = mescroll.scrollTop - 40
				if (top < 0) {
					this.opacity = 0.0
					return
				}
				this.opacity = parseFloat((top / height).toFixed(1)) > 1.0 ? 1.0 : (top / height).toFixed(1)
			},
			
			/**
			 * 点击店铺介绍
			 */
			onClickShopIntro() {
				this.$util.miniAppRoute('/mine/pages/contact/index')
			},

			/**
			 * 重试
			 */
			onClickRetry() {
				this.fetchIndexStart(true)
			},

			/**
			 * 切换悬停tab
			 */
			onChange() {
				setTimeout(() => {
					this.mescroll.scrollTo('.zx-common >>> .zx-goods-flash-sale >>> #zx-goods-flash-sale-root', 300)
				}, 300)
			},

			/**
			 * 获取限时抢购商品列表
			 */
			fetchFlshSaleGoodsList(params, index) {
				this.$util.postRequest(this.$api.goods_fs_list, {
						params: params
					}, true,
					res => {
						this.$set(this.homeData.moduleData[index].data, 'list', res.data.list)
					},
					err => {
						this.$util.showNoIconToast(err.info)
						this.$set(this.homeData.moduleData[index].data, 'list', [])
					})
			},

			/**
			 * 点击头像
			 */
			onClickAvatar() {
				// console.log('onClickAvatar')
				// this.$util.miniAppRoute('/core/pages/contact/index')
			},

			/**
			 * 点击搜索
			 */
			onClickSearch() {
				this.$util.miniAppRoute('/goods/pages/search/index')
			},

			/**
			 * 点击分享
			 */
			onClickShare() {
				this.$util.postRequest(this.$api.poster_create, {}, true, 
				res => {
					// console.log('res====>', JSON.stringify(res))
					this.homePoster = res.data.url
					this.showPoster = !this.showPoster
				},
				err => {
					this.$util.showNoIconToast(err.info)
				}, '生成中...')
			},
			
			/**
			 * 点击悬浮按钮
			 */
			onClickSuspendItem(item) {
				if (item.url) {
					if (item.url == 'share') {
						this.onClickShare()
					} else {
						this.$util.miniAppRoute(item.url)
					}
				}
			}
		}
	}
</script>

<style lang="less">
	page {
		height: 100%;
	}

	.zx-goods-flash-sale-root .zx-flash-sale-root .u-progress {
		display: block !important;
	}
	
	.u-drawer-center {
		.flex-c-aic-jce()!important;
	}
	
	.test-box {
		.wper-100();
		height: 1000rpx;
	}

	.home-root {
		.hper-100();
		.flex-col();
		
		.home-root-box {
			flex: 1;
			min-height: 0;
			.flex-col();
			position: relative;
			
			.suspend-root {
				position: absolute;
				right: 20rpx;
				
				.suspend-item {
					
					.item-content {
						width: 100%;
						height: 100%;
						padding: 0;
					}
					
					.item-btn-content {
						width: 100%;
						height: 100%;
						padding: 0;
						margin: 0;
						background-color: transparent;
						
						&::after {
							border: none;
						}
					}
					
					.item-image {
						.wper-100();
						.hper-100();
						vertical-align: middle;
					}
				}
			}
		}

		.u-mode-center-box {
			background-color: transparent !important;
		}

		.home-box {
			.hper-100();
			.flex-col();

			.u-notice-bar {
				padding: 0 !important;
			}

			.home-content {
				flex: 1;
				min-height: 0;
				
				.zx-common-box {
					overflow: hidden;
				}
				
				.shop-header-root {
					.wper-100();
					box-sizing: border-box;
					background-color: @primary-color;
					background-repeat: no-repeat;
					// background-position: center top;
					background-size: cover;
					z-index: 0;
					
					.shop-header-box {
						padding: @padding-xs;
						box-sizing: border-box;
						color: #FFFFFF;
						
						.info-box {
							.flex-c-aic();
							
							.shop-logo {
								width: 100rpx;
								height: 100rpx;
								vertical-align: middle;
								border-radius: @border-radius-base;
								overflow: hidden;
							}
							
							.info-right {
								flex: 1;
								overflow: hidden;
								padding-left: @padding-xs;
								box-sizing: border-box;
								line-height: 40rpx;
								
								.shop-title {
									font-size: @font-size-base;
									font-weight: 500;
								}
								
								.shop-contact {
									font-size: @font-size-xxs;
								}
							}
						}
							
						.intro-box {
							padding-top: @padding-xs;
							.flex-c-aic();
							line-height: 1;
							
							.intro-txt {
								flex: 1;
								font-size: @font-size-xxs;
								.line-2();
								line-height: 40rpx;
							}
						}
					}
				}
			}

			.nav-bar-left {
				.wper-100();
				.hper-100();
				padding: 0 @padding-xs;
				box-sizing: border-box;

				.left-img {
					.hper-100();
					display: block;
				}

				.left-title {
					font-size: 15px;
					.flex-c-aic();
					font-weight: 600;

					.left-title-img {
						margin-right: @common-blank;
						width: 30px;
						height: 30px;
						border-radius: 50%;
					}

					.title-text {
						flex: 1;
						.line-1();
					}
				}
			}

			.nav-bar-title {
				.wper-100();
				.hper-100();
				box-sizing: border-box;

				.title-content {
					.wper-100();
					.hper-100();
					.flex-c-aic-jce();
					padding: 0 @padding-xs;
					box-sizing: border-box;

					.icon-item {
						margin-left: @common-blank * 2;

						.item-img {
							width: 40rpx;
							height: 40rpx;
							vertical-align: middle;
						}
					}

					.nav-title {
						padding-left: @padding-xs / 2;
						box-sizing: border-box;
						.line-1();
					}
				}
			}
		}

		.error-box {
			flex: 1;
		}
	}
</style>
