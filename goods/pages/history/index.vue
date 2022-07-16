<template>
	<view v-if="loaded" class="page-root common-page-root join-history-root">
		<view class="common-page-box">
			<view class="mescroll-box">
				<mescroll-uni :fixed="false" :safearea="true" @init="mescrollInit" @down="downCallback" @up="upCallback">
					<view class="common-mescroll-root">
						<view class="common-mescroll-box">
							<block v-if="recordList.length <= 0">
								<zx-empty></zx-empty>
							</block>
							<block v-else>
								<view @click="onClickJoinItem(item)" v-for="(item, index) in recordList" :key="index" class="join-item">
									<image webp="true" lazy-load="true" class="goods-cover" mode="aspectFill" :src="item.cover"></image>
									<view class="item-box">
										<view class="goods-title">{{ item.title }}</view>
										<view class="price-box">
											<view class="goods-price">{{ item.price }}</view>
											<view :class="[item.status == 2 ? 'status-ing' : 'status-end']">{{ item.statusStr }}</view>
										</view>
										<view class="join-num-box">
											<view class="join-num">{{ item.no }}</view>
											<view class="progress-box">
												<u-line-progress :active-color="themeColor" inactive-color="#f1f1f1" :striped-active="true" :show-percent="false" :striped="true" :height="14" :percent="item.per"></u-line-progress>
											</view>
											<view class="join-num"><text class="num-txt">{{ item.in_num }}/{{ item.num }}</text></view>
										</view>
										<view v-if="item.status == 1" class="group-time-box">{{ $t('goods.end.time') }}:<text class="time-str">{{ item.e_time }}</text></view>
										<view class="group-red-bag">{{ item.rewardStr }}</view>
									</view>
								</view>
								<zx-none v-if="!hasNext"></zx-none>
							</block>
						</view>
					</view>
				</mescroll-uni>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loaded: true,
				mescroll: '',
				page: 1,
				hasNext: false,
				gid: 0,
				recordList: []
			}
		},

		onLoad(options) {
			this.gid = options.gid ? options.gid : 0
			this.fetchGbHistory(true)
		},

		methods: {
			mescrollInit(mescroll) {
				this.mescroll = mescroll
				this.mescroll.endSuccess(this.recordList.length, this.hasNext)
				if (!this.hasNext) {
					this.mescroll.hideUpScroll()
				}
			},

			downCallback() {
				this.page = 1
				this.fetchGbHistory(false)
			},

			upCallback() {
				if (this.hasNext) {
					this.page++
					this.fetchGbHistory(false)
				}
			},

			fetchGbHistory(loading) {
				this.$util.postRequest(this.$api.goods.gb_history, this.fetchParams(), loading,
					res => {
						this.hasNext = Boolean(res.data.hasNext)
						if (this.mescroll) {
							this.mescroll.endSuccess(res.data.list.length, this.hasNext)
							if (!this.hasNext) {
								this.mescroll.hideUpScroll()
							}
						}
						this.recordList = this.page == 1 ? res.data.list : this.recordList.concat(res.data.list)
						this.loaded = true
					},
					err => {
						this.$util.showNoIconToast(err.info)
						if (this.mescroll) {
							this.mescroll.endErr()
						}
						if (this.page == 1) {
							setTimeout(() => {
								uni.navigateBack({
									delta: 1
								})
							}, 1500)
						} else {
							this.page--
						}
					})
			},

			fetchParams() {
				let params = {
					page: this.page,
					gid: this.gid
				}
				return params
			},
			
			onClickJoinItem(item) {
				this.$util.miniAppRoute('/goods/pages/detail/index?gb_id=' + item.id + '&gid=' + item.gid)
			},
		}
	}
</script>

<style lang="less">
	page {
		.hper-100();
		background-color: @background-color;
	}

	.join-history-root {

		.common-mescroll-box {
			padding: 0 @padding-xs / 2 !important;
			overflow: hidden;
		}

		.join-item {
			background-color: #fff;
			padding: @padding-xs;
			box-sizing: border-box;
			.flex-c();
			align-items: stretch;
			margin-bottom: @common-blank;
			border-radius: @border-radius-base * 2;
			overflow: hidden;

			&:first-child {
				margin-top: @common-blank;
			}

			.goods-cover {
				height: 200rpx;
				width: 200rpx;
				border-radius: @border-radius-base * 2;
				overflow: hidden;
				vertical-align: middle;
				background-color: @primary-color;
			}

			.item-box {
				padding-left: @padding-xs / 2;
				box-sizing: border-box;
				flex: 1;
				overflow: hidden;
				.flex-col-jca();

				.goods-title {
					.line-1();
					color: @text-primary-color;
					font-size: @font-size-medium;
				}

				.price-box {
					color: @red-color;
					font-size: @font-size-xs;
					.flex-c-aic-jcb();

					.goods-price {
						.num-ff();
						font-size: @font-size-sm;
						font-weight: 500;
					}

					.status-ing {
						color: @red-color;
					}

					.status-end {
						color: @text-thirdly-color;
					}
				}
			}

			.join-num-box {
				.flex-c-aic();
				color: @text-thirdly-color;
				font-size: @font-size-xxs;

				.join-num {

					.num-txt {
						padding-left: @padding-xs / 2;
						color: @red-color;
						.num-ff();
					}
				}

				.progress-box {
					flex: 1;
					padding-left: @padding-xs / 2;
					overflow: hidden;
				}
			}

			.group-time-box {
				color: @text-thirdly-color;
				font-size: @font-size-xxs;

				.time-str {
					padding-left: @padding-xs / 3;
				}
			}

			.group-red-bag {
				width: fit-content;
				color: @red-color;
				font-size: @font-size-xxs;
				// background-color: @red-color;
				border-radius: 100rpx;
				overflow: hidden;
				line-height: 32rpx;
			}
		}
	}
</style>
