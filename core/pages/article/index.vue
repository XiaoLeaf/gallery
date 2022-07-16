<template>
	<view v-if="loaded" class="announce-root">
		<view class="mescroll-box">
			<mescroll-uni :fixed="false" :safearea="true" @init="mescrollInit" @down="downCallback" @up="upCallback">
				<view class="announce-box">
					<block v-for="(announce, index) in announceList" :key="announce.id">
						<announce :announce="announce" class="wper-100"></announce>
					</block>
				</view>
			</mescroll-uni>
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
				cid: 0,
				page: 1,
				mescroll: '',
				hasNext: false,
				announceList: '',
			}
		},

		onLoad(options) {
			this.cid = options.cid ? options.cid : 0
			this.fetchAnnounceList(true)
		},
		
		onShareAppMessage() {
			let path = '/core/pages/article/index'
			let list = []
			if (this.cid) {
				list.push('cid=' + this.cid)
			}
			path = path + '?' + list.join('&')
			path = this.$util.commonShareConfig(path)
			return {
				path: path
			}
		},
		
		onShareTimeline() {
			let query = {}
			if (this.cid) {
				query.cid = this.cid
			}
			query = this.$util.fetchTimeLineQuery(query)
			return {
				query: query
			}
		},

		methods: {
			mescrollInit(mescroll) {
				this.mescroll = mescroll
				this.mescroll.endSuccess(this.announceList.length, this.hasNext)
				if (!this.hasNext) {
					this.mescroll.hideUpScroll()
				}
			},
			
			downCallback() {
				this.page = 1
				this.fetchAnnounceList(false)
			},
			
			upCallback() {
				if (this.hasNext) {
					this.page++
					this.fetchAnnounceList(false)
				}
			},
			
			fetchAnnounceList(loading) {
				this.$util.postRequest(this.$api.cms.get_list, this.fetchParameters(), loading,
					res => {
						this.announceList = this.page == 1 ? res.data.list : this.announceList.concat(res.data.list)
						this.hasNext = Boolean(res.data.hasNext)
						if (this.mescroll) {
							this.mescroll.endSuccess(res.data.list.length, this.hasNext)
							if (!this.hasNext) {
								this.mescroll.hideUpScroll()
							}
						}
						this.loaded = true
					},
					err => {
						if (this.mescroll) {
							this.mescroll.endErr()
						}
						if (this.page != 1) {
							this.page--
						}
						this.$util.showNoIconToast(err.info)
					})
			},
			
			fetchParameters() {
				let params = {
					cid: this.cid,
					page: this.page
				}
				return params
			}
		}
	}
</script>

<style lang="less">
	page {
		.hper-100();
		background-color: @background-color;
	}

	.announce-root {
		.hper-100();
		.flex-col();
		
		.announce-box {
			padding-bottom: @padding-xs;
		}
	}
</style>
