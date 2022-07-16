<template>
	<view class="nomore-root">
		<view class="nomore-content-box">
			<view class="nomore-line"></view>
			<view class="nomore-content">{{ $t('common.no.more') }}</view>
			<view class="nomore-line"></view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"zx-none",
		
		data() {
			return {
				
			}
		}
	}
</script>

<style lang="less" scoped>
	.nomore-root {
		padding: 0 @padding-xs * 2;
		box-sizing: border-box;
		background-color: transparent;
		height: 110rpx;
		
		.nomore-content-box {
			.flex-c-aic-jcc();
			.hper-100();
			
			.nomore-line {
				flex: 1;
				border-bottom: 1px solid #e9e9e9;
			}
			
			.nomore-content {
				padding: 0 @padding-xs * 2;
				box-sizing: border-box;
				font-size: @font-size-sm;
				color: @text-thirdly-color;
			}
		}
	}
</style>
