<template>
	<view v-if="loaded" class="page-root common-page-root detail-root">
		<zx-navbar background="transparent">
			<view slot="left" class="navbar-left" :style="{ 'width': capsule ? capsule.width + 20 + 'px' : '110px' }">
				<u-icon @click="onClickBack" custom-prefix="zx-icon" name="nav-back" size="44" color="#333"></u-icon>
			</view>
			<view slot="title" class="navbar-middle">
				<view class="middle-title"></view>
			</view>
			<view slot="right" class="navbar-right" :style="{ 'width': capsule ? capsule.width + 20 + 'px' : '110px' }">

			</view>
		</zx-navbar>
		<view class="common-page-box">
			<view class="mescroll-box">
				<mescroll-uni :fixed="false" :safearea="true" :up="up" @init="mescrollInit" @down="downCallback">
					<view class="detail-mescroll-box">
						<view class="slide-box">
							<swiper class="slide-swiper" indicator-dots="true" circular="true" :autoplay="true" interval="3000" indicator-color="#fff" indicator-active-color="#f00">
								<swiper-item class="slide-item" v-for="(item, index) in goodsInfo.slides" :key="index">
									<image webp="true" lazy-load="true" @click="onClickSlideImg(index)" mode="aspectFill" :src="item" class="slide-img"></image>
								</swiper-item>
							</swiper>
						</view>
						<view class="content-box">
							<view class="content-header">
								<view class="left-box">
									<view class="price-box">
										<view class="real-price-box">
											<text class="real-price">{{ goodsInfo.price }}</text>
										</view>
										{{ goodsInfo.real_price_ext }}
									</view>
									<view v-if="goodsInfo.rewardStr" class="regbag">{{ goodsInfo.rewardStr }}</view>
								</view>
								<view class="right-box">
									<view class="goods-stock">{{ goodsInfo.no }}</view>
								</view>
							</view>
							<view class="goods-title-box">
								<text class="goods-title">
									<text v-if="goodsInfo.typeStr" class="common-goods-type">{{ goodsInfo.typeStr }}</text>
									<text @longpress="onLongPressGoodsTitle">{{ goodsInfo.title }}</text>
								</text>
							</view>
							<view class="goods-sub-title-box">
								<text class="goods-sub-title">{{ goodsInfo.subtitle }}</text>
							</view>
						</view>
						<view @click="onClickHistory" class="specs-box">
							<view class="specs-content">
								<view class="specs-title">{{ $t('goods.history') }}</view>
								<view class="specs-right">
									<u-icon name="arrow-right" size="24" color="#999"></u-icon>
								</view>
							</view>
						</view>
						<view class="specs-box">
							<view class="specs-content">
								<view class="num-box">
									<view class="num-txt">{{ goodsInfo.stateTitle }}</view>
								</view>
								<view class="specs-right">
									<block v-if="goodsInfo.status == 2 && goodsInfo.remainSeconds > 0">
										<u-count-down @end="onCountDownEnd" :timestamp="goodsInfo.remainSeconds" color="#f00" separator-color="#f00" bg-color="#fff" separator-size="26" font-size="26" :show-days="true"></u-count-down>
									</block>
									<block v-else>
										<view class="right-status-str">{{ goodsInfo.statusStr }}</view>
									</block>
								</view>
							</view>
						</view>
						<view class="section-root">
							<view class="section-box">
								<view @click="onClickSectionItem(index)" v-for="(item, index) in tabArr" :key="index" class="section-item" :class="[index == sectionActive ? 'section-item-select': '']">{{ item.name }}</view>
							</view>
						</view>
						<block v-if="sectionActive == 0">
							<view class="group-user-box">
								<view v-for="(item, index) in gbrList" :key="index" class="join-user-item">
									<view class="join-user-item-left">
										<view class="left-nickname" :class="[item.is_in ? '' : 'left-nickname-primary']">{{ item.is_in ? item.nickname : $t('goods.wait.join') }}</view>
										<view v-if="item.statusStr" class="left-award" :class="[item.status == 1 ? 'left-goods-award' : '']">({{ item.statusStr }})</view>
									</view>
									<view v-if="item.c_time" class="join-user-item-right">{{ item.c_time }}</view>
								</view>
							</view>
						</block>
						<block v-else-if="sectionActive == 1">
							<view id="goods-content" class="imgtext-box">
								<image @click="onClickGoodsImage(index)" webp="true" lazy-load="true" mode="widthFix"
									class="imgtext-img" v-for="(item, index) in goodsInfo.content" :key="index" :src="item">
								</image>
							</view>
						</block>
						<block v-else>
							<view class="group-desc">
								<u-parse :html="ruleContent"></u-parse>
							</view>
						</block>
					</view>
				</mescroll-uni>
			</view>
			<view class="page-footer">
				<view class="footer-box">
					<button @click="onClickHome" class="share-btn">
						<u-icon custom-prefix="zx-icon" name="home" color="#666" size="40"></u-icon>
						<text class="share">{{ $t('tabbar.home') }}</text>
					</button>
					<view class="right-box">
						<block v-if="goodsInfo.status == 2">
							<button @click="onClickJoin" class="buy-now buy-now-radius">{{ goodsInfo.is_in > 0 ? goodsInfo.is_in_str : $t('goods.join') }}</button>
						</block>
						<block v-else>
							<button class="buy-now buy-now-radius buy-now-disabled">{{  goodsInfo.statusStr }}</button>
						</block>
					</view>
				</view>
			</view>
		</view>
		<u-popup v-if="specsShow" v-model="specsShow" mode="bottom" z-index="600">
			<view class="specs-popup-box">
				<view class="specs-popup-header">
					<view class="blank"></view>
					<view class="header-content">
						<image @click="onClickPopupCover" lazy-load="true" webp="true" :src="goodsInfo.cover"
							class="popup-goods-cover"></image>
						<view class="header-specs-box">
							<view class="price-box">
								￥
								<text class="real-price">{{ goodsInfo.price }}</text>
								<text v-if="goodsInfo.ori_price > 0" class="ori-price">{{ goodsInfo.ori_price }}</text>
							</view>
							<view class="popup-specs-content">
								<view class="popup-specs">
									{{ selectLen == specsLen ? $t('goods.chosen') + curSku.name : $t('goods.choose.specs') }}
								</view>
								<view v-if="goodsInfo.score > 0" class="popup-score">{{ goodsInfo.scoreStr }}</view>
							</view>
						</view>
					</view>
				</view>
				<scroll-view scroll-y="true" class="popup-specs-scroll">
					<view v-for="(item, index) in goodsInfo.specs_list" :key="index" class="popup-specs-item">
						<view class="specs-name">{{ item.name }}</view>
						<view class="specs-props">
							<view @click="onClickSpecsItem(index, subIndex)" v-for="(subItem, subIndex) in item.val" :key="subIndex"
								:class="[ subItem.disabled ? 'props-item-disabled' : subItem.id==selectObj[index] ? 'props-item-highlight' : 'props-item']">
								{{ subItem.name }}</view>
						</view>
					</view>
				</scroll-view>
				<view class="num-box">
					<view class="num-title">{{ $t('goods.quantity') }}</view>
					<u-number-box v-model="popStepNum" :input-height="60" :max="1" :min="1" :disabled-input="true" @change="onSelectedSkuNumChange"></u-number-box>
				</view>
				<view class="pay-radio-box">
					<view class="payment-title">{{ $t('goods.payment') }}</view>
					<radio-group @change="onRadioChange">
						<label v-for="(item, index) in paymentArr" :key="item.value" class="radio-label">
							<view>{{ item.name }} {{ item.amount }}</view>
							<radio style="transform: scale(.8);" :value="item.value.toString()" color="#FF0000" :checked="radio == item.value" />
						</label>
					</radio-group>
				</view>
				<view class="footer-box">
					<view class="footer-content">
						<view class="btn-box">
							<view class="buy-box">
								<block v-if="goodsInfo.status == 2">
									<button @click="onClickPopupJoin" class="buy-now buy-now-radius">{{ goodsInfo.is_in > 0 ? goodsInfo.is_in_str : $t('goods.join') }}</button>
								</block>
								<block v-else>
									<button class="buy-now buy-now-radius buy-now-disabled">{{ goodsInfo.statusStr }}</button>
								</block>
							</view>
						</view>
					</view>
				</view>
			</view>
		</u-popup>
		<u-popup v-model="showPassword" mode="bottom">
			<view class="password-popup-box">
				<view class="password-title">
					<view>{{ $t('my.pay.password') }}</view>
				</view>
				<view class="input-box">
					<u-message-input :dot-fill="true" :value="paypwd" :maxlength="6" :width="90"></u-message-input>
				</view>
				<view class="keyboard-box">
					<zx-keyboard ref="zxkeyboard" @click="onClickKeyboardItem" @delete="onClickKeyboardDelete">
					</zx-keyboard>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loaded: false,
				loadingItem: false,
				mescroll: '',
				up: {
					use: false
				},
				gid: '',
				id: '',
				goodsInfo: '',
				specsShow: false,
				curSku: '',
				specsLen: 0,
				selectLen: 0,
				selectObj: {},
				popStepNum: 1,
				sku_id: 0,
				showPassword: false,
				paypwd: '',
				pwdVal: '',
				hasPwd: 0,
				gbRow: '',
				tabArr: '',
				radio: 1,
				paymentArr: '',
				sectionActive: 0,
				ruleContent: '',
				gbrList: '',
				userInfo: '',
			}
		},

		onLoad(options) {
			this.gid = options.gid ? options.gid : 0
			this.id = options.gb_id ? options.gb_id : 0
			this.sku_id = options.skuid ? options.skuid : 0
			this.fetchGoodsItem(true)
		},
		
		onShow() {
			this.userInfo = uni.getStorageSync(this.$api.userInfo)
			if (!this.loadingItem) {
				this.fetchGoodsItem(false)
			}
		},

		methods: {
			onClickBack() {
				this.$util.navigateBack()
			},

			onClickHome() {
				this.$util.miniAppRoute('/pages/index/index')
			},

			mescrollInit(mescroll) {
				this.mescroll = mescroll
			},

			downCallback() {
				this.fetchGoodsItem(false)
			},

			fetchGoodsItem(loading) {
				this.loadingItem = true
				this.$util.postRequest(this.$api.goods.item, this.fetchParams(), loading,
					res => {
						this.loadingItem = false
						if (this.mescroll) {
							this.mescroll.endSuccess()
						}
						let currentsku
						if (res.data.row.sku_id != 0) {
							currentsku = res.data.row.sku_list[res.data.row.sku_id]
							// res.data.row.stock = currentsku.stock
						}
						if (this.curSku) {
							currentsku = this.curSku
							// res.data.row.stock = currentsku.stock
						}
						this.sku_id = res.data.row.sku_id
						this.specsLen = res.data.row.specs_list.length
						this.goodsInfo = res.data.row
						this.hasPwd = res.data.hasPwd
						this.gbRow = res.data.gbRow
						if (currentsku) {
							let select = {}
							let temp = currentsku.key.split(',')
							for (let i = 0; i < temp.length; i++) {
								select[i] = temp[i]
							}
							this.curSku = currentsku
							this.selectLen = temp.length
							this.selectObj = select
							this.$set(this.goodsInfo, 'ori_price', currentsku.ori_price)
							this.$set(this.goodsInfo, 'cover', this.goodsInfo.specs_cover[currentsku.key])
							this.popStepNum = 1
						}
						this.tabArr = res.data.tabArr
						this.ruleContent = res.data.ruleContent
						this.paymentArr = res.data.paymentArr
						this.gbrList = res.data.gbrList
						this.loaded = true
					},
					err => {
						this.loadingItem = false
						this.$util.showNoIconToast(err.info)
						if (this.mescroll) {
							this.mescroll.endErr()
						}
						setTimeout(() => {
							uni.navigateBack({
								delta: 1
							})
						}, 1500)
					})
			},

			fetchParams() {
				let params = {
					gid: this.gid,
					gb_id: this.id,
					sku_id: this.sku_id
				}
				return params
			},

			onClickSlideImg(index) {
				let that = this
				uni.previewImage({
					urls: that.goodsInfo.slides,
					current: that.goodsInfo.slides[index]
				})
			},

			onLongPressGoodsTitle() {
				let that = this
				uni.setClipboardData({
					data: that.goodsInfo.title,
					success: res => {
						that.$util.showNoIconToast(that.$t('common.copy.success'))
					}
				})
			},
			
			onClickHistory() {
				this.$util.miniAppRoute('/goods/pages/history/index?gid=' + this.gid)
			},
			
			onCountDownEnd() {
				this.fetchGoodsItem(false)
			},
			
			onClickSectionItem(index) {
				this.sectionActive = index
			},

			onClickSpecs() {
				this.setDefaultSelectSku()
			},
			
			setDefaultSelectSku() {
				if (!this.sku_id && this.goodsInfo.def_sku_id) {
					this.curSku = this.goodsInfo.sku_list[this.goodsInfo.def_sku_id]
					this.sku_id = this.goodsInfo.def_sku_id
					this.localUpdateGoodsInfo(this.curSku)
				}
				this.specsShow = true
			},
			
			localUpdateGoodsInfo(currentSku) {
				this.sku_id = currentSku.id
				let keyList = currentSku.key.split(',')
				let cover = this.goodsInfo.specs_cover[keyList[0]]
				this.$set(this.goodsInfo, 'cover', cover)
				this.$set(this.goodsInfo, 'ori_price', currentSku.ori_price)
				this.$set(this.goodsInfo, 'price', currentSku.price)
				this.popStepNum = 1
				let select = {}
				for (let i = 0; i < keyList.length; i++) {
					select[i] = keyList[i]
				}
				this.selectLen = keyList.length
				this.selectObj = select
			},

			onClickGoodsImage(index) {
				let that = this
				uni.previewImage({
					urls: that.goodsInfo.content,
					current: that.goodsInfo.content[index]
				})
			},

			onClickJoin() {
				if (this.goodsInfo.is_in) {
					this.$util.showNoIconToast(this.$t('goods.has.join'))
					return
				}
				this.setDefaultSelectSku()
			},

			onClickPopupCover() {
				let that = this
				uni.previewImage({
					current: that.goodsInfo.cover,
					urls: [that.goodsInfo.cover]
				})
			},

			onClickSpecsItem(index, subIndex) {
				let selected = this.selectObj
				selected[index] = this.goodsInfo.specs_list[index].val[subIndex].id
				let keys = []
				let values = []
				for (let key in selected) {
					keys.push(key)
					values.push(selected[key])
				}
				let length = keys.length
				if (length == this.specsLen) {
					let current = this.locationCurrentSku(values.join(','))
					this.selectObj = selected
					this.selectLen = length
					this.curSku = current
					this.popStepNum = current.stock == 0 ? 1 : this.popStepNum > current.stock ? current.stock : this
						.popStepNum
					this.$set(this.goodsInfo, 'price', current.price)
					this.$set(this.goodsInfo, 'ori_price', current.ori_price)
					this.$set(this.goodsInfo, 'real_price_ext', '')
					this.$set(this.goodsInfo, 'stock', current.stock)
					this.$set(this.goodsInfo, 'volume', current.volume)
				} else {
					this.selectObj = selected
					this.selectLen = length
				}
				if (index == 0) {
					this.$set(this.goodsInfo, 'cover', this.fetchSpecsCover(this.goodsInfo.specs_list[index].val[subIndex]
						.id))
				}
			},

			locationCurrentSku(key) {
				return this.goodsInfo.sku_list_key[key]
			},

			fetchSpecsCover(id) {
				return this.goodsInfo.specs_cover[id]
			},

			onSelectedSkuNumChange(value) {
				this.popStepNum = value.value
			},
			
			onRadioChange(e) {
				this.radio = e.detail.value
			},

			onClickPopupJoin() {
				if (!this.curSku) {
					this.$util.showNoIconToast(this.$t('goods.choose.specs'))
					return
				}
				if (!this.loginStatus) {
					let that = this
					uni.showModal({
						title: that.$t('common.warm.prompt'),
						content: that.$t('common.login.first'),
						cancelText: that.$t('common.not.login'),
						confirmText: that.$t('login.title'),
						cancelColor: '#999',
						confirmColor: that.themeColor,
						success(res) {
							if (res.confirm) {
								that.$util.miniAppRoute('/pages/home/index', 2)
							}
						}
					})
					return
				}
				if (!this.userInfo.hasPpwd) {
					let that = this
					uni.showModal({
						title: that.$t('common.warm.prompt'),
						content: that.$t('common.set.paypwd'),
						confirmText: that.$t('common.confirm'),
						cancelText: that.$t('common.cancel'),
						success: res => {
							if (res.confirm) {
								that.$util.miniAppRoute('/mine/pages/pay-pwd/index')
							}
						}
					})
					return
				}
				this.showPassword = true
			},

			onClickKeyboardItem(num) {
				if (this.pwdVal.length >= 6) return
				this.pwdVal = this.pwdVal + num
				this.paypwd = this.paypwd + num
				let that = this
				if (this.pwdVal.length == 6) {
					this.showPassword = false
					this.fetchJoin()
				}
			},

			onClickKeyboardDelete() {
				if (this.pwdVal.length <= 0) return
				this.pwdVal = this.pwdVal.substring(0, this.pwdVal.length - 1)
				this.paypwd = this.paypwd.substring(0, this.paypwd.length - 1)
			},

			fetchJoin() {
				let params = {
					gid: this.gid,
					gb_id: this.id,
					sku_id: this.curSku.id,
					ppwd: this.paypwd,
					payment: this.radio
				}
				this.$util.postRequest(this.$api.goods.order, params, true,
					res => {
						this.$util.showNoIconToast(res.info)
						this.specsShow = false
						setTimeout(() => {
							this.fetchGoodsItem(false)
						}, 1500)
					},
					err => {
						this.paypwd = ''
						this.pwdVal = ''
						this.$util.showNoIconToast(err.info)
					})
			},
		}
	}
</script>

<style lang="less">
	page {
		.hper-100();
		background-color: @background-color;
	}

	.detail-root {
		
		/deep/.u-drawer-bottom {
			background-color: transparent !important;
		}

		.box-border-top {
			border-top: 1px #f9f9f9 solid;
		}

		.detail-mescroll-box {
			.pbsafe();

			.slide-box {
				width: 100%;
				height: 750rpx;
				
				/deep/.uni-swiper-dot {
					width: 24rpx;
					border-radius: @border-radius-base;
					height: 8rpx;
				}

				.slide-swiper {
					height: 100%;

					.slide-item {
						height: 100%;

						.slide-img {
							height: 100%;
							width: 100%;
						}
					}
				}
			}

			.content-box {
				.flex-col();
				padding: @padding-xs;
				box-sizing: border-box;
				background-color: #FFFFFF;

				.content-header {
					.flex-c-aic-jcb();

					.left-box {
						.flex-c-aic();

						.price-box {
							color: @text-thirdly-color;
							.flex-c-aib();
							font-size: @font-size-xs;

							.real-price-box {
								.flex-c-aic();

								.goods-tag {
									background-color: @text-primary-color;
									margin-right: @padding-xs / 2;
									border-radius: @border-radius-base / 2;
									font-size: @font-size-xs;
									padding: 0 4rpx;
								}

								.real-price {
									color: #c00;
									font-weight: 500;
									font-size: @font-size-lg;
								}
							}
						}

						.ori-price {
							padding-left: @padding-xs / 2;
							text-decoration: line-through;
							font-size: @font-size-xxs;
							color: @text-secondary-color;
						}
						
						.regbag {
							margin-left: @common-blank;
							color: #FFFFFF;
							font-size: @font-size-xxs;
							background-color: @red-color;
							border-radius: 100rpx;
							overflow: hidden;
							line-height: 36rpx;
							padding: 0 @padding-xs / 2;
						}
					}

					.right-box {
						.flex-c-aic();

						.fav-btn {
							.flex-col-aic-jcc();
							border-radius: 0 !important;
							line-height: auto;
							background-color: #FFFFFF;
							width: 50rpx;
							height: 50rpx;

							&::after {
								border: none;
							}
						}

						.goods-stock {
							color: @text-thirdly-color;
							padding-left: @padding-xs;
							font-size: @font-size-sm;
						}
					}
				}

				.goods-title-box {
					padding: @padding-xs 0;

					.goods-title {
						.line-2();
						color: @text-primary-color;
						font-size: @font-size-base;
						font-weight: 400;
					}
				}

				.goods-sub-title-box {
					.flex-c-jcb();
					padding-bottom: @padding-xs;

					.goods-sub-title {
						color: @text-thirdly-color;
						font-size: @font-size-sm;
					}
				}

				.guarantee-box {
					padding-top: @padding-xs;
					.box-border-top();
					box-sizing: border-box;
					.flex-c-aic();
					font-size: @font-size-sm;

					.guarantee-content {
						.flex-c-aic-jcb();

						.guarantee-left {
							color: @text-primary-color;
							font-weight: 500;
						}

						.guarantee-right {
							padding-left: @padding-xs;
							box-sizing: border-box;
							color: @text-secondary-color;
							flex: 1;
							.line-1();
							overflow: hidden;
						}
					}
				}
			}

			.score-box {
				padding: @padding-xs;
				box-sizing: border-box;
				background-color: #FFFFFF;
				margin-top: @common-blank;
				.flex-c-aic-jcb();

				.score-title {
					color: @text-thirdly-color;
					font-size: @font-size-sm;
					padding-right: @padding-xs;
				}

				.score-right {
					line-height: 50rpx;
					.line-1();
					overflow: hidden;

					.score {
						font-size: @font-size-sm;
						color: @score-color;
					}
				}
			}
			
			.num-box {
				.flex-c-aic();
				
				.num-txt {
					color: @red-color;
					border: 1px solid @red-color;
					background-color: #FBE7EC;
					line-height: 36rpx;
					font-size: @font-size-xxs;
					padding: 0 @padding-xs / 2;
					border-radius: 50rpx;
					overflow: hidden;
				}
			}
			
			.section-root {
				margin-top: @common-blank;
				background-color: #FFFFFF;
				padding: @padding-xs;
				box-sizing: border-box;
				
				.section-box {
					.flex-c-aic();
					background-color: #FFFFFF;
					border: 1px solid @red-color;
					border-radius: 100rpx;
					overflow: hidden;
					
					.section-item {
						flex: 1;
						font-size: @font-size-medium;
						line-height: 70rpx;
						text-align: center;
						color: @red-color;
						
						&:not(:last-child) {
							border-right: 1px solid @red-color;
						}
					}
					
					.section-item-select {
						background-color: @red-color;
						color: #FFFFFF;
					}
				}
			}
			
			.group-user-box {
				margin: 0 0 @common-blank 0;
				background-color: #FFFFFF;
				padding: 0 @padding-xs;
				box-sizing: border-box;
				
				.group-user-header {
					padding: @padding-xs 0;
					position: relative;
					// .flex-c-aic();
				
					.header-box {
						position: relative;
						padding-bottom: @padding-xs;
					
						&::after {
							position: absolute;
							bottom: 0;
							left: 0;
							.wper-100();
							content: '';
							background-color: #f1f1f1;
							height: 1px;
						}
						
						.num-box {
							.flex-c-aic();
							
							.num-txt {
								color: @red-color;
								border: 1px solid @red-color;
								background-color: #FBE7EC;
								line-height: 36rpx;
								font-size: @font-size-xxs;
								padding: 0 @padding-xs / 2;
								border-radius: 50rpx;
								overflow: hidden;
							}
						}
						
						.desc-box {
							padding-top: @padding-xs;
							
							.desc-item {
								.flex-c-aic();
								line-height: 50rpx;
								
								.item-point {
									width: 16rpx;
									height: 16rpx;
									background-color: @red-color;
									border-radius: 20rpx;
									overflow: hidden;
									margin-right: @common-blank;
								}
								
								.item-txt {
									flex: 1;
									color: @text-secondary-color;
									font-size: @font-size-sm;
									.line-1();
								}
							}
						}
					}
					
					&::after {
						position: absolute;
						bottom: 0;
						left: 0;
						.wper-100();
						content: '';
						background-color: #f1f1f1;
						height: 1px;
					}
					
					.title-box {
						padding: @padding-xs @padding-xs 0 0;
						.flex-c-aic-jcb();
						
						/deep/ .u-countdown {
							.num-ff();
						}
					}
					
					.header-title {
						font-size: @font-size-lg;
						color: @text-primary-color;
						font-weight: 600;
					}
					
					.u-count-down {
						.num-ff();
					}
				}
				
				.group-user-footer {
					padding: @padding-xs 0;
					
					.footer-left {
						.flex-c-aic();
						flex: 1;
						padding-right: @padding-xs;
						box-sizing: border-box;
						overflow: hidden;
						height: 50rpx;
						
						.avatar-box {
							.flex-c-aic();
							.hper-100();
							line-height: 1;
							
							.avatar {
								width: 40rpx;
								height: 40rpx;
								border-radius: 50%;
								background-color: #e1e1e1;
								vertical-align: middle;
								font-size: @font-size-xxs;
								font-weight: 700;
								color: @text-thirdly-color;
								.flex-c-aic-jcc();
								
								&:not(:first-child) {
									margin-left: -16rpx;
								}
							}
						}
						
						.left-txt {
							.hper-100();
							.flex-c-aic();
							font-size: @font-size-sm;
							color: @text-thirdly-color;
							padding-left: @padding-xs;
							box-sizing: border-box;
						}
					}
				}

				.join-user-item {
					.flex-c-aic-jcb();
					padding: @padding-xs + 10rpx @padding-xs;
					box-sizing: border-box;
					
					&:not(:last-child) {
						border-bottom: 1px solid #f1f1f1;
					}
					
					.join-user-item-left {
						.flex-c-aic();
						font-size: @font-size-sm;
						
						.left-avatar {
							width: 50rpx;
							height: 50rpx;
							border-radius: 50rpx;
							overflow: hidden;
							vertical-align: middle;
						}
						
						.left-nickname {
							color: @text-primary-color;
						}
						
						.left-nickname-primary {
							color: @primary-color;
						}
						
						.left-award {
							font-size: @font-size-xs;
							padding-left: @padding-xs;
							color: @text-primary-color;
						}
						
						.left-goods-award {
							color: @red-color;
						}
					}
					
					.join-user-item-right {
						color: @text-thirdly-color;
						font-size: @font-size-xs;
					}
				}
			}

			.specs-box {
				padding: @padding-xs;
				box-sizing: border-box;
				margin-top: @common-blank;
				background-color: #FFFFFF;

				.specs-content {
					.flex-c-aic-jcb();

					.specs-title {
						color: @text-thirdly-color;
						font-size: @font-size-sm;
					}

					.specs-right {
						.flex-c-aic();
						height: 50rpx;
						line-height: 1;

						.specs {
							color: @text-primary-color;
							font-size: @font-size-sm;
							padding: 0 @padding-xs / 2;
							box-sizing: border-box;
						}
						
						.right-status-str {
							color: @text-secondary-color;
							font-size: @font-size-sm;
						}
					}
				}
			}

			.imgtext-box {

				.imgtext-header {
					.flex-col();

					.header-item {
						.flex-c-aic-jcc();
						background-color: #FFFFFF;
						line-height: 88rpx;

						.item {
							color: @text-primary-color;
							font-size: @font-size-base;
						}
					}
				}

				.imgtext-img {
					width: 100%;
					display: block;
				}
			}
		
			.group-desc {
				background-color: #FFFFFF;
				padding: 0 @padding-xs @padding-xs @padding-xs;
				box-sizing: border-box;
				// padding-top: @padding-xs;
				
				.desc-item {
					.flex-c-aic();
					line-height: 60rpx;
					
					.item-point {
						width: 16rpx;
						height: 16rpx;
						background-color: @red-color;
						border-radius: 20rpx;
						overflow: hidden;
						margin-right: @common-blank;
					}
					
					.item-txt {
						flex: 1;
						color: @text-secondary-color;
						font-size: @font-size-sm;
						.line-1();
					}
				}
			}
		}

		.footer-box {
			background-color: #FFFFFF;
			.flex-c();
			width: 100%;
			z-index: 99;

			.contact-btn {
				border-radius: 0 !important;
				line-height: normal;
				background-color: #FFFFFF;
				width: 100rpx;
				height: 100rpx;
				margin: 0;
				padding: 0;
				.flex-col-aic-jcc();

				&::after {
					border: none;
				}

				.contact {
					color: @text-thirdly-color;
					font-size: @font-size-xxs;
				}
			}

			.share-btn {
				border-radius: 0 !important;
				line-height: normal;
				background-color: #FFFFFF;
				width: 100rpx;
				height: 100rpx;
				margin: 0;
				padding: 0;
				.flex-col-aic-jcc();

				&::after {
					border: none;
				}

				.share {
					color: @text-thirdly-color;
					font-size: @font-size-xxs;
				}
			}

			.cart-btn {
				.flex-col-aic-jcc();
				position: relative;
				width: 120rpx;
				height: 100rpx;
				box-sizing: border-box;
				margin: 0;
				padding: 0 @padding-xs 0 0;
				background-color: #FFFFFF;
				line-height: normal;

				&::after {
					border: none;
				}

				.cart {
					color: @text-thirdly-color;
					font-size: @font-size-xxs;
				}

				.cart-num {
					position: absolute;
					top: -0.8em;
					right: .5em;
					color: #FFFFFF;
					font-size: @font-size-sm;
				}
			}

			.right-box {
				flex: 1;
				padding: @padding-xs / 2 0;
				margin: 0 @padding-xs / 2;
				height: 100rpx;

				.add-cart {
					flex: 1;
					color: #FFFFFF;
					font-size: @font-size-base;
					overflow: hidden;
					border-radius: 0 !important;
					border-bottom-left-radius: @border-radius-base  !important;
					border-top-left-radius: @border-radius-base  !important;
					height: 100%;
					line-height: 80rpx;
					width: 100%;
					background: linear-gradient(90deg, #ffd01e, #ff8917);

					&::after {
						border: none;
					}
				}

				.buy-now {
					flex: 1;
					color: #FFFFFF;
					font-size: @font-size-base;
					overflow: hidden;
					width: 100%;
					line-height: 80rpx;
					background: linear-gradient(90deg, #ff6034, #ee0a24);

					&::after {
						border: none;
					}
				}
				
				.buy-now-disabled {
					background: @disabled-color;
				}
			}
		}

		.specs-popup-box {
			.flex-col();
			width: 100%;
			background-color: transparent;

			.specs-popup-header {
				.flex-col();
				background-color: transparent;

				.blank {
					height: 40rpx;
					background-color: transparent;
				}

				.header-content {
					.flex-c();
					width: 100%;
					padding: 0 0 @padding-xs @padding-xs * 2;
					position: relative;
					box-sizing: border-box;
					background-color: #FFFFFF;

					.popup-goods-cover {
						border-radius: @border-radius-base;
						position: absolute;
						width: 160rpx;
						height: 160rpx;
						top: -20px;
						left: 20px;
						overflow: hidden;
						display: block;
					}

					.header-specs-box {
						.flex-col();
						padding: 30rpx @padding-xs 0 180rpx;
						box-sizing: border-box;

						.price-box {
							.flex-c-aib();
							font-size: @font-size-sm;
							color: @text-secondary-color;

							.real-price {
								color: #c00;
								font-size: @font-size-xxxl;
								font-weight: 500;
							}

							.ori-price {
								color: @text-secondary-color;
								padding-left: @padding-xs / 2;
								font-size: @font-size-sm;
								text-decoration: line-through;
							}

							.goods-stock {
								font-size: @font-size-sm;
								padding-left: @padding-xs * 2;
							}
						}

						.popup-specs-content {
							.flex-c-aic();
							padding-top: @padding-xs / 2;

							.popup-specs {
								color: @text-thirdly-color;
								font-size: @font-size-sm;
								font-weight: normal;
							}

							.popup-score {
								color: @score-color;
								font-size: @font-size-sm;
								padding-left: @padding-xs;
							}
						}
					}
				}
			}

			.popup-specs-scroll {
				width: 100%;
				padding: 0 @padding-xs * 2 @padding-xs;
				box-sizing: border-box;
				background-color: #FFFFFF;
				min-height: 200rpx;
				max-height: 600rpx;

				.popup-specs-item {
					width: 100%;

					.specs-name {
						color: @text-primary-color;
						font-size: @font-size-base;
						padding-top: @padding-xs;
					}

					.specs-props {
						.flex-c();
						flex-wrap: wrap;
						padding: @padding-xs 0;
						font-size: @font-size-sm;

						.props-item {
							margin: @padding-xs @padding-xs 0 0;
							padding: @padding-xs / 2 @padding-xs;
							border-radius: @border-radius-base;
							color: @text-secondary-color;
							background-color: #F9F9F9;
						}

						.props-item-highlight {
							margin: @padding-xs @padding-xs 0 0;
							padding: @padding-xs / 2 @padding-xs;
							border-radius: @border-radius-base;
							color: #FFFFFF;
							background-color: #c00;

							// position: relative;

							// &::after {
							// 	position: absolute;
							// 	left: 0;
							// 	top: 0;
							// 	content: '';
							// 	.wper-100();
							// 	.hper-100();
							// 	border: 1px solid @primary-color;
							// 	border-radius: @border-radius-base;
							// 	overflow: hidden;
							// }
						}

						.props-item-disabled {
							margin: @padding-xs @padding-xs 0 0;
							padding: @padding-xs / 2 @padding-xs;
							border-radius: @border-radius-base;
							color: @text-thirdly-color;
							background-color: #f9f9f9;
							text-decoration: line-through;
						}
					}
				}
			}

			.num-box {
				background-color: #FFFFFF;
				.flex-c-aic-jcb();
				padding: @padding-xs @padding-xs * 2;
				box-sizing: border-box;

				.num-title {
					color: @text-primary-color;
					font-size: @font-size-base;
				}
			}
			
			.pay-radio-box {
				.flex-col();
				background-color: #FFFFFF;
				padding: @padding-xs @padding-xs * 2 @padding-xs * 6;
				
				.payment-title {
					color: @text-primary-color;
					font-size: @font-size-base;
					padding-bottom: @padding-xs / 2;
				}
				
				.radio-label {
					border-bottom: 1px solid #F9F9F9;
					color: @text-primary-color;
					font-size: @font-size-sm;
					padding: @padding-xs + 10rpx 0;
					box-sizing: border-box;
					.flex-c-aic-jcb();
				}
			}

			.footer-box {
				padding: 0 @padding-xs;
				box-sizing: border-box;
				background-color: #FFFFFF;
				.pbsafe();

				.footer-content {
					z-index: 99;
					.flex-c();
					width: 100%;

					.btn-box {
						flex: 1;
						padding: @padding-xs / 2 0;
						height: 100rpx;
						margin: 0 @padding-xs / 2;

						.buy-box {
							.flex-c-aic();
							width: 100%;
							height: 100%;

							.add-cart {
								flex: 1;
								color: #FFFFFF;
								font-size: @font-size-base;
								overflow: hidden;
								border-radius: 0 !important;
								border-bottom-left-radius: @border-radius-base !important;
								border-top-left-radius: @border-radius-base !important;
								height: 100%;
								line-height: 80rpx;
								width: 100%;
								background: linear-gradient(90deg, #ffd01e, #ff8917);

								&::after {
									border: none;
								}
							}

							.buy-now {
								flex: 1;
								color: #FFFFFF;
								font-size: @font-size-base;
								overflow: hidden;
								width: 100%;
								line-height: 80rpx;
								background: linear-gradient(90deg, #ff6034, #ee0a24);

								&::after {
									border: none;
								}
							}
				
							.buy-now-disabled {
								background: @disabled-color;
							}
						}

						.sellout-box {
							.flex-c-aic();
							width: 100%;
							height: 100%;
							overflow: hidden;
							border-radius: 40rpx;

							.sellout-btn {
								color: #FFFFFF;
								font-size: @font-size-base;
								background-color: @text-thirdly-color;
								height: 100%;
								line-height: 80rpx;
								width: 100%;

								&::after {
									border: none;
								}
							}
						}
					}
				}
			}
		}

		.password-popup-box {
			padding: @padding-xs * 2 0;
			background-color: #FFFFFF;
			box-sizing: border-box;
			.flex-col-aic();
			border-radius: @border-radius-base;
			overflow: hidden;

			.password-title {
				padding: 0 @padding-xs * 2 @padding-xs *2;
				box-sizing: border-box;
				color: @text-primary-color;
				font-size: @font-size-xxxl + 2rpx;
				font-weight: 500;
			}

			.input-box {
				width: 100%;
				padding: 0 @padding-xs * 2;
				box-sizing: border-box;
			}

			.keyboard-box {
				width: 100%;
			}
		}
	}
</style>
