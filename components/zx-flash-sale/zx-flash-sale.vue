<template>
	<view @click="onClickFlashSaleItem" class="zx-flash-sale-root" :style="{'padding': options.padding * 2 + 'rpx', 'background-color': options.bgColor, 'color': options.color, 'border-radius': options.radius * 2 + 'rpx', 'box-shadow': options.shadow ? '0 0 20rpx #eee' : ''}">
		<view class="goods-box">
			<view class="goods-img-box" :style="{'border-radius': options.imageRadius * 2 + 'rpx'}">
				<image class="goods-img" webp="true" lazy-load="true" mode="aspectFill" :src="goods.goods.cover"></image>
				<view v-if="goods.stock == 0 && indexConfig.goods.showSoldoutImage" class="sellout-box">
					<image class="sellout-img" webp="true" lazy-load="true" mode="widthFix" :src="indexConfig.goods.soldoutImage"></image>
				</view>
				<view v-else-if="goods.fs_status == 3" class="sellout-box">
					<image class="sellout-img" webp="true" lazy-load="true" mode="widthFix" :src="options.timeoutImage"></image>
				</view>
			</view>
			<view class="goods-right">
				<view class="right-header">
					<view class="header-content">
						<view class="goods-no">{{ goods.no }}</view>
						<view class="goods-status"></view>
					</view>
					<view class="goods-title" :style="{'color': options.titleColor}">{{ goods.goods.title }}</view>
					<view class="slide-box">
						<view class="process-box">
							<u-line-progress :active-color="options.processColor" inactive-color="#f1f1f1" :striped-active="true" :show-percent="false" :striped="true" :height="14" :percent="goods.per"></u-line-progress>
						</view>
						<view class="percent" :style="{'color': options.processColor}">{{ goods.in_num }}/{{ goods.num }}</view>
					</view>
					<view class="goods-price-box">
						<view class="goods-u">{{ goods.goods.price }}U</view>
						<view class="goods-award-u">{{ $t('home.award') }} {{ goods.goods.bonus }}U</view>
					</view>
				</view>
			</view>
		</view>
		<view v-if="goods.fs_status == 1 || goods.fs_status == 3" class="footer-box">
			<view class="footer-left">
				<block>
					<view class="avatar-box">
						<block v-if="goods.userRes">
							<image v-for="(item, index) in goods.userRes" :key="index" class="avatar" mode="aspectFill" lazy-load="true" webp="true" :src="item.icon"></image>
							<view class="avatar">···</view>
						</block>
						<block v-else>
							<view v-for="(item, index) in num" :key="index" class="avatar">···</view>
						</block>
					</view>
					<view class="left-txt">{{ options.note }}</view>
				</block>
			</view>
			<button v-if="goods.fs_status == 1" @click.stop="onClickBuy" class="buy-btn" :style="{'border-radius': options.buyBtn.radius * 2 + 'rpx!important', 'background-color': options.buyBtn.bgColor, 'color': options.buyBtn.color}">
				<u-icon name="shopping-cart" color="#ffffff" size="34"></u-icon>
				<view class="buy-txt">{{ options.buyBtn.text }}</view>
			</button>
		</view>
	</view>
</template>

<script>
	const app = getApp()
	export default {
		name:"zx-flash-sale",
		
		props:{
			options: {
				type: Object,
				default() {
					return {
						
					}
				}
			},
			
			goods: {
				type: Object,
				default() {
					return {
						
					}
				}
			}
		},
		
		data() {
			return {
				num: ['']
			}
		},
		
		created() {
			
		},
		
		methods: {
			onClickFlashSaleItem() {
				this.$util.miniAppRoute('/goods/pages/detail/index?gb_id=' + this.goods.id + '&gid=' + this.goods.gid)
			},
			
			onClickBuy() {
				this.$util.miniAppRoute('/goods/pages/detail/index?gb_id=' + this.goods.id + '&gid=' + this.goods.gid)
			},
			
			onClickWait() {
				
			}
		}
	}
</script>

<style lang="less" scoped>
	.zx-flash-sale-root {
		box-sizing: border-box;
		
		&:not(:last-child) {
			margin-bottom: @padding-xs;
		}
		
		.goods-box {
			.flex-c();
			align-items: stretch;
			
			.goods-img-box {
				width: 200rpx;
				height: 200rpx;
				overflow: hidden;
				position: relative;
				
				.goods-img {
					.wper-100();
					.hper-100();
				}
				
				.sellout-box {
					position: absolute;
					top: 0;
					left: 0;
					.wper-100();
					.hper-100();
					z-index: 10;
					background-color: rgba(0, 0, 0, .3);
					.flex-c-aic-jcc();
				}
				
				.sellout-img {
					width: 75%;
				}
			}
			
			.goods-right {
				height: inherit!important;
				flex: 1;
				padding-left: @padding-xs;
				box-sizing: border-box;
				.flex-col();
				
				.right-header {
					flex: 1;
					.flex-col-jca();
					
					.header-content {
						.flex-c-aic-jcb();
						
						.goods-no {
							font-size: @font-size-xxs;
							color: @text-secondary-color;
							// font-weight: 500;
						}
						
						.goods-status {
							font-size: @font-size-sm;
							color: @red-color;
						}
					}
					
					.goods-title {
						color: @text-primary-color;
						font-size: @font-size-sm;
						font-weight: 600;
						.line-2();
					}
					
					.slide-box {
						// padding-top: @padding-xs / 2;
						.flex-c-aic();
						width: 80%;
						line-height: 1;
						
						.process-box {
							flex: 1;
							.flex-c();
						}
						
						.percent {
							padding-left: @padding-xs / 2;
							color: @text-secondary-color;
							font-size: @font-size-xxs;
							.num-ff();
						}
					}
					
					.goods-sub-title {
						padding-top: @padding-xs / 4;
						color: @text-thirdly-color;
						font-size: @font-size-xxs;
						.line-1();
					}
					
					.goods-price-box {
						.flex-c-aic-jcb();
						.wper-100();
						// padding: @padding-xs / 2 0;
						
						.goods-u {
							color: @primary-color;
							font-size: @font-size-base;
						}
						
						.goods-award-u {
							color: @text-secondary-color;
							font-size: @font-size-xxs;
						}
						
						.price-content {
							.flex-c-aic();
							.num-ff();
							line-height: 1;
							
							.real-price {
								font-size: @font-size-base;
								font-weight: 600;
								
								.real-prefix {
									font-size: @font-size-xxs;
									font-weight: normal;
								}
								
								.real-tail {
									font-size: @font-size-xxs;
									font-weight: normal;
								}
							}
							
							.ori-price {
								padding-left: @padding-xs;
								color: @text-secondary-color;
								text-decoration: line-through;
								font-size: @font-size-sm;
							}
						}
						
						.stock {
							color: @text-secondary-color;
							font-size: @font-size-base;
						}
					}
				}
				
				.right-footer {
					
					.time-box {
						.flex-c-aic();
						color: @text-secondary-color;
						font-size: @font-size-sm;
						
						.u-countdown {
							.num-ff();
						}
					}
					
					.slide-box {
						padding-top: @padding-xs / 2;
						.flex-c-aic();
						width: 60%;
						
						.process-box {
							flex: 1;
						}
						
						.percent {
							padding-left: @padding-xs / 2;
							color: @text-secondary-color;
							font-size: @font-size-xxs;
							.num-ff();
						}
					}
				}
				
				.wait-box {
					.wper-100();
					.flex-c-aic();
					
					.wait-time {
						flex: 1;
						overflow: hidden;
						padding-right: @padding-xs / 2;
						box-sizing: border-box;
						.line-1();
						color: @text-secondary-color;
						font-size: @font-size-sm;
					}
					
					.wait-btn {
						background-color: @text-thirdly-color;
						color: #FFFFFF;
						font-size: @font-size-xxs;
						border-radius: 100rpx;
						padding: 0 @padding-xs;
						margin: 0;
						line-height: 50rpx;
						
						&::after {
							border: none;
						}
					}
				}
			}
		}
		
		.footer-box {
			padding-top: @padding-xs / 2;
			.flex-c-aic-jcb();
			
			.footer-left {
				.flex-c-aic();
				flex: 1;
				padding-right: @padding-xs;
				box-sizing: border-box;
				overflow: hidden;
				height: 50rpx;
				
				.avatar-box {
					.flex-c-aic();
					.hper-100();
					line-height: 1;
					
					.avatar {
						width: 40rpx;
						height: 40rpx;
						border-radius: 50%;
						background-color: #e1e1e1;
						vertical-align: middle;
						font-size: @font-size-xxs;
						font-weight: 700;
						color: @text-thirdly-color;
						.flex-c-aic-jcc();
						
						&:not(:first-child) {
							margin-left: -16rpx;
						}
					}
				}
				
				.left-txt {
					.hper-100();
					.flex-c-aic();
					font-size: @font-size-sm;
					color: @text-thirdly-color;
					padding-left: @padding-xs;
					box-sizing: border-box;
				}
			}
			
			.buy-btn {
				line-height: 50rpx;
				background-color: @primary-color;
				color: #FFFFFF;
				.flex-c-aic();
				font-size: @font-size-xxs;
				border-radius: 100rpx;
				padding: 0 @padding-xs;
				margin: 0;
				
				&::after {
					border: none;
				}
				
				.buy-txt {
					padding-left: @padding-xs / 2;
				}
			}
		}
	}
</style>
