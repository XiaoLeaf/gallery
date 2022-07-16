<template>
	<view class="common-page-root">
		<block v-if="loaded">
			<zx-navbar background="#fff">
				<view slot="title" class="navbar-middle">
					<view class="middle-title">订单</view>
				</view>
			</zx-navbar>
			<view class="common-page-box" :style="{'padding-top': (statusH + 44) + 'px'}">
				<u-tabs :is-scroll="false" :list="tabList" :current="tabCurrent" inactive-color="#666" :active-color="themeColor" @change="onTabsChange"></u-tabs>
				<view class="mescroll-box">
					<mescroll-uni :fixed="false" :safearea="true" @init="mescrollInit" @down="downCallback" @up="upCallback">
						<view class="order-mescroll-root">
							<view class="order-mescroll-box">
								
							</view>
						</view>
					</mescroll-uni>
				</view>
			</view>
		</block>
		<block v-if="loadFail">
			<zx-error @retry="onClickRetry" :btnTxt="loginStatus ? $t('common.retry') : $t('common.login.first')"></zx-error>
		</block>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loaded: true,
				loadFail: false,
				mescroll: '',
				hasNext: false,
				page: 1,
				orderList: [],
				tabCurrent: 0,
				tabList: [
					{
						name: '全部'
					},
					{
						name: '待付款'
					},
					{
						name: '待收款'
					},
					{
						name: '待上架'
					},
					{
						name: '已售出'
					}
				]
			}
		},
		
		onLoad() {
			
		},
		
		methods: {
			onClickRetry() {
				
			},
			
			onTabsChange(index) {
				this.tabCurrent = index
			},
			
			mescrollInit(mescroll) {
				this.mescroll = mescroll
				this.mescroll.endSuccess(this.orderList.length, this.hasNext)
				if (!this.hasNext) {
					this.mescroll.hideUpScroll()
				}
			},
			
			downCallback() {
				this.page = 1
				setTimeout(() => {
					this.mescroll.endSuccess()
				}, 1500)
			},
			
			upCallback() {
				if (this.hasNext) {
					this.page++
				}
			}
		}
	}
</script>

<style lang="less">
	page {
		.hper-100();
		background-color: @background-color;
	}
</style>
