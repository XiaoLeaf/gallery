<template>
	<view class="root" :style="{ color: info.font.color , 'background-color' : info.outer.bgColor, padding: info.outer.t * 2 + 'rpx ' + info.outer.lr * 2 + 'rpx ' + info.outer.b * 2 + 'rpx'}">
		<view class="inner-view" :style="{ 'background-color' : info.inner.bgColor, padding: info.inner.t * 2 + 'px ' + info.inner.lr * 2 + 'rpx ' + info.inner.b * 2 + 'rpx', height : info.font.height * 2 + 'rpx', 'border-radius' : info.inner.radius * 2 + 'rpx'}">
			<view v-if="info.font.icon" class="img-box">
				<image :src="info.font.iconUrl" mode="heightFix" lazy-load="true" webp="true" :style="{ height : info.font.height * 2 + 'rpx'}"></image>
			</view>
			<view v-else class="icon-box">
				<u-icon custom-prefix="zx-icon" name="notice" size="32" color="#333"></u-icon>
			</view>
			<view class="swiper-box">
				<swiper :style="{ height : info.font.height * 2 + 'rpx'}" vertical="true" autoplay="true" circular="true" interval="3000" easing-function="linear">
					<swiper-item @click="onClickZxNews(item)" v-for="(item, index) in info.list" :key="index">
						<view class="item-view" :style="{ 'line-height' : info.font.height * 2 + 'rpx', color : (item.color ? item.color : info.font.color), 'font-size' : info.font.size * 2 + 'rpx'}">{{ item.title }}</view>
					</swiper-item>
				</swiper>
			</view>
			<view @click="onClickMoreNews(info.params)" class="more-box">
				<u-icon :color="info.font.color" size="28" name="arrow-right"></u-icon>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"zx-news",
		
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
			onClickZxNews(news) {
				if (news && news.id) {
					this.$util.miniAppRoute('/core/pages/article/detail?id=' + news.id)
				}
			},
			
			onClickMoreNews() {
				this.$emit('more')
				if (this.info.params && this.info.params.id) {
					this.$util.miniAppRoute('/core/pages/article/index?cid=' + this.info.params.id)
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
			overflow: hidden;
			
			.img-box {
				.flex-col-aic();
			}
			
			.icon-box {
				padding-left: @padding-xs;
			}
			
			.swiper-box {
				flex: 1;
				
				.item-view {
					padding-left: 20rpx;
					.line-1();
					overflow: hidden;
					box-sizing: border-box;
					height: 100%;
				}
			}
			
			.more-box {
				padding: 0 @padding-xs 0 0;
				box-sizing: border-box;
				.flex-c-aic();
			}
		}
	}
</style>
