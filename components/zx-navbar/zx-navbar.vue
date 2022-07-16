<template>
	<view class="navbar-root" style="position:fixed; top: 0; left: 0;" :style="{'opacity': opacity, 'padding-top': capsule ? capsule.top + 'px' : statusH + 'px', 'background-color': background ? background : '#fff', 'height': capsule ? capsule.top + 44 - 4 + 'px' : (statusH + 44) + 'px', 'padding-right': (capsule.width + 20) + 'px' }">
		<view :style="{'max-width': capsule ? (capsule.width + 20) + 'px' : '110px'}" class="left-box">
			<view class="left-content">
				<slot name="left"></slot>
			</view>
		</view>
		<view class="title-box">
			<view class="title-content">
				<slot name="title"></slot>
			</view>
		</view>
		<!-- #ifndef MP-WEIXIN -->
		<view :style="{'max-width': capsule ? (capsule.width + 20) + 'px' : '110px'}" class="right-box">
			<view class="right-content">
				<slot name="right"></slot>
			</view>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
	export default {
		name:"zx-navbar",
		
		props: {
			background: {
				type: String,
				default: ''
			},
			
			back: {
				type: Boolean,
				default: true
			},
			
			opacity: {
				type: Number,
				default: 1
			},
			
			backColor: {
				type: String,
				default: 'white'
			}
		},
		
		data() {
			return {
				
			}
		},
		
		created() {
			
		},
		
		methods: {
			onClickBack() {
				this.$util.navigateBack()
			}
		}
	}
</script>

<style lang="less">
	.navbar-root {
		box-sizing: border-box;
		z-index: 999;
		.flex-c-aic();
		width: 100%;
		
		.left-box {
			height: 100%;
			line-height: 32px;
			/* #ifndef MP-WEIXIN */
			.flex-c-aic();
			/* #endif */
			
			.left-content {
				width: 100%;
				height: 32px;
				.flex-c-aic();
				.line-1();
				// overflow: hidden;
				
				.back-icon {
					width: 32px;
					height: 32px;
					vertical-align: middle;
					margin-left: @common-blank * 2;
				}
			}
		}
		
		.title-box {
			flex: 1;
			height: 100%;
			line-height: 32px;
			/* #ifndef MP-WEIXIN */
			.flex-c-aic();
			/* #endif */
			
			.title-content {
				width: 100%;
				height: 32px;
				.flex-c-aic();
			}
		}
		
		.right-box {
			.hper-100();
			/* #ifdef MP-WEIXIN */
			line-height: 32px;
			/* #endif */
			/* #ifndef MP-WEIXIN */
			.flex-c-aic();
			/* #endif */
			
			.right-content {
				.wper-100();
				/* #ifdef MP-WEIXIN */
				height: 32px;
				/* #endif */
				.flex-c-aic();
				.line-1();
			}
		}
	}
</style>
