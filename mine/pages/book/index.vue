<template>
	<view v-if="loaded" class="common-page-root">
		<view class="common-page-box">
			<view class="form-root">
				<view class="form-content-box">
					<view class="form-content-title">画室信息</view>
					<view class="form-content-item">
						<view class="item-left">
							<view>画室名称</view>
						</view>
						<view class="item-right">
							<view class="right-value">秦韵画室</view>
						</view>
					</view>
					<view class="form-content-item">
						<view class="item-left">
							<view>画室状态</view>
						</view>
						<view class="item-right">
							<view class="right-value">营业中</view>
						</view>
					</view>
					<view class="form-content-item">
						<view class="item-left">
							<view>营业时间</view>
						</view>
						<view class="item-right">
							<view class="right-value">10:00-22:00</view>
						</view>
					</view>
				</view>
				<view class="form-content-box">
					<view class="form-content-title">预约范围</view>
					<radio-group>
						<label v-for="(item, index) in 4" :key="index" class="form-content-item">
							<view class="item-left">
								<view>价值范围</view>
							</view>
							<view class="item-right">
								<view class="right-value radio-right-val">2000-3000</view>
								<radio style="transform: scale(.8);"></radio>
							</view>
						</label>
					</radio-group>
				</view>
				<view class="form-submit-box">
					<button @click="onClickSubmit" class="submit-btn" :style="indexConfig ? indexConfig.btnStyle.primary : ''">{{ $t('common.submit') }}</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loaded: true,
				bookForm: {
					
				}
			}
		},
		
		onLoad() {
			
		},
		
		methods: {
			onClickSubmit() {
				
			}
		}
	}
</script>

<style lang="less">
	page {
		.hper-100();
		background-color: @background-color;
	}
	
	/deep/ .u-flex-1 {
		flex: 1;
	}
	
	/deep/ .u-field {
		padding: 0!important;
	}
	
	.common-page-box {
		overflow: auto!important;
	}
	
	.form-root {
		padding: @padding-xs;
		box-sizing: border-box;
		.wper-100();
		
		.form-content-box {
			background-color: #fff;
			border-radius: @border-radius-base * 2;
			overflow: hidden;
			padding: @padding-xs;
			box-sizing: border-box;
			.wper-100();
			
			&:not(:first-child) {
				margin-top: @common-blank * 2;
			}
			
			.form-content-title {
				color: @text-secondary-color;
				font-size: @font-size-sm;
			}
			
			.form-content-item {
				.flex-c-aic();
				.wper-100();
				position: relative;
				padding: @padding-xs + 10rpx 0;
				
				&:not(:last-child)::after {
					position: absolute;
					bottom: 0;
					left: 0;
					.wper-100();
					height: 1px;
					background-color: #f1f1f1;
					content: '';
				}
				
				.item-left {
					.flex-c-aic();
					color: @text-primary-color;
					font-size: @font-size-base;
					
					.icon-box {
						margin-right: @common-blank;
					}
				}
				
				.item-right {
					padding-left: @padding-xs;
					box-sizing: border-box;
					flex: 1;
					overflow: hidden;
					.flex-c-aic-jce();
					
					.right-value {
						color: @text-thirdly-color;
						font-size: @font-size-medium;
					}
					
					.radio-right-val {
						margin-right: @common-blank * 2;
					}
					
					.upload-img {
						width: 120rpx;
						height: 120rpx;
						border-radius: @border-radius-base * 2;
						overflow: hidden;
						vertical-align: middle;
					}
					
					.item-upload {
						width: 120rpx;
						height: 120rpx;
						border-radius: @border-radius-base * 2;
						overflow: hidden;
						.flex-col-aic-jcc();
						color: @text-thirdly-color;
						border: 2rpx dashed #e1e1e1;
					}
				}
			}
			
			.form-captcha-item {
				.flex-c-aic();
				.wper-100();
				position: relative;
				padding: @padding-xs + 10rpx 0;
				
				&:not(:last-child)::after {
					position: absolute;
					bottom: 0;
					left: 0;
					.wper-100();
					height: 1px;
					background-color: #f1f1f1;
					content: '';
				}
				
				.captcha-item-left {
					flex: 1;
					overflow: hidden;
					padding-right: @padding-xs;
					box-sizing: border-box;
				}
				
				.captcha-item-right {
					
					.content-img {
						margin-left: 25rpx;
						width: 180rpx;
						height: 60rpx;
						border-radius: 12rpx;
						overflow: hidden;
						vertical-align: middle;
						background-color: @primary-color;
					}
					
					.code-btn {
						padding: 0 @padding-xs;
						.flex-c-aic-jcc();
						margin: 0;
						background-color: transparent;
						line-height: 50rpx;
						color: @primary-color;
						width: auto;
						font-size: @font-size-sm;
						font-weight: normal;
									
						&::after {
							border: none;
						}
					}
				}
			}
		}
	
		.form-submit-box {
			margin: @common-blank * 2 0 100rpx;
			
			.submit-btn {
				.wper-100();
				line-height: 80rpx;
				border-radius: @border-radius-base * 2;
				overflow: hidden;
				padding: 0;
				margin: 0;
				color: #fff;
				background-color: @primary-color;
				font-size: @font-size-lg;
				
				&::after {
					border: none;
				}
			}
		}
	}
</style>
