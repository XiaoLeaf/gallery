<template>
	<view v-if="loaded" class="example-root">
		<view class="example-box">
			<u-parse :html="exampleInfo.content" @linkpress.stop="onLinkPress" :selectable="true"></u-parse>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loaded: true,
				id: '',
				iden: '',
				is_preview: 0,
				exampleInfo: {},
			}
		},
		
		onLoad(options) {
			if (!options.scene) {
				this.id = options.id ? options.id: ''
				this.iden = options.iden ? options.iden : ''
			}
			this.fetchExampleInfo()
		},
		
		methods: {
			fetchExampleInfo() {
				this.$util.postRequest(this.$api.cms.page, this.fetchParameters(), true,
					res => {
						this.exampleInfo = res.data.row
						let that = this
						uni.setNavigationBarTitle({
							title: that.exampleInfo.title
						})
						this.loaded = true
					},
					err => {
						this.$util.showNoIconToast(err.info)
						setTimeout(() => {
							this.$util.navigateBack()
						}, 1500)
					})
			},
			
			fetchParameters() {
				let params = {
					id: this.id,
					iden: this.iden,
					is_preview: this.is_preview || 0
				}
				return params
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
			}
		}
	}
</script>

<style lang="less">
	page {
		.hper-100();
		background-color: @background-color;
	}
	
	.example-root {
		.hper-100();
		.pbsafe();
		
		.example-box {
			padding: @padding-xs;
			box-sizing: border-box;
			// .hper-100();
		}
	}
</style>
