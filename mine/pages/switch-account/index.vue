<template>
	<view v-if="loaded" class="common-page-root">
		<zx-navbar>
			<view slot="left" class="navbar-left" :style="{ 'width': capsule ? capsule.width + 20 + 'px' : '110px' }">
				<u-icon @click="onClickBack" custom-prefix="zx-icon" name="nav-back" size="44" color="#333"></u-icon>
			</view>
			<view slot="title" class="navbar-middle">
				<view class="middle-title"></view>
			</view>
			<view slot="right" class="navbar-right" :style="{ 'width': capsule ? capsule.width + 20 + 'px' : '110px' }">
				
			</view>
		</zx-navbar>
		<view class="login-content" :style="{'padding-top': (statusH + 54) + 'px'}">
			<view class="header-box">
				<view class="header-title">{{ $t('my.switch') }}</view>
				<view class="header-subtitle">{{ $t('switch.click.switch.user') }}</view>
			</view>
			<view class="mescroll-box">
				<mescroll-uni :fixed="false" :safearea="true" :up="up" @init="mescrollInit" @down="downCallback">
					<view class="switch-mescrool-root">
						<view class="switch-mescrool-box">
							<block v-if="userList.length > 0">
								<view @click="onClickUserItem(index)" v-for="(item, index) in userList" :key="index" class="user-item">
									<view class="item-left">
										<image webp="true" lazy-load="true" class="user-avatar" :src="item.icon"></image>
										<view class="user-box">
											<view class="nickname">Leaf</view>
											<u-tag v-if="item.id == currentId" :text="$t('switch.current')" mode="plain" border-color="#c00" color="#c00" size="mini" type="error"></u-tag>
										</view>
									</view>
									<button @click.stop="onClickDeleteUser(index)" class="delete-btn">{{ $t('common.delete') }}</button>
								</view>
							</block>
							<block v-else>
								<zx-empty></zx-empty>
							</block>
						</view>
					</view>
				</mescroll-uni>
			</view>
			<view v-if="userList.length > 0" class="page-footer">
				<view class="page-footer-box">
					<view class="delete-box">
						<view class="all-txt">{{ $t('switch.total') }}{{ userList.length }}{{ $t('switch.users') }}</view>
						<button @click="onClickDeleteAll" class="delete-all">{{ $t('switch.clear.all') }}</button>
					</view>
				</view>
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
				up: {
					use: false
				},
				userList: [],
				currentId: 0
			}
		},
		
		onLoad() {
			this.fetchLocalUserList()
		},
		
		methods: {
			onClickBack() {
				this.$util.navigateBack()
			},
			
			fetchLocalUserList() {
				let localList = uni.getStorageSync(this.$api.userList)
				this.userList = localList ? JSON.parse(localList) : ['', '']
				if (this.mescroll) {
					this.mescroll.endSuccess()
				}
			},
			
			mescrollInit(mescroll) {
				this.mescroll = mescroll
			},
			
			downCallback() {
				this.fetchLocalUserList()
			},
			
			onClickUserItem(index) {
				let current = this.userList[index]
				if (current.id == this.currentId) {
					return
				}
				let that = this
				uni.showModal({
					title: that.$t('common.warm.prompt'),
					content: that.$t('switch.confirm.switch'),
					confirmText: that.$t('common.confirm'),
					cancelText: that.$t('common.cancel'),
					cancelColor: '#999',
					confirmColor: that.themeColor,
					success: (res) => {
						if (res.confirm) {
							let params = {
								cert: current.authorization
							}
							that.$util.postRequest(that.$api.auth.switch, params, true,
								res => {
									// console.log('res=====>',JSON.stringify(res))
									that.$u.vuex('loginStatus', false)
									that.$util.showNoIconToast(res.info)
				
									that.$util.setLocalUserInfo(res.data.userRow)
									uni.setStorageSync(that.$api.authorization, res.data.authorization)
				
									//更新本地用户列表记录
									let currentUser = Object.assign({}, res.data.userRow)
									currentUser.authorization = res.data.authorization
									if (that.userList.length > 0) {
										//查询本地是否存在当前用户记录,不存在新增，存在更新
										let index = util.localExistCurrentUser(Object.assign([], that.userList), currentUser)
										if (index >= 0) {
											//存在记录-更新
											that.$util.updateLocalUserWithIndex(Object.assign([], that.userList), index, currentUser)
										} else {
											//记录不存在-新增
											that.$util.insertLocalUserWithUser(Object.assign([], that.userList), currentUser)
										}
									} else {
										//直接新增记录
										that.$util.insertLocalUserWithUser(Object.assign([], that.userList), currentUser)
									}
				
									setTimeout(() => {
										that.$u.vuex('loginStatus', true)
										that.$util.miniAppRoute('/pages/index/index')
									}, 1500)
								},
								err => {
									that.$util.showNoIconToast(err.info)
									that.$util.removeLocalUserWithIndex(Object.assign([], this.userList), index)
									this.fetchLocalUserList()
								})
						}
					}
				})
			},
			
			onClickDeleteUser(index) {
				let that = this
				uni.showModal({
					title: that.$t('common.warm.prompt'),
					content: that.$t('switch.delete.current'),
					confirmText: that.$t('common.confirm'),
					cancelText: that.$t('common.cancel'),
					cancelColor: that.themeColor,
					confirmColor: '#999',
					success: (res) => {
						if (res.confirm) {
							that.$util.removeLocalUserWithIndex(Object.assign([], that.userList), index)
							that.fetchLocalUserList()
						}
					}
				})
			},
			
			onClickDeleteAll() {
				let that = this
				uni.showModal({
					title: that.$t('common.warm.prompt'),
					content: that.$t('switch.delete.all'),
					confirmText: that.$t('common.confirm'),
					cancelText: that.$t('common.cancel'),
					cancelColor: that.themeColor,
					confirmColor: '#999',
					success: (res) => {
						if (res.confirm) {
							that.$util.clearLocalUser()
							that.fetchLocalUserList()
						}
					}
				})
			}
		}
	}
</script>

<style lang="less">
	page {
		.hper-100();
		// background-color: @background-color;
	}
	
	.login-content {
		.flex-col();
		padding: 0 @padding-xs;
		box-sizing: border-box;
		height: 100%;
		overflow: scroll;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
	
		.header-box {
			padding: @padding-xs * 2 @padding-xs * 2;
			box-sizing: border-box;
			
			.header-title {
				font-size: 40rpx;
				font-weight: 500;
				color: @text-primary-color;
			}
			
			.header-subtitle {
				font-size: @font-size-base;
				color: @text-secondary-color;
				padding-top: @padding-xs / 2;
			}
		}
		
		.switch-mescrool-root {
			.pbsafe();
			overflow: hidden;
			
			.switch-mescrool-box {
				padding: 0 @padding-xs;
				box-sizing: border-box;
				
				.user-item {
					.flex-c-aic-jcb();
					.common-shadow();
					padding: @padding-xs;
					box-sizing: border-box;
					border-radius: @border-radius-base * 2;
					margin-top: @common-blank * 2;
					
					&:last-child {
						margin-bottom: @common-blank * 2;
					}
					
					.item-left {
						flex: 1;
						.flex-c-aic();
						overflow: hidden;
						box-sizing: border-box;
						padding-right: @padding-xs;
						
						.user-avatar {
							width: 80rpx;
							height: 80rpx;
							vertical-align: middle;
							border-radius: 80rpx;
							overflow: hidden;
							background-color: @primary-color;
						}
						
						.user-box {
							padding-left: @padding-xs;
							box-sizing: border-box;
							flex: 1;
							overflow: hidden;
							.flex-c-aic();
							
							.nickname {
								color: @text-primary-color;
								font-size: @font-size-lg;
								font-weight: 500;
								padding-right: @padding-xs / 2;
							}
						}
					}
					
					.delete-btn {
						color: @red-color;
						font-size: @font-size-sm;
						padding: 0 @padding-xs / 2;
						margin: 0;
						width: auto;
						background-color: transparent;
						font-size: @font-size-sm;
						line-height: 64rpx;
						.flex-c-aic-jcc();
						
						&::after {
							border: none;
						}
					}
				}
			}
		}
	
		.delete-box {
			.flex-col-aic-jcc();
			color: @primary-color;
			font-size: @font-size-base;
			
			.all-txt {
				margin-bottom: @common-blank;
			}
			
			.delete-all {
				line-height: 80rpx;
				margin: 0;
				padding: 0;
				.wper-100();
				background-color: @red-color;
				color: #fff;
				font-size: @font-size-base;
				border-radius: @border-radius-base * 2;
				overflow: hidden;
				
				&::after {
					border: none;
				}
			}
		}
	}
</style>