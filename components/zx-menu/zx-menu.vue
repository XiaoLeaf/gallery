<template>
	<view class="menu-root" :style="{ 'background-color' : info.outer.bgColor, padding: info.outer.t * 2 + 'rpx ' + info.outer.lr * 2 + 'rpx ' + info.outer.b * 2 + 'rpx', 'color': info.font.color, 'font-size': info.font.size * 2 + 'rpx'}">
		<view class="menu-box" :style="{ 'border-radius' : info.inner.radius * 2 + 'rpx' , 'background-color' : info.inner.bgColor, padding: info.inner.t * 2 + 'rpx ' + info.inner.lr * 2 + 'rpx ' + info.inner.b * 2 + 'rpx'}">
			<view v-if="info.title.text || info.title.right.text" class="item-header" :style="{ 'color': info.title.color, 'font-size': info.title.size * 2 + 'rpx', padding: info.title.t * 2 + 'rpx ' + info.title.lr * 2 + 'rpx ' + info.title.b * 2 + 'rpx'}">
				<view v-if="info.title.text" class="header-title" :style="{ 'color': info.title.color }">{{ info.title.text }}</view>
				<view v-if="info.title.right.params.type == 1 && info.title.right.text" @click="onClickRightTitle" class="header-right" :style="{ 'color': info.title.right.color, 'font-size': info.title.right.size * 2 + 'rpx' }">
					<text>{{ info.title.right.text }}</text>
					<u-icon name="arrow-right" :color="info.title.right.color" :size="info.title.right.size * 2"></u-icon>
				</view>
				<button v-if="info.title.right.params.type == 2 && info.title.right.text" :open-type="info.title.right.params.url" class="header-right-btn" :style="{ 'color': info.title.right.color, 'font-size': info.title.right.size * 2 + 'rpx' }">
					<text>{{ info.title.right.text }}</text>
					<u-icon name="arrow-right" :color="info.title.right.color" :size="info.title.right.size * 2"></u-icon>
				</button>
				<navigator v-if="info.title.right.params.type == 3 && info.title.right.text" target="miniProgram" :app-id="info.title.right.params.appid" :path="info.title.right.params.url" hover-class="none" class="header-right" :style="{ 'color': info.title.right.color, 'font-size': info.title.right.size * 2 + 'rpx' }">
					<text>{{ info.title.right.text }}</text>
					<u-icon name="arrow-right" :color="info.title.right.color" :size="info.title.right.size * 2"></u-icon>
				</navigator>
			</view>
			<view class="menu-content">
				<block v-for="(item, index) in info.list" :key="index">
					<view v-if="item.params.type == 1" @click="onClickZxMenu(item)" class="menu-item" :style="{ 'width': (100 / info.cols) + '%', 'padding': info.inner.gap + 'rpx' }">
						<view class="item-img-box">
							<image webp="true" lazy-load="true" class="menu-img" :src="item.image" :style="{ 'width': info.image.size * 2 + 'rpx', 'height': info.image.size * 2 + 'rpx', 'border-radius': info.image.radius * 2 + 'rpx' }"></image>
							<u-badge v-if="item.badge.text" :is-center="true" :color="item.badge.color" :bgColor="item.badge.bgColor" :count="item.badge.text"></u-badge>
						</view>
						<view class="menu-name" :style="{ 'padding-top': info.inner.itgap * 2 + 'rpx' }">{{ item.text }}</view>
					</view>
					<button v-if="item.params.type == 2" :open-type="item.params.url" class="menu-btn" :style="{ 'width': (100 / info.cols) + '%', 'color': info.font.color, 'font-size': info.font.size * 2 + 'rpx', 'padding': info.inner.gap + 'rpx!important' }">
						<view class="item-img-box">
							<image webp="true" lazy-load="true" class="menu-img" :src="item.image" :style="{ 'width': info.image.size * 2 + 'rpx', 'height': info.image.size * 2 + 'rpx', 'border-radius': info.image.radius * 2 + 'rpx' }"></image>
							<u-badge v-if="item.badge.text" :is-center="true" :color="item.badge.color" :bgColor="item.badge.bgColor" :count="item.badge.text"></u-badge>
						</view>
						<view class="menu-name" :style="{ 'padding-top': info.inner.itgap * 2 + 'rpx' }">{{ item.text }}</view>
					</button>
					<navigator v-if="item.params.type == 3" target="miniProgram" :app-id="item.params.appid" :path="item.params.url" hover-class="none" class="menu-item" :style="{ 'width': (100 / info.cols) + '%', 'padding': info.inner.gap + 'rpx' }">
						<view class="item-img-box">
							<image webp="true" lazy-load="true" class="menu-img" :src="item.image" :style="{ 'width': info.image.size * 2 + 'rpx', 'height': info.image.size * 2 + 'rpx', 'border-radius': info.image.radius * 2 + 'rpx' }"></image>
							<u-badge v-if="item.badge.text" :is-center="true" :color="item.badge.color" :bgColor="item.badge.bgColor" :count="item.badge.text"></u-badge>
						</view>
						<view class="menu-name" :style="{ 'padding-top': info.inner.itgap * 2 + 'rpx' }">{{ item.text }}</view>
					</navigator>
				</block>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"zx-menu",
		
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
			onClickRightTitle() {
				if (this.info.title.right.params.url) {
					this.$util.miniAppRoute(this.info.title.right.params.url)
				}
			},
			
			onClickZxMenu(menu) {
				if (menu.params.url) {
					this.$util.miniAppRoute(menu.params.url)
				}
			}
		}
	}
</script>

<style lang="less">
	.menu-root {
		box-sizing: border-box;
		
		.menu-box {
			box-sizing: border-box;
			
			.item-header {
				.flex-c-aic-jcb();
				padding: 0 @padding-xs * 2;
				box-sizing: border-box;
				
				.header-title {
					color: @text-primary-color;
					font-size: @font-size-base;
				}
				
				.header-right {
					line-height: 40rpx;
					.flex-c-aic();
					color: @text-secondary-color;
					font-size: @font-size-sm;
				}
				
				.header-right-btn {
					line-height: normal;
					margin: 0;
					padding: 0;
					background-color: transparent;
					.flex-c-aic();
					
					&::after {
						border: none;
					}
				}
			}
			
			.menu-content {
				.flex-c();
				flex-wrap: wrap;
				color: @text-secondary-color;
				font-size: @font-size-sm;
				// padding: @padding-xs * 2 0;
					
				.menu-badge {
					position: absolute;
					top: -1.0em;
					right: .3em;
					width: -webkit-fill-available;
					font-size: @font-size-xxs!important;
				}
				
				.menu-item {
					position: relative;
					.flex-col-aic();
				}
				
				.item-img-box {
					position: relative;
				}
				
				.menu-img {
					width: 48rpx;
					height: 48rpx;
					display: block;
				}
				
				.menu-name {
					line-height: normal;
				}
				
				.menu-btn {
					overflow: unset!important;
					margin: 0!important;
					padding: 0!important;
					.flex-col-aic-jcc();
					background-color: transparent;
					
					&::after {
						border: none;
					}
				}
			}
		}
	}
</style>
