<template>
	<view class="address-edit-root">
		<view class="address-content">
			<view class="item-box">
				<view class="title">{{ $t('my.address.recipient') }}</view>
				<view class="item-right">
					<u-field v-model="address.realname" input-align="right" :label-width="0" :border-bottom="false" :placeholder="$t('placeholder.fillin')" :placeholder-style="placeholderStyle"></u-field>
				</view>
			</view>
			<view class="item-box">
				<view class="title">{{ $t('common.country') }}</view>
				<view class="item-right">
					<u-field v-model="address.country_str" @click="onClickSelectArea" input-align="right" :label-width="0" :border-bottom="false" :placeholder="$t('placeholder.select')" :disabled="true" :placeholder-style="placeholderStyle"></u-field>
				</view>
			</view>
			<view class="item-box">
				<view class="title">{{ $t('form.phone') }}</view>
				<view class="item-right">
					<u-field v-model="address.tel" input-align="right" :label-width="0" type="number" :border-bottom="false" :placeholder="$t('placeholder.fillin')" :placeholder-style="placeholderStyle"></u-field>
				</view>
			</view>
			<view class="item-box">
				<view class="title">NFT</view>
				<view class="item-right">
					<u-field v-model="address.nft" input-align="right" :label-width="0" :border-bottom="false" :placeholder="$t('placeholder.fillin')" :placeholder-style="placeholderStyle"></u-field>
				</view>
			</view>
			<view class="detail-box">
				<u-field :disabled="disabledDetail" type="textarea" :placeholder-style="placeholderStyle" :label-width="0" :border-bottom="false" v-model="address.address" :placeholder="$t('placeholder.fillin')"></u-field>
			</view>
			<view class="def-box">
				<view class="def-title">{{ $t('my.address.default') }}</view>
				<u-switch name="isdef" size="44" :active-color="themeColor" v-model="isDef" @change="onChangeDefaultAddress"></u-switch>
			</view>
			<view class="btn-box">
				<button @click="onSubmitAddress" :style="indexConfig ? indexConfig.btnStyle.primary : ''" class="save-btn">{{ $t('common.save') }}</button>
			</view>
		</view>
		<u-select v-model="showArea" :list="indexConfig ? indexConfig.countryRes : []" mode="single-column" value-name="key" label-name="val" :confirm-text="$t('common.confirm')" :cancel-text="$t('common.cancel')" :default-value="defValue" @confirm="onSelectCountryConfirm"></u-select>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				addressFrom: 1,
				discernStr: '',
				placeholderStyle: 'font-size: 28rpx; color: #999;',
				isDef: false,
				address: {
					realname: '',
					tel: '',
					country: 0,
					country_str: '',
					address: '',
					is_def: 0,
					nft: ''
				},
				disabledDetail: false,
				showArea: false,
				defValue: [0],
				userInfo: '',
			}
		},
		
		onLoad(options) {
			this.addressFrom = options.from ? options.from : 1
			this.userInfo = uni.getStorageSync(this.$api.userInfo)
			this.$set(this.address, 'country', this.userInfo.countryCode)
			this.fetchDefValue()
		},
		
		methods: {
			onChangeDefaultAddress(e) {
				this.isDef = e
				this.$set(this.address, 'is_def', this.isDef ? 1 : 0)
			},

			fetchDefValue() {
				let index = 0
				for (var i = 0; i < this.indexConfig.countryRes.length; i++) {
					let element = this.indexConfig.countryRes[i]
					if (element.key == this.address.country) {
						index = i
						this.$set(this.address, 'country_str', element.val)
						break
					}
				}
				this.defValue = [index]
			},
			
			onClickSelectArea() {
				this.showArea = true
			},

			onSelectCountryConfirm(event) {
				let data = event[0]
				this.$set(this.address, 'country', data.value)
				this.$set(this.address, 'country_str', data.label)
				this.fetchDefValue()
			},
			
			onSubmitAddress() {
				this.fetchSubmitAddress()
			},
			
			fetchSubmitAddress() {
				let params = {act: 'save', 'id': 0}
				params.realname = encodeURIComponent(this.address.realname)
				params.tel = encodeURIComponent(this.address.tel)
				params.address = encodeURIComponent(this.address.address)
				params.country = this.address.country
				params.nft = this.address.nft
				params.is_def = this.address.is_def
				this.$util.postRequest(this.$api.ud.addr_info, params, true, 
				res => {
					if (this.addressFrom == 1) {
						this.$util.showNoIconToast(res.info)
						uni.$emit('addressChange')
						setTimeout(() => {
							uni.navigateBack({
								delta:1
							})
						}, 1500)
					} else {
						uni.setStorageSync(this.$api.tempArea, JSON.stringify(res.data))
						uni.navigateBack({
							delta:2
						})
					}
				},
				err => {
					this.$util.showNoIconToast(err.info)
				})
			}
		}
	}
</script>

<style lang="less">
	page {
		height: 100%;
		background-color: #F9F9F9;
	}
	
	.address-edit-root {
		height: 100%;
		.flex-col();
		overflow: scroll;
		
		/deep/ .u-flex-1 {
			flex: 1;
		}
		
		.discern-box {
			margin-top: @padding-xs / 2;
			padding: @padding-xs;
			box-sizing: border-box;
			background-color: #FFFFFF;
			
			.textarea-box {
				width: 100%;
				padding: @padding-xs;
				border-radius: @border-radius-base;
				box-sizing: border-box;
				border: 1px solid @border-color;
				overflow: scroll;
							
				.u-field {
					padding: @padding-xs / 2 0;
					min-height: 100rpx;
					max-height: 200rpx;
				}
			}
					
			.tools-box {
				width: 100%;
				padding: @padding-xs 0 0;
				.flex-c-aic-jce();
				
				.clipboard-box {
					padding-right: @padding-xs;
				}
				
				.tools-btn {
					padding: 0 @padding-xs;
					margin: 0;
					line-height: 48rpx;
					border-radius: 48rpx;
					color: #19be6b;
					border: 1px solid #19be6b;
					font-size: @font-size-xs;
					background-color: transparent;
					
					&::after {
						border: none;
					}
				}
			}
		}
		
		.address-content {
			margin-top: @padding-xs / 2;
			
			.item-box {
				.flex-c-aic();
				padding: 0 @padding-xs;
				box-sizing: border-box;
				border-bottom: 1px solid @border-color;
				background-color: #FFFFFF;
				
				.title {
					color: @text-primary-color;
					font-size: @font-size-base;
				}
				
				.item-right {
					.flex-c-aic();
					flex: 1;
					overflow: hidden;
					
					/deep/.u-field {
						width: 100%;
						color: @text-primary-color;
						font-size: @font-size-base;
						padding: @padding-xs + 10rpx @padding-xs;
					}
				}
			}
			
			.detail-box {
				padding: @padding-xs / 2 @padding-xs 0;
				background-color: #FFFFFF;
				
				.u-field {
					color: @text-primary-color;
					font-size: @font-size-base;
					padding: @padding-xs 0;
				}
				
				.u-textarea-class {
					min-height: 160rpx;
					max-height: 160rpx;
				}
			}
			
			.def-box {
				margin-top: @padding-xs / 2;
				.flex-c-aic-jcb();
				background-color: #FFFFFF;
				padding: @padding-xs + 10rpx @padding-xs;
				
				.def-title {
					color: @text-primary-color;
					font-size: @font-size-base;
				}
			}
			
			.btn-box {
				width: 100%;
				margin-top: @padding-xs * 2;
				padding: 0 @padding-xs;
				box-sizing: border-box;
				
				.save-btn {
					background-color: @primary-color;
					.flex-c-aic-jcc();
					font-size: @font-size-base;
					color: #FFFFFF;
					font-weight: normal;
					line-height: 80rpx;
					width: 100%;
					border-radius: @border-radius-base;
				}
			}
		}
	}
</style>
