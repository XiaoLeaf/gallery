import { mapGetters } from 'vuex'

export default {
	data() {
		return {

		}
	},

	computed: {
		...mapGetters([
			'loginStatus'
		])
	},

	watch: {
		loginStatus: {
			handler(val) {
				if (val || !val) {
					this.loginUpdate()
				}
			},
			deep: true,
		}
	},

	methos: {
		
	}
}