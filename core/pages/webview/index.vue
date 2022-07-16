<template>
	<view class="webview-root">
		<web-view :src="url"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url: '',
			}
		},
		
		onLoad(options) {
			this.url = options.url ? decodeURIComponent(options.url) : ''
		}
	}
</script>

<style lang="less">
	page {
		.hper-100();
		background-color: @background-color;
	}
	
	.webview-root {
		.hper-100();
	}
</style>
