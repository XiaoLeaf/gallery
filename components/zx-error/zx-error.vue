<template>
	<view class="root">
		<image lazy-load="true" webp="true" class="error-img" mode="aspectFill" src="/static/images/error.png"></image>
		<view class="btn-box">
			<button @click="onClickRetry" hover-class="none" class="error-btn">{{ btnTxt }}</button>
		</view>
	</view>
</template>

<script>
	export default {
		name:"zx-error",
		
		props: {
			btnTxt: {
				type: String,
				default() {
					return this.$t('common.retry')
				}
			}
		},
		
		data() {
			return {
				
			}
		},
		
		methods: {
			onClickRetry() {
				this.$emit('retry')
			}
		}
	}
</script>

<style lang="less" scoped>
	.root {
		height: 100%;
		.flex-col-aic-jcc();
		
		.error-img {
			width: 300rpx;
			height: 300rpx;
			display: block;
		}
		
		.btn-box {
			margin-top: @padding-xs * 2;
				
			.error-btn {
				width: 300rpx;
				font-size: @font-size-medium;
				background-color: @red-color;
				line-height: 60rpx;
				color: #FFFFFF;
				border-radius: 100rpx;
				overflow: hidden;
				padding: 0;
				margin: 0;
				
				&::after {
					border: none;
				}
			}
		}
	}
</style>
