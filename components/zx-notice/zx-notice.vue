<template>
	<view class="root" :style="{ 'background-color' : info.outer.bgColor, padding: info.outer.t * 2 + 'rpx ' + info.outer.lr * 2 + 'rpx ' + info.outer.b * 2 + 'rpx'}">
		<view class="inner-view" :style="{ 'background-color' : info.inner.bgColor, height : info.font.height * 2 + 'rpx', padding: info.inner.t * 2 + 'rpx ' + info.inner.lr * 2 + 'rpx ' + info.inner.b * 2 + 'rpx'}">
			<view class="notice-box" :style="{ 'border-radius': info.inner.radius * 2 + 'rpx' }">
				<u-notice-bar type="none" @click="onClickZxNotice(info.content)" :color="info.font.color" :bg-color="info.inner.bgColor" :list="[info.content.text]"></u-notice-bar>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"zx-notice",
		
		props: {
			info: {
				type: Object,
				default() {
					return {
						
					}
				}
			}
		},
		
		data() {
			return {
				
			}
		},
		
		methods: {
			onClickZxNotice(content) {
				if (content.url) {
					this.$util.miniAppRoute(content.url)
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	.root {
		box-sizing: border-box;
		
		.inner-view {
			box-sizing: border-box;
			.flex-c-aic();
			
			.notice-box {
				flex: 1;
				overflow: hidden;
			}
		}
	}
</style>
