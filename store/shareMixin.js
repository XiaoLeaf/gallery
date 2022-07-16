import util from '@/utils/util.js'
export default {
	data() {
		return {
			mixinShare: {
				path: '',
				title: ''
			}
		}
	},
	
	onShareAppMessage() {
		let pages = getCurrentPages()
		let currentPage = pages.pop()
		let path = '/' + currentPage.route
		path = util.commonShareConfig(path)
		this.mixinShare.path = path
		return this.mixinShare
	},
	
	onShareTimeline() {
		let query = util.fetchTimeLineQuery({})
		this.mixinShare.query = query
		return this.mixinShare
	}
}
