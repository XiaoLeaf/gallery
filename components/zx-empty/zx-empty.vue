<template>
	<view class="root" :class="[type == 'logistics' ? 'pt50' : type == 'falshSale' ? 'pt0' : 'pt100']">
		<image webp="true" lazy-load="true" mode="aspectFit" class="empty-img" :src="emptyImage"></image>
		<view class="empty-txt">{{ emptyText }}</view>
	</view>
</template>

<script>
	export default {
		name:"zx-empty",
		
		props: {
			type: {
				type: String,
				default: ''
			}
		},
		
		computed: {
			emptyImage() {
				// let imageJson = {
				// 	default: '/static/images/gengral_empty.png',
				// 	order: '/static/images/order_empty.png',
				// 	cart: '/static/images/cart_empty.png',
				// 	address: '/static/images/address_empty.png',
				// 	fav: '/static/images/fav_empty.png',
				// 	footprint: '/static/images/fav_empty.png',
				// 	logistics: '/static/images/gengral_empty.png'
				// }
				// if (this.indexConfig) {
				// 	imageJson = this.indexConfig.emptyImage
				// }
				// return imageJson[this.type] || imageJson['default']
				return '/static/images/empty.png'
			},
			
			emptyText() {
				let textJson = {
					default: '',
					order: '暂无订单',
					cart: '购物车为空',
					address: '暂无收货地址',
					fav: '暂无收藏',
					footprint: '暂无足迹',
					logistics: ''
				}
				return textJson[this.type] || textJson['default']
			},
			
			showEmptyBtn() {
				let showbtn = false
				let showList = ['order', 'cart']
				if (showList.includes(this.type)) {
					showbtn = true
				}
				return showbtn
			}
		},
		
		data() {
			return {
				
			}
		},
		
		methods: {
			onClickEmptyBtn() {
				// console.log('config====>',JSON.stringify(this.indexConfig))
				this.$util.miniAppRoute('/pages/index/index')
			}
		}
	}
</script>

<style lang="less" scoped>
	
	.pt50 {
		padding-top: 100rpx;
	}
	
	.pt100 {
		padding-top: 200rpx;
	}
	
	.pt0 {
		padding-top: 0;
	}
	
	.root {
		width: 100%;
		height: 100%;
		.flex-col-aic();
		box-sizing: border-box;
		font-size: @font-size-base;
		
		.empty-img {
			width: 300rpx;
			height: 300rpx;
		}
		
		.empty-txt {
			color: @text-thirdly-color;
			font-size: @font-size-sm;
		}
		
		.empty-btn {
			width: 300rpx;
			font-size: @font-size-medium;
			font-weight: normal;
			line-height: 60rpx;
			color: #FFFFFF;
			background-color: @red-color;
			margin: 40rpx 0 0;
			border-radius: 100rpx;
			overflow: hidden;
			padding: 0;
			
			&::after {
				border: none;
			}
		}
	}
</style>
