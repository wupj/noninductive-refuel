<template>
	<view class="container">
		<view class="page-box">
			<view class="card-box">
				<view class="select-time flex-center">
					<view class="title">选择时间</view>
					<view class="shortcut-time flex-space-between">
						<view class="shortcut-time-item" :class="{active: shortcutKey === list.key}"
							v-for="list in shortcutTime" :key="list.key" @click="changeShortcutTime(list.key)">
							<view class="label">{{ list.label }}</view>
						</view>
					</view>
				</view>
				<view class="time-range">
					<uni-datetime-picker type="datetimerange" rangeSeparator="至" :start="queryParams.startTime"
						:end="queryParams.endTime" :hide-second="true" @change="getOrderList" />
				</view>
				<view class="order-box">
					<view class="order-top flex-space-between">
						<view class="title">选择开票订单</view>
						<view class="select-all">
							<label>
								<checkbox :value="-1" :checked="selectAll === -1" @click="changeSelectAll" />全选
							</label>
						</view>
					</view>
					<view class="list-box mt-20">
						<scroll-view class="scroll-Y" scroll-y="true" @scrolltolower="scrolltolower">
							<view class="list-item" v-for="list in orderList" :key="list.orderNo">
								<label class="flex-center">
									<checkbox :value="list.orderNo" :checked="selectCheckbox.includes(list.orderNo)"
										@click="changeSingleSelect(list)" />
								</label>
								<view class="list-item-card">
									<view class="text-box flex-space-between">
										<view class="text">订单号: {{ list.orderNo }}</view>
										<view class="text"><uni-dateformat :date="list.orderTime"></uni-dateformat>
										</view>
									</view>
									<view class="text-box">
										<view class="text">实付金额: ￥{{ list.actualAmount }}</view>
									</view>
									<view class="text-box flex-space-between">
										<view class="text red-text">开票金额: ￥{{ list.invoiceAmount }}</view>
										<view class="text text-btn" @click="clickRow(list)">金额明细</view>
									</view>
								</view>
							</view>
						</scroll-view>
					</view>
				</view>
			</view>
			<uni-popup ref="popupRef" :is-mask-click="false">
				<view class="popup-header"><uni-icons type="closeempty" size="25" @click="closePopup" /></view>
				<view class="popup-body">
					<view class="title">金额明细</view>
					<view class="text">订单金额: ￥{{ popupRow.orderAmount }}</view>
					<view class="text">优惠金额: ￥{{ popupRow.discountAmount }}</view>
					<view class="text">实付金额: ￥{{ popupRow.actualAmount }}</view>
					<view class="text">开票金额: ￥{{ popupRow.invoiceAmount }}</view>
				</view>
			</uni-popup>
		</view>
		<view class="footer flex-space-between">
			<view class="text">
				<view class="label">合计金额:</view>
				<view class="value">￥{{ totalAmount }}</view>
			</view>
			<view class="btn flex-center">开发票</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		shallowRef,
		shallowReactive,
		computed
	} from 'vue'
	import {
		onReady
	} from '@dcloudio/uni-app'

	import {
		formatDate
	} from '@/uni_modules/uni-dateformat/components/uni-dateformat/date-format.js';

	import {
		billingOrder
	} from '@/api/index.js'

	const shortcutKey = shallowRef(30)
	const shortcutTime = shallowRef([{
		key: 30,
		label: '30天内'
	}, {
		key: 60,
		label: '60天内'
	}, {
		key: 90,
		label: '90天内'
	}])
	const queryParams = shallowReactive({
		startTime: undefined,
		endTime: undefined,
		pageIndex: 1,
		pageSize: 10
	})
	const orderList = ref([])

	const selectAll = ref()
	const selectCheckbox = ref([])
	const selectCheckRow = ref([])

	const popupRef = ref()
	const popupRow = ref({})

	const totalAmount = computed(() => {
		let amount = 0
		selectCheckRow.value.forEach(item => {
			amount += item.actualAmount
		})
		return amount
	})

	const changeShortcutTime = (val) => {
		if (shortcutKey.value !== val) {
			shortcutKey.value = val
			changeTime()
		}
	}

	const changeTime = () => {
		const nowDate = new Date().setSeconds(0, 0)
		queryParams.endTime = formatDate(nowDate)
		queryParams.startTime = formatDate(nowDate - shortcutKey.value * 24 * 60 * 60 * 1000)
		getOrderList()
	}

	const changeSelectAll = (val) => {
		selectAll.value = selectAll.value ? undefined : -1
		if (selectAll.value === -1) {
			selectCheckbox.value = orderList.value.map(o => o.orderNo)
			selectCheckRow.value = orderList.value
		} else {
			selectCheckbox.value = []
			selectCheckRow.value = []
		}
	}

	const changeSingleSelect = (list) => {
		if (selectCheckbox.value.includes(list.orderNo)) {
			const index = selectCheckbox.value.indexOf(list.orderNo)
			selectCheckbox.value.splice(index, 1)
			selectCheckRow.value.splice(index, 1)
		} else {
			selectCheckbox.value.push(list.orderNo)
			selectCheckRow.value.push(list)
		}
		if (selectCheckbox.value.length === orderList.value.length) {
			selectAll.value = -1
		} else {
			selectAll.value = undefined
		}
	}

	const scrolltolower = () => {
		queryParams.pageIndex++
		getOrderList()
	}

	const getOrderList = async () => {
		const {
			code,
			data
		} = await billingOrder(queryParams)
		if (code === 200) {
			if (queryParams.pageIndex === 1) {
				orderList.value = data
			} else {
				orderList.value = orderList.value.concat(data)
			}

		}
	}

	const clickRow = (row) => {
		popupRow.value = row
		popupRef.value.open()
	}

	const closePopup = () => {
		popupRow.value = {}
		popupRef.value.close()
	}

	onReady(() => {
		changeTime()
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
			margin-bottom: 204rpx;

			.card-box {
				padding: 30rpx 20rpx;

				.select-time {
					display: flex;

					.title {
						font-size: 32rpx;
						font-weight: bold;
						display: inline-block;
					}

					.shortcut-time {
						margin-left: 50rpx;
						flex: 1;

						.shortcut-time-item {
							width: 124rpx;
							height: 52rpx;
							text-align: center;
							line-height: 52rpx;
							color: #333;
							background-color: #fff;
							border: 1rpx solid #797979;
							cursor: pointer;

							&.active {
								color: #fff;
								background-color: #0962AD;
								border: 1rpx solid #0962AD;
							}
						}
					}

				}

				.time-range {
					margin-top: 50rpx;
				}

				.order-box {
					margin-top: 50rpx;

					.order-top {
						font-weight: bold;

						.title {
							font-size: 32rpx;
						}

						.select-all {
							font-size: 28rpx;

							:deep(.uni-checkbox-wrapper) {
								.uni-checkbox-input {
									width: 30rpx;
									height: 30rpx;
								}
							}
						}
					}

					.list-box {
						display: flex;

						.scroll-Y {
							height: 100%;
						}

						.list-item {
							display: flex;
							padding: 10rpx;
							margin-bottom: 30rpx;

							&:last-of-type {
								margin-bottom: 0;
							}

							:deep(.uni-label-pointer) {
								width: 150rpx;

								.uni-checkbox-input {
									width: 30rpx;
									height: 30rpx;
								}
							}

							.list-item-card {
								flex: 1;
								padding: 20rpx 40rpx;
								font-size: 20rpx;
								box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.32);

								.text-box {
									line-height: 40rpx;

									.red-text {
										color: #DF6611;
									}

									.text-btn {
										padding: 6rpx 15rpx;
										background-color: #F0EEEE;
										border-radius: 5rpx;
										cursor: pointer;
									}
								}
							}
						}
					}

				}

			}

			:deep(.uni-popup__wrapper) {
				width: 60%;
				padding: 30rpx;
				background-color: #fff !important;

				.popup-header {
					text-align: right;

					.uni-icons {
						cursor: pointer;
					}
				}

				.popup-body {
					text-align: center;
					line-height: 50rpx;
					font-size: 32rpx;

					.title {
						font-weight: bold;
					}
				}
			}
		}

		.footer {
			position: fixed;
			left: 0;
			bottom: 0;
			width: calc(100% - 60rpx);
			height: 184rpx;
			padding: 0 30rpx;
			background-color: #fff;

			.text {
				display: flex;
				flex-direction: row;
				font-size: 32rpx;
				font-weight: bold;

				.value {
					margin-left: 10rpx;
					color: #C34D07;
				}
			}

			.btn {
				height: 58rpx;
				font-size: 28rpx;
				padding: 6rpx 20rpx;
				color: #fff;
				background-color: #DA1313;
				border-radius: 5rpx;
				cursor: pointer;
			}
		}
	}
</style>