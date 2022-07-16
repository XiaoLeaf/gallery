<template>
	<view v-if="loaded" class="page-root address-root">
		<view class="address-box">
			<view class="mescroll-box">
				<mescroll-uni :fixed="false" :safearea="true" @init="mescrollInit" @down="downCallback" @up="upCallback">
					<view class="address-list-root">
						<view class="address-list-box">
							<block v-if="addressList.length <= 0">
								<zx-empty></zx-empty>
							</block>
							<block v-else>
								<u-swipe-action @click="onClickAddressCellDelete(index, item)" bg-color="transparent"
									v-for="(item, index) in addressList" :key="index" :options="options">
									<view class="address-item-box">
										<view @click="onClickAddressItem(item)" class="address-item">
											<view class="item-content">
												<view class="item-user">
													<view class="realname">{{ item.realname }}</view>
													<view class="tel">{{ item.coungry_tel }}</view>
													<view v-if="item.is_def == 1" class="def-tag">
														<u-tag size="mini" mode="dark" :text="$t('common.default')" shape="circle" :bg-color="themeColor"></u-tag>
													</view>
												</view>
												<view class="item-ntf">NFT: {{ item.nft }}</view>
												<view class="address">{{ item.address }}</view>
											</view>
											<view @click.stop="onClickEditIcon(item)" class="edit-box">
												<u-icon name="edit-pen" color="#999" size="30"></u-icon>
											</view>
										</view>
									</view>
								</u-swipe-action>
							</block>
						</view>
					</view>
				</mescroll-uni>
			</view>
			<view class="address-footer">
				<view class="address-footer-box">
					<button @click="onClickAddAddress" :style="indexConfig ? indexConfig.btnStyle.primary : ''"
						class="add-btn">{{ $t('my.add.address') }}</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loaded: false,
				mescroll: '',
				page: 1,
				hasNext: false,
				addressList: [],
				keyword: '',
				options: [{
					text: "",
					style: {
						backgroundColor: '#f00'
					}
				}],
			}
		},

		onLoad() {
			this.$set(this.options[0], 'text', this.$t('common.delete'))
			this.fetchAddressList(true)
		},
		
		onShow() {
			uni.$on('addressChange', (res) => {
				this.page = 1
				this.fetchAddressList(false)
			})
		},

		methods: {
			onAddressSearch() {

			},

			mescrollInit(mescroll) {
				this.mescroll = mescroll
				this.mescroll.endSuccess(this.addressList.length, this.hasNext)
				if (!this.hasNext) {
					this.mescroll.hideUpScroll()
				}
			},

			downCallback() {
				this.page = 1
				this.fetchAddressList(false)
			},

			upCallback() {
				if (this.hasNext) {
					this.page++
					this.fetchAddressList(false)
				}
			},

			fetchAddressList(loading) {
				this.$util.postRequest(this.$api.ud.addr, this.fetchParams(), loading,
					res => {
						this.hasNext = Boolean(res.data.hasNext)
						if (this.mescroll) {
							this.mescroll.endSuccess(res.data.list.length, this.hasNext)
							if (!this.hasNext) {
								this.mescroll.hideUpScroll()
							}
						}
						this.addressList = this.page == 1 ? res.data.list : this.addressList.concat(res.data.list)
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
					page: this.page
				}
				return params
			},

			onClickAddressCellDelete(index, address) {
				let that = this
				uni.showModal({
					title: that.$t('common.warm.prompt'),
					content: that.$t('my.address.del.warning'),
					confirmColor: that.themeColor,
					confirmText: that.$t('common.confirm'),
					cancelColor: '#999999',
					cancelText: that.$t('common.cancel'),
					success(res) {
						if (res.confirm) {
							let parameters = {}
							parameters.act = 'del'
							parameters.id = address.id
							that.$util.postRequest(that.$api.ud.addr_opt, parameters, true,
								res => {
									let list = that.addressList
									list.splice(index, 1)
									that.addressList = list
								},
								err => {
									that.$util.showNoIconToast(err.info)
								})
						}
					}
				})
			},

			onClickAddressItem(address) {

			},

			onClickEditIcon(address) {
				this.$util.miniAppRoute('/mine/pages/address/edit?id=' + address.id)
			},

			onClickAddAddress() {
				this.$util.miniAppRoute('/mine/pages/address/add')
			}
		}
	}
</script>

<style lang="less">
	page {
		.hper-100();
		background-color: @background-color;
	}

	.address-root {

		.address-box {
			.hper-100();
			box-sizing: border-box;
			.flex-col();

			.search-box {
				background-color: #FFFFFF;
				padding: @padding-xs;
				box-sizing: border-box;
			}

			.address-list-root {
				.pbsafe();
				overflow: hidden;

				.address-list-box {
					padding: @padding-xs @padding-xs 0;
					box-sizing: border-box;
					overflow: hidden;

					/deep/ .u-swipe-action {
						width: 100%;
						margin-bottom: @common-blank * 2;
					}
					
					/deep/ .u-flex-1 {
						flex: 1;
					}

					.address-item-box {
						width: 100%;

						.address-item {
							width: 100%;
							background-color: #FFFFFF;
							border-radius: @border-radius-base;
							.flex-c-aic-jcb();
							padding: @padding-xs;
							box-sizing: border-box;
							overflow: hidden;

							.item-content {
								flex: 1;
								padding-right: @padding-xs;
								box-sizing: border-box;

								.item-user {
									.flex-c-aic();
									padding-bottom: @padding-xs;

									.realname {
										color: @text-primary-color;
										font-size: @font-size-base;
										padding-right: @padding-xs;
									}

									.tel {
										color: @text-secondary-color;
										font-size: @font-size-sm;
									}

									.def-tag {
										padding-left: @padding-xs / 2;
									}
								}
								
								.item-ntf {
									padding-bottom: @padding-xs;
									color: @text-primary-color;
									font-size: @font-size-base;
								}

								.address {
									color: @text-primary-color;
									font-size: @font-size-sm;
									.line-2();
									overflow: hidden;
								}
							}

							.edit-box {
								padding-right: @padding-xs;
							}
						}
					}
				}
			}

			.address-footer {
				background-color: #FFFFFF;
				.wper-100();
				box-sizing: border-box;
				.pbsafe();

				.address-footer-box {
					padding: @padding-xs;
					box-sizing: border-box;

					.add-btn {
						.flex-c-aic-jcc();
						color: #FFFFFF;
						font-size: @font-size-base;
						background-color: @primary-color;
						border-radius: @border-radius-base;
						line-height: 80rpx;
						width: 100%;
						box-sizing: border-box;

						&::after {
							border: none;
						}
					}
				}
			}
		}
	}
</style>
