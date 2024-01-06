<template>
	<view class="container">
		<view class="page-box">
			<view class="card-box">
				<swiper class="swiper" circular autoplay indicator-dots>
					<swiper-item>
						<image class="top-image" src="@/static/image/carousel-1.jpg" mode="scaleToFill" />
					</swiper-item>
					<swiper-item>
						<image class="top-image" src="@/static/image/carousel-2.jpg" mode="scaleToFill" />
					</swiper-item>
					<swiper-item>
						<image class="top-image" src="@/static/image/carousel-3.jpg" mode="scaleToFill" />
					</swiper-item>
				</swiper>
			</view>
			<view class="card-box mt-20">
				<view class="nav-grid">
					<view class="grid-item" @click="jumpCar">
						<image class="nav-icon" src="@/static/svg/car.svg" mode="scaleToFill" />
						<text class="text">我的车辆</text>
					</view>
					<view class="grid-item" @click="jumpRefuel">
						<image class="nav-icon" src="@/static/svg/pay.svg" mode="scaleToFill" />
						<text class="text">加油管理</text>
					</view>
				</view>
			</view>
			<view class="mt-20">
				<text class="title">附近油站</text>
			</view>
			<view class="list-box mt-20">
				<scroll-view scroll-y="true" @scrolltolower="scrolltolower">
					<view class="card-box mt-20" v-for="list in oilList" :key="list.caltexId">
						<view class="header">
							<view class="title">{{ list.caltexName }}</view>
							<view class="navigation">
								<image class="icon" src="@/static/svg/navigation.svg" mode="scaleToFill" />
								<text class="text">导航</text>
							</view>
						</view>
						<view class="content">
							<image class="left-img" src="@/static/svg/petrol-station.svg" mode="scaleToFill" />
							<view class="right-box">
								<view class="address">{{ list.address }}</view>
								<view class="type">
									<text class="text" v-for="(oil, index) in list.oils" :key="index">{{ oil }}</text>
								</view>
								<view class="hours">
									<image class="icon" src="@/static/svg/time.svg" mode="scaleToFill" />
									{{ list.businessHours }}
								</view>
							</view>
						</view>
					</view>
				</scroll-view>

			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		shallowRef,
		shallowReactive
	} from 'vue'
	import {
		onReady
	} from '@dcloudio/uni-app'

	import {
		getCaltex
	} from '@/api/index.js'

	const oilList = shallowRef([])

	const pagination = shallowReactive({
		pageIndex: 1,
		pageSize: 10
	})

	const scrolltolower = () => {
		pagination.pageIndex++
		getOilList()
	}

	const getOilList = async () => {
		const {
			code,
			data
		} = await getCaltex(pagination)
		if (code === 200) {
			if (pagination.pageIndex === 1) {
				oilList.value = data
			} else {
				oilList.value = oilList.value.concat(data)
			}
		}
	}

	const jumpCar = () => {
		uni.navigateTo({
			url: `/pages/car/index`,
		})
	}

	const jumpRefuel = () => {
		uni.navigateTo({
			url: `/pages/refuel/index`,
		})
	}

	onReady(() => {
		getOilList()
	})
</script>

<style lang="scss" scoped>
	.swiper {
		width: 100%;
		height: 284rpx;

		.top-image {
			width: 100%;
			height: 100%;
		}
	}

	.nav-grid {
		height: 300rpx;
		padding: 20rpx 30rpx;
		display: flex;

		.grid-item {
			flex: 1;
			height: 100%;
			font-size: 28rpx;
			color: #fff;
			text-align: center;
			border-radius: 20rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;

			&:nth-of-type(1) {
				margin-right: 15rpx;
				background-color: #be1414;

			}

			&:nth-of-type(2) {
				margin-left: 15rpx;
				background-color: #da7019;
			}

			.nav-icon {
				width: 100rpx;
				height: 100rpx;
			}

			.text {
				font-size: 36rpx;
			}
		}

	}

	.title {
		font-size: 36rpx;
		font-weight: bold;
	}

	.list-box {
		display: flex;

		.card-box {
			padding: 20rpx;

			.header {
				display: flex;

				.title,
				.navigation {
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: 28rpx;
				}

				.title {
					flex: 1;
					justify-content: flex-start;
				}

				.navigation {
					width: 164rpx;
					height: 100%;
					color: #fff;
					background-color: #f80707;
					border-radius: 10rpx;
					cursor: pointer;

					.icon {
						width: 30rpx;
						height: 30rpx;
						margin-right: 10rpx;
					}
				}
			}

			.content {
				display: flex;
				justify-content: flex-start;
				align-items: center;

				.left-img {
					width: 218rpx;
					height: 206rpx;
				}

				.right-box {
					margin-left: 20rpx;
					font-size: 28rpx;
					line-height: 60rpx;

					.type {
						display: flex;
						justify-content: space-between;
						align-items: center;

						.text {
							flex: 1;
							color: #f80707;
						}
					}

					.hours {
						display: flex;
						justify-content: flex-start;
						align-items: center;

						.icon {
							width: 42rpx;
							height: 42rpx;
							margin-right: 10rpx;
						}
					}
				}
			}
		}
	}
</style>