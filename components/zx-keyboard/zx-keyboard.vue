<template>
	<view class="keyboard-root">
		<view @click.stop="onClickKeyboardItem(item)" v-for="(item,index) in dataList" :key="item" :style="{'padding-left': index % 3 == 0 ? '0rpx' : '1rpx', 'padding-right': index % 3 == 2 ? '0rpx' : '1rpx', 'padding-bottom': '2rpx'}" class="num-box">
			<view class="num-item" :class="{'bg-w': index != 9}">{{ item }}</view>
		</view>
		<view @click.stop="onClickKeyboardDelete" class="delete-box">
			<image class="delete" webp="true" lazy-load="true" src="/static/images/keyboard_delete.png" mode="aspectFit"></image>
		</view>
	</view>
</template>

<script>
	export default {
		name:"zx-keyboard",
		
		data() {
			return {
				randomList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
				dataList: [1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0],
			}
		},
		
		methods: {
			fetchRadomList() {
				let count = 10
				let original = []
				for (let index = 0; index < count; index++) {
					original[index] = index
				}
				original.sort(function() {
					return 0.5 - Math.random()
				})
				this.randomList = original
			},
			
			onClickKeyboardItem(num) {
				if (num !== '') {
					this.$emit('click', num)
				}
			},
			
			onClickKeyboardDelete() {
				this.$emit('delete')
			}
		}
	}
</script>

<style lang="less">
	.keyboard-root {
		width: 100%;
		margin-top: 40rpx;
		border-top: 1rpx solid @border-color;
		border-bottom: 1rpx solid @border-color;
		background-color: @border-color;
		.flex-c();
		flex-wrap: wrap;
		
		.num-box {
			height: 100rpx;
			width: 33.33%;
			font-weight: 600;
			border-radius: @border-radius-base + 2rpx;
			overflow: hidden;
			box-sizing: border-box;
			background-color: transparent;
			text-align: center;
			color: @text-primary-color;
			
			.num-item {
				width: 100%;
				height: 100%;
				.flex-c-aic-jcc();
			}
			
			.bg-w {
				background-color: #FFFFFF;
			}
		}
		
		.delete-box {
			padding: 36rpx 0;
			width: 33.33%;
			height: 100rpx;
			border-radius: @border-radius-base + 2rpx;
			overflow: hidden;
			box-sizing: border-box;
			text-align: center;
			
			.delete {
				width: 100%;
				height: 100%;
			}
		}
	}
</style>
