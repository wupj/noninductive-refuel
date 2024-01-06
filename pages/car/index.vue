<template>
	<view class="container">
		<view class="page-box">
			<view class="card-box plate-box">
				<view class="header">
					<view class="title">我的车辆</view>
					<view class="switch-box flex-center">
						<view class="switch-text">已开通无感付</view>
						<switch :checked="carInfo.noSense" color="#F75F1E" />
					</view>
				</view>
				<view class="plate-box flex-center">
					<view class="plate flex-center">
						<view class="text">{{ carInfo.plateNo }}</view>
					</view>
					<view class="btn-group">
						<uni-icons type="compose" size="24" @click="handleEdit" />
						<uni-icons type="trash" size="24" @click="handleDelete" />
					</view>
				</view>
			</view>
			<view class="card-box accredit-box mt-20">
				<view class="header">
					<view class="title">第三方支付</view>
				</view>
				<view class="pay-box">
					<view class="pay-item flex-center" v-for="(list, index) in payList" :key="index">
						<view class="left flex-center">
							<uni-icons :type="list.icon" color="#099C07" size="24" />
							<view class="text">{{ list.title }}</view>
						</view>
						<view class="right">
							<view class="text" v-if="carInfo[list.key]">已开通</view>
							<view class="text red-text" v-else>未开通>></view>
						</view>
					</view>
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
		getCarInfo
	} from '@/api/index.js'

	const carInfo = ref({})
	const payList = shallowRef([{
			icon: 'weixin',
			title: '微信代扣',
			key: 'isWechat'
		},
		{
			icon: 'wallet',
			title: '招行免密',
			key: 'isCMBC'
		}
	])

	const handleEdit = () => {
		uni.navigateTo({
			url: `/pages/car/bindCar`,
		})
	}
	const handleDelete = () => {
		carInfo.value = {}
		uni.removeStorage({
			key: 'carInfo'
		})
		uni.navigateTo({
			url: `/pages/car/bindCar`,
		})
	}

	onReady(async () => {
		const {code, data } = await getCarInfo()
		if (code === 200) {
			carInfo.value = data
			uni.setStorageSync('carInfo', data)
		} else {
			uni.redirectTo({
				url: `/pages/car/bindCar`,
			})
		}
	})
</script>

<style lang="scss" scoped>
	.container {
		position: relative;

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

			.card-box {
				padding: 40rpx 30rpx;

				&.plate-box {
					height: 366rpx;

					.header {
						display: flex;
						justify-content: space-between;
						align-items: center;
						flex-direction: row;

						.title {
							font-size: 32rpx;
							color: #000;
						}

						.switch-box {
							flex-direction: row;

							.switch-text {
								font-size: 24rpx;
								color: #928B8B;
								margin-right: 10rpx;
							}

							:deep(.uni-switch-input) {
								width: 96rpx;
								height: 42rpx;

								&::before,
								&::after {
									width: 36rpx;
									height: 36rpx;
								}

								&.uni-switch-input-checked {
									&::after {
										transform: translateX(56rpx);
									}
								}
							}
						}
					}

					.plate-box {
						padding: 40rpx 0 70rpx;
						flex-direction: column;
						border-bottom: 1rpx solid #DAD7D7;

						.plate {
							width: 418rpx;
							height: 128rpx;
							font-size: 36rpx;
							font-weight: bold;
							letter-spacing: 20rpx;
							background-color: #4d70d8;

							.text {
								padding: 20rpx 40rpx;
								border-top: 1rpx solid #fff;
								border-bottom: 1rpx solid #fff;
							}
						}

						.btn-group {
							margin-top: 30rpx;
							width: 100%;
							text-align: right;
						}
					}
				}

				&.accredit-box {
					height: 206rpx;

					.title {
						font-size: 32rpx;
						color: #000;
					}

					.pay-box {
						margin-top: 40rpx;

						.pay-item {
							justify-content: space-between;
							flex-direction: row;
							line-height: 60rpx;

							.left {
								justify-content: flex-start;

								.text {
									margin-left: 10rpx;
								}
							}

							.right {
								justify-content: flex-end;
								.text {
									font-size: 28rpx;
									&.red-text {
										color: #E60808;
										cursor: pointer;
									}
								}
							}
						}
					}
				}
			}
		}
	}
</style>