<template>
	<view class="container">
		<view class="page-box">
			<view class="tab-box">
				<uni-segmented-control :current="tabKey" :values="tabList" @clickItem="changeTab" styleType="button"
					activeColor="#EE2828" />
			</view>
			<view class="list-box mt-20">
				<view class="list-item" v-for="(list, index) in orderList" :key="index">
					<view class="list-item-top flex-space-between ">
						<view class="name">{{ list.caltexName }}</view>
						<view class="state">{{ list.orderState === 1 ? '已完成' : '已取消' }}</view>
					</view>
					<view class="list-item-middle mt-10">
						<view class="money-text">
							<view class="label">加油金额:</view>
							<view class="value">￥{{ list.refuelAmount }}</view>
						</view>
						<view class="money-text">
							<view class="label">加油升数:</view>
							<view class="value">{{ list.refuelLitres }}L</view>
						</view>
						<view class="money-bold-text">
							<view class="discount-text">
								<view class="label">优惠:</view>
								<view class="value">￥{{ list.discountAmount }}</view>
							</view>
							<view class="actual-text">
								<view class="label">实付:</view>
								<view class="value">￥{{ list.actualAmount }}</view>
							</view>
						</view>
					</view>
					<view class="list-item-bottom flex-space-between mt-10">
						<view class="order-no">{{ list.orderNo }}</view>
						<view class="time"><uni-dateformat :date="list.orderTime" /></view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		shallowRef,
		shallowReactive
	} from 'vue'

	import {
		onReady
	} from '@dcloudio/uni-app'

	import {
		order
	} from '@/api/index.js'

	const tabKey = ref(0)
	const tabList = shallowRef(['全部', '已完成', '已取消'])
	const pagination = shallowReactive({
		pageIndex: 1,
		pageSize: 10
	})
	const orderList = ref([])

	const changeTab = (e) => {
		if (tabKey.value !== e.currentIndex) {
			tabKey.value = e.currentIndex
			getData()
		}
	}

	const getData = async () => {
		const {
			code,
			data
		} = await order({
			...pagination,
			orderState: tabKey.value === 0 ? -1 : tabKey.value
		})
		if (code === 200) {
			orderList.value = data
		}
	}

	onReady(() => {
		getData()
	})
</script>

<style lang="scss" scoped>
	.container {
		background-color: #e5e2e3;

		.tab-box {
			:deep(.segmented-control) {
				height: 76rpx;
				background-color: #fff;
				border-radius: 10rpx;
			}
		}

		.list-box {
			.list-item {
				margin-top: 20rpx;
				padding: 20rpx 30rpx;
				background-color: #fff;
				font-size: 24rpx;

				&:first-of-type {
					margin-top: 0;
				}

				.list-item-top {
					.name {
						font-weight: bold;
					}

					.state {
						color: #0D00FF;
						font-weight: bold;
					}
				}

				.list-item-middle {
					.money-text {
						display: flex;
						flex-direction: row;

						.label {
							margin-right: 10rpx;
						}

						.value {
							font-weight: bold;
						}
					}

					.money-bold-text {
						display: flex;
						flex-direction: row;
						justify-content: flex-end;

						.discount-text,
						.actual-text {
							display: flex;
							flex-direction: row;

							.value {
								font-weight: bold;
							}
						}

						.actual-text {
							margin-left: 20rpx;

							.value {
								color: #0D00FF;
							}
						}
					}
				}
			}
		}
	}
</style>