<template>
	<view v-if="loaded" class="common-page-root">
		<view class="common-page-box">
			<u-tabs :is-scroll="false" :list="tabsList" :current="tabCurrent" :active-color="themeColor" inactive-color="#666" @change="onTabsChange"></u-tabs>
			<view class="mescroll-box">
				<mescroll-uni :fixed="false" :safearea="true" @init="mescrollInit" @down="downCallback" @up="upCallback">
					<view class="common-mescroll-root">
						<view class="common-mescroll-box">
							
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
				performanceList: [],
				tabsList: [
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
				],
				tabCurrent: 0,
			}
		},
		
		onLoad() {
			
		},
		
		methods: {
			onTabsChange(index) {
				this.tabCurrent = index
			},
			
			mescrollInit(mescroll) {
				this.mescroll = mescroll
				this.mescroll.endSuccess(this.performanceList.length, this.hasNext)
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
