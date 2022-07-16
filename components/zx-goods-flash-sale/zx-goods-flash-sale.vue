<template>
	<view id="zx-goods-flash-sale-root" class="zx-goods-flash-sale-root"
		:style="{ 'background-color' : info.outer.bgColor, padding: info.outer.t * 2 + 'rpx ' + info.outer.lr * 2 + 'rpx ' + info.outer.b * 2 + 'rpx'}">
		<view class="zx-tabs-root" :style="{'background-color': info.tabbar.options.bgColor, 'border-top-left-radius': info.tabbar.options.topRadius * 2 + 'rpx', 'border-top-right-radius': info.tabbar.options.topRadius * 2 + 'rpx'}">
			<view v-for="(item,index) in info.tabbar.list" :key="index" class="zx-tabs-item" @click="onTabsChange(index)">
				<view :style="{'color': index == current ? info.tabbar.options.curr.titleColor : info.tabbar.options.common.titleColor }" class="tabs-item-title">{{ item.name }}</view>
			</view>
		</view>
		<view v-if="currentInfo.list.length > 0" class="goods-list-box">
			<zx-flash-sale v-for="(item, index) in currentInfo.list" :goods="item" :options="info.options" :key="index"></zx-flash-sale>
		</view>
		<view v-else class="flash-sale-loading-box">
			<block v-if="loadingSale">
				<u-loading mode="circle" size="60" :color="themeColor"></u-loading>
			</block>
			<block v-else>
				<zx-empty type="falshSale"></zx-empty>
			</block>
		</view>
	</view>
</template>

<script>
	const app = getApp()
	export default {
		name: "zx-sticky",

		props: {
			info: {
				type: Object,
				default () {
					return {

					}
				}
			},
			
			position: {
				type: Number,
				default: 0
			}
		},
		
		watch: {
			info: {
				handler(val) {
					this.current = 0
					this.currentInfo = val
				}
			}
		},

		data() {
			return {
				current: 0,
				currentInfo: this.info,
				loadingSale: false,
				firstClick: true,
			}
		},

		methods: {
			onTabsChange(index) {
				this.$emit('change')
				if (this.current != index) {
					this.$set(this.currentInfo, 'list', [])
				}
				this.current = index
				if (this.firstClick) {
					this.firstClick = false
				} else {
					this.loadingSale = true
				}
				this.fetchFlshSaleGoodsList(this.currentInfo.list.length > 0)
			},
			
			fetchFlshSaleGoodsList(loading) {
				this.$util.postRequest(this.$api.goods.gb_list, this.fetchParams(), loading,
					res => {
						this.$set(this.currentInfo, 'list', res.data.list)
						this.loadingSale = false
					},
					err => {
						this.$util.showNoIconToast(err.info)
						this.$set(this.currentInfo, 'list', [])
						this.loadingSale = false
					})
			},
			
			fetchParams() {
				let params = {
					type: this.info.tabbar.list[this.current].type
				}
				return params
			},
		}
	}
</script>

<style lang="less" scoped>
	.zx-goods-flash-sale-root {
		box-sizing: border-box;
		
		.zx-tabs-root {
			z-index: 990;
			position: sticky;
			top: 0;
			padding: @padding-xs;
			box-sizing: border-box;
			border-top-left-radius: @border-radius-base * 4;
			border-top-right-radius: @border-radius-base * 4;
			.flex-c();

			.zx-tabs-item {
				flex: 1;
				.flex-col-aic-jcc();

				.tabs-item-title {
					font-size: @font-size-xl;
					font-weight: 700;
				}

				.tabs-item-title-selected {
					color: @primary-color;
				}

				.tabs-item-subtitle {
					margin-top: @common-blank;
					font-size: @font-size-xxs;
					border-radius: 40rpx;
					padding: 0 @padding-xs / 2;
				}

				.tabs-item-subtitle-selected {
					background-color: @primary-color;
				}
			}
		}

		.goods-list-box {
			overflow: hidden;
			background-color: #FFFFFF;
			padding: @padding-xs;
			box-sizing: border-box;
			min-height: 680rpx;
		}
		
		.flash-sale-loading-box {
			overflow: hidden;
			background-color: #FFFFFF;
			padding: @padding-xs;
			box-sizing: border-box;
			min-height: 680rpx;
			.flex-c-aic-jcc();
		}
	}
</style>
