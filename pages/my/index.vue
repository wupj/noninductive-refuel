<template>
	<view class="container">
		<view class="page-box">
			<view class="card-box user-box">
				<view class="user-box-top">
					<image class="user-icon" :src="userInfo.avatar" mode="scaleToFill" />
					<view class="user-info flex-center">
						<view class="name">{{ userInfo.userName }}</view>
						<view class="phone">{{ userInfo.phone }}</view>
					</view>
					<uni-icons type="gear" size="30" />
				</view>
				<view class="user-box-bottom">
					<view class="balance-box flex-center">
						<view class="label">账户余额（元）</view>
						<view class="value">{{ userInfo.balance }}</view>
					</view>
					<view class="coupon-box flex-center">
						<view class="label">优惠券（张）</view>
						<view class="value">{{ userInfo.coupon }}</view>
					</view>
				</view>
			</view>
			<view class="card-box grid-box mt-20">
				<view class="grid-item flex-center" v-for="(list, index) in gridList" :key="index">
					<navigator :url="list.path" hover-class="none" class="flex-center navigator-item">
						<image class="icon" :src="`/static/svg/${list.icon}.svg`" mode="scaleToFill" />
						<view class="label mt-20">{{ list.label }}</view>
					</navigator>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		shallowRef
	} from 'vue'
	import {
		onReady
	} from '@dcloudio/uni-app'

	import {
		info
	} from '@/api/index.js'

	const userInfo = ref({})
	const gridList = shallowRef([{
		icon: 'recharge',
		label: '账户充值',
		path: ''
	}, {
		icon: 'payment',
		label: '加油开票',
		path: '/pages/invoice/index'
	}, {
		icon: 'ledger',
		label: '加油账本',
		path: '/pages/ledger/index'
	}, {
		icon: 'invite',
		label: '邀请注册',
		path: ''
	}, {
		icon: 'collect',
		label: '油站收藏',
		path: ''
	}, {
		icon: 'car',
		label: '我的车辆',
		path: '/pages/car/index'
	}])

	const getUserInfo = async () => {
		const {
			code,
			data
		} = await info()
		if (code === 200) {
			userInfo.value = data
		}
	}

	onReady(() => {
		getUserInfo()
	})
</script>

<style lang="scss" scoped>
	.container {
		position: relative;
		background-color: #e5e2e3;

		&::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 248rpx;
			background-color: #ee2828;
			display: block;
		}

		.page-box {
			position: relative;
			margin-top: 124rpx;

			.user-box {
				padding: 30rpx 30rpx 40rpx;
				background-color: #fff;

				.user-box-top {
					position: relative;
					display: flex;
					flex-direction: row;

					.user-icon {
						width: 180rpx;
						height: 180rpx;
						border-radius: 50%;
					}

					.user-info {
						align-items: flex-start;
						flex-direction: column;
						margin-left: 20rpx;
						font-size: 24rpx;
						font-size: 28rpx;
						font-weight: bold;
						line-height: 70rpx;
					}

					:deep(.uni-icons) {
						position: absolute;
						top: 0;
						right: 0;
					}
				}

				.user-box-bottom {
					margin-top: 40rpx;
					display: flex;
					flex-direction: row;
					font-size: 28rpx;

					.balance-box,
					.coupon-box {
						flex: 1;
						flex-direction: column;

						.value {
							font-weight: bold;
						}
					}
				}
			}

			.grid-box {
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				padding: 20rpx;

				.grid-item {
					width: 33.33%;

					&:nth-of-type(4),
					&:nth-of-type(5),
					&:nth-of-type(6) {
						margin-top: 20rpx;
					}

					.navigator-item {
						display: flex;
						flex-direction: column;
						overflow: hidden;
						cursor: pointer;

						.icon {
							width: 120rpx;
							height: 120rpx;
							transform: translateX(-100%);
							filter: drop-shadow(120rpx 0 #000);
						}

						.label {
							font-size: 32rpx;
							font-weight: bold;
						}
					}


				}
			}
		}
	}
</style>