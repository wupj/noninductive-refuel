<template>
	<view class="container">
		<view class="page-box">
			<view class="card-box">
				<view class="plate-box">
					<view class="title">车牌号</view>
					<view class="content">
						<view class="label">新能源</view>
						<view class="plate-input-box">
							<view class="plate-input-item" v-for="(index) in 7" :key="index">
								<input class="plate-input" :value="plateNo[index]"
									@input="inputPlateNo($event, index)" />
							</view>
							<view class="plate-input-item"><input class="plate-input" :value="plateNo[index]"
									@input="inputPlateNo($event, 7)" :disabled="carInfo.carColor !== 'green'" /></view>
						</view>
					</view>
				</view>
				<view class="color-box mt-20">
					<view class="title">车牌颜色</view>
					<view class="content mt-10">
						<uni-data-checkbox v-model="carInfo.carColor" :localdata="carColor"></uni-data-checkbox>
					</view>
				</view>
				<view class="oils-box mt-20">
					<view class="title">油品</view>
					<view class="content mt-10">
						<uni-data-checkbox v-model="carInfo.oils" :localdata="oils"></uni-data-checkbox>
					</view>
				</view>
				<view class="footer">
					<button class="footer-btn" @click="handleOpen">立即开通无感付</button>
				</view>
			</view>
		</view>
		<uni-popup ref="popupRef" :is-mask-click="false">
			<view class="title"><uni-icons type="closeempty" size="24" @click="closePopup" /></view>
			<view class="popup-body mt-20">
				<view class="plate">
					<view class="text">{{ carInfo.plateNo }}</view>
				</view>
				<view class="label mt-20">已开通无感付！</view>
				<view class="open-label" @click="closePopup">开通微信免密支付&gt;&gt;</view>
			</view>
		</uni-popup>
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
		bindCar
	} from '@/api/index.js'

	const carInfo = ref({})
	const plateNo = ref([null, null, null, null, null, null, null, null])
	const carColor = shallowRef([{
			text: '蓝色',
			value: 'blue'
		},
		{
			text: '绿色',
			value: 'green'
		},
		{
			text: '黄色',
			value: 'yellow'
		}
	])
	const oils = shallowRef([{
			text: '92#',
			value: '92'
		},
		{
			text: '95#',
			value: '95'
		},
		{
			text: '98#',
			value: '98'
		},
		{
			text: '0#',
			value: '0'
		}
	])
	const popupRef = ref()


	const inputPlateNo = ($event, index) => {
		plateNo.value[index] = $event.detail.value
	}

	const handleOpen = async () => {
		carInfo.value.plateNo = plateNo.value.join('')
		const {
			code,
			message
		} = await bindCar(carInfo.value)
		if (code === 200) {
			uni.setStorageSync('carInfo', carInfo.value)
			popupRef.value.open()
		}
	}

	const closePopup = () => {
		popupRef.value.close()
		uni.redirectTo({
			url: `/pages/car/index`,
		})
	}

	onReady(() => {})
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
			height: calc(100vh - 258rpx);
			margin-top: 124rpx;

			.card-box {
				height: calc(100% - 80rpx);
				padding: 40rpx 30rpx;

				.title {
					font-size: 36rpx;
					font-weight: bold;
				}

				.plate-box,
				.color-box,
				.oils-box {
					padding-bottom: 20rpx;
					border-bottom: 1rpx solid #dad7d7;
				}

				.plate-box {
					.label {
						text-align: right;
						font-size: 16rpx;
						margin-bottom: 10rpx;
						padding-right: 16rpx;
					}

					.plate-input-box {
						display: flex;
						justify-content: space-between;
						align-items: center;

						.plate-input-item {
							width: 12.5%;
							display: flex;
							justify-content: space-evenly;

							.plate-input {
								width: 50rpx;
								height: 50rpx;
								text-align: center;
								border: 1rpx solid #797979;

								:deep(.uni-input-input) {
									&:disabled {
										background-color: #dad7d7;
										cursor: not-allowed;
									}
								}
							}
						}
					}
				}

				.footer {
					margin-top: 100rpx;

					.footer-btn {
						font-size: 36rpx;
						color: #fff;
						background-color: #ee2828;
						border: none;
					}
				}
			}
		}

		:deep(.uni-popup__wrapper) {
			width: 90%;
			background-color: #fff !important;
			padding: 20rpx;
			border-radius: 20rpx;

			.title {
				text-align: right;
			}

			.plate {
				display: flex;
				justify-content: center;
				align-items: center;
				height: 128rpx;
				font-size: 36rpx;
				font-weight: bold;
				letter-spacing: 50rpx;
				background-color: #4d70d8;

				.text {
					padding: 20rpx 40rpx;
					border-top: 1rpx solid #fff;
					border-bottom: 1rpx solid #fff;
				}
			}

			.label,
			.open-label {
				text-align: center;
				font-size: 32rpx;
			}

			.open-label {
				margin-top: 60rpx;
				color: #f50a0a;
				font-size: 28rpx;
			}
		}
	}
</style>