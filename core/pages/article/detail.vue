<template>
	<view v-if="loaded" class="detail-root">
		<view class="title" @longpress="onLongpressTitle">{{ detailInfo.row.title }}</view>
		<view class="desc">{{ detailInfo.row.desc }}</view>
		<view class="announce-footer">
			<view>{{ detailInfo.row.author }}<text class="s-time">{{ detailInfo.row.s_time}}</text></view>
			<view>{{ $t('core.read') }} {{ detailInfo.row.hits }}</view>
		</view>
		<view class="announce-content">
			<u-parse :html="detailInfo.row.content" :selectable="true" @linkpress="onLinkPress"></u-parse>
		</view>
		<view v-if="detailInfo.rel_list.length > 0" class="rel-box">
			<view class="rel-title">{{ $t('core.article.relate') }}</view>
			<block v-for="(item, index) in detailInfo.rel_list" :key="item.id">
				<announce :announce="item" :navigateTo="false"></announce>
			</block>
		</view>
	</view>
</template>

<script>
	import announce from '@/core/components/announce/index.vue'
	export default {
		components: {
			announce
		},

		data() {
			return {
				loaded: false,
				id: '',
				is_preview: 0,
				detailInfo: '',
			}
		},

		onLoad(options) {
			if (!options.scene) {
				this.id = options.id ? options.id : 111
			}
			this.fetchAnnounceItem()
		},
		
		onShareAppMessage() {
			let path = '/core/pages/article/detail'
			let list = []
			if (this.id) {
				list.push('id=' + this.id)
			}
			if (this.is_preview) {
				list.push('is_preview=' + this.is_preview)
			}
			path = path + '?' + list.join('&')
			path = this.$util.commonShareConfig(path)
			return {
				path: path,
				title: this.detailInfo.row.title,
				imageUrl: this.detailInfo.row.shareCover || ''
			}
		},
		
		onShareTimeline() {
			let query = {}
			if (this.id) {
				query.id = this.id
			}
			if (this.is_preview) {
				query.is_preview = this.is_preview
			}
			query = this.$util.fetchTimeLineQuery(query)
			return {
				query: query,
				title: this.detailInfo.row.title,
				imageUrl: this.detailInfo.row.shareCover || ''
			}
		},

		methods: {
			fetchAnnounceItem() {
				this.$util.postRequest(this.$api.cms.item, {
						id: this.id
					}, true,
					res => {
						this.detailInfo = res.data
						uni.setNavigationBarTitle({
							title: res.data.row.title
						})
						this.loaded = true
					},
					err => {
						this.$util.showNoIconToast(err.info)
						setTimeout(() => {
							uni.navigateBack({
								delta: 1
							})
						}, 1500)
					})
			},
			
			onLinkPress(event) {
				// #ifdef MP-WEIXIN
				let url = event.href
				if (url) {
					if (url.substring(0, 4) == 'http') {
						this.$util.miniAppRoute('/core/pages/webview/index?url=' + encodeURIComponent(url))
					} else {
						this.$util.miniAppRoute(url)
					}
				}
				// #endif
			},
			
			onLongpressTitle() {
				let that = this
				uni.setClipboardData({
					data: that.detailInfo.row.title,
					success: res => {
						that.$util.showNoIconToast(that.$t('common.copy.success'))
					}
				})
			}
		}
	}
</script>

<style lang="less">
	page {
		.hper-100();
		background-color: @background-color;
	}

	.detail-root {
		.hper-100();
		.pbsafe();
		.flex-col-aic();
		padding-top: @common-blank;
		
		.title {
			color: @text-primary-color;
			background-color: #FFFFFF;
			.wper-100();
			font-size: @font-size-xxxl;
			padding: @padding-xs;
			box-sizing: border-box;
			font-weight: 500;
		}
		
		.desc {
			color: @text-secondary-color;
			background-color: #FFFFFF;
			.wper-100();
			font-size: @font-size-sm;
			padding: 0 @padding-xs;
			box-sizing: border-box;
		}
		
		.announce-footer {
			.flex-c-aic-jcb();
			background-color: #FFFFFF;
			padding: 0 @padding-xs;
			.wper-100();
			box-sizing: border-box;
			color: @text-secondary-color;
			font-size: @font-size-xxs;
			align-self: flex-start;
			
			.s-time {
				padding-left: @padding-xs;
			}
		}
		
		.announce-content {
			.wper-100();
			background-color: #FFFFFF;
			padding: @padding-xs;
			box-sizing: border-box;
		}
		
		.rel-box {
			.wper-100();
			padding: @padding-xs * 2 0 @padding-xs;
			
			.rel-title {
				.wper-100();
				text-align: center;
				color: @text-primary-color;
				font-weight: 500;
				font-size: @font-size-lg;
				padding-bottom: @padding-xs;
			}
		}
	}
</style>
