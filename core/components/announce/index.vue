<template>
	<view @click="onClickAnnounce" class="announce-item">
		<view v-if="announce.cover" class="img-box">
			<image class="announce-img" webp="true" lazy-load="true" mode="aspectFill" :src="announce.cover"></image>
		</view>
		<view class="item-content">
			<view class="title">{{ announce.title }}</view>
			<view class="item-footer">
				<view>{{ announce.s_time }}</view>
				<view>{{ $t('core.read') }} {{ announce.hits }}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			announce: {
				type: Object,
				default() {
					return {
						
					}
				}
			},
			navigateTo: {
				type: Boolean,
				default: true
			}
		},
		
		methods: {
			onClickAnnounce() {
				if (this.navigateTo) {
					this.$util.miniAppRoute('/core/pages/article/detail?id=' + this.announce.id)
				} else {
					this.$util.miniAppRoute('/core/pages/article/detail?id=' + this.announce.id, 3)
				}
				
			}
		}
	}
</script>

<style lang="less" scoped>
	.announce-item {
		background-color: #FFFFFF;
		padding: @padding-xs;
		box-sizing: border-box;
		margin-top: @common-blank;
		.flex-c-aic();
		
		.img-box {
			padding-right: @padding-xs;
			
			.announce-img {
				width: 100rpx;
				height: 100rpx;
				border-radius: @border-radius-base;
				overflow: hidden;
			}
		}
		
		.item-content {
			.flex-col-jca();
			flex: 1;
			overflow: hidden;
			
			.title {
				.line-2();
				color: @text-primary-color;
				font-size: @font-size-medium;
			}
			
			.item-footer {
				.flex-c-aic-jcb();
				padding: @padding-xs / 2;
				color: @text-secondary-color;
				font-size: @font-size-xxs;
			}
		}
	}
</style>
