<template>
	<view class="container">
		<view class="page-box">
			<view class="card-box">
				<view class="statistic-box flex-center">
					<image class="image" src="@/static/svg/amount.svg" mode="scaleToFill" />
					<view class="statistic-text flex-center">
						<view class="text">
							<view class="label">加油总额:</view>
							<view class="value">￥{{ statisticData.totalRefuel }}</view>
						</view>
						<view class="text">
							<view class="label">累计油量:</view>
							<view class="value">￥{{ statisticData.totalOil }}</view>
						</view>
					</view>
				</view>
				<view class="chart-statistic-box trend-statistic-box">
					<view class="title">加油趋势</view>
					<view class="chart-box">
						<l-echart ref="trendChartRef" />
					</view>
				</view>
				<view class="chart-statistic-box">
					<view class="title">消费日偏好</view>
					<view class="chart-box">
						<l-echart ref="preferenceChartRef" />
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

	import LEchart from '@/uni_modules/lime-echart/components/l-echart/l-echart.vue'
	import * as echarts from '@/static/js/echarts.esm.min.js'

	import {
		statistic,
		fuelTrend,
		preference
	} from '@/api/index.js'

	const statisticData = ref({})
	const trendData = ref({})
	const preferenceData = ref({})

	const trendChartRef = ref()
	const trendChartOption = ref({
		color: ['#009dff', '#22e4ff'],
		grid: {
			top: 15,
			bottom: 50
		},
		legend: {
			bottom: 0
		},
		xAxis: {
			type: 'time',
			axisTick: {
				show: false
			},
			axisLabel: {
				formatter: '{MM}-{dd}'
			}
		},
		yAxis: {
			type: 'value'
		},
		series: [{
			type: 'line',
			name: '加油金额',
			data: []
		}, {
			type: 'line',
			name: '出油量',
			data: []
		}]
	})
	const preferenceChartRef = ref()
	const preferenceChartOption = ref({
		color: ['#009dff', '#22e4ff'],
		legend: {
			bottom: 0
		},
		radar: {
			radius: '70%',
			indicator: [{
					name: '周一'
				},
				{
					name: '周二'
				},
				{
					name: '周三'
				},
				{
					name: '周四'
				},
				{
					name: '周五'
				},
				{
					name: '周六'
				},
				{
					name: '周日'
				}
			]
		},
		series: [{
			type: 'radar',
			data: []
		}]
	})

	const getStatistic = async () => {
		const {
			code,
			data
		} = await statistic()
		if (code === 200) {
			statisticData.value = data
		}
	}

	const getFuelTrend = async () => {
		const {
			code,
			data
		} = await fuelTrend()
		if (code === 200) {
			trendData.value = data
			initTrendChart()
		}
	}

	const getPreference = async () => {
		const {
			code,
			data
		} = await preference()
		if (code === 200) {
			preferenceData.value = data
			initPreferenceChart()
		}
	}

	const initTrendChart = async () => {
		const trendChart = await trendChartRef.value.init(echarts)
		trendChartOption.value.series[0].data = trendData.value.map(o => [o.refuelTime, o.refuelAmount])
		trendChartOption.value.series[1].data = trendData.value.map(o => [o.refuelTime, o.oilOutput])
		trendChart.setOption(trendChartOption.value)
	}

	const initPreferenceChart = async () => {
		const preferenceChart = await preferenceChartRef.value.init(echarts)
		let groups = [...new Set(preferenceData.value.map(o => o.month))]
		groups.forEach(o => {
			const data = preferenceData.value.filter(i => i.month === o)
			preferenceChartOption.value.series[0].data.push({
				name: `${o}月`,
				value: data.map(o => o.count)
			})
		})
		preferenceChart.setOption(preferenceChartOption.value)
		console.log(preferenceChartOption.value)
	}

	onReady(() => {
		getStatistic()
		getFuelTrend()
		getPreference()
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

			.card-box {
				padding: 30rpx 20rpx;

				.statistic-box {
					padding: 30rpx 50rpx;
					border-bottom: 1rpx dashed #797979;

					.image {
						width: 128rpx;
						height: 128rpx;
						margin-left: 40rpx;
					}

					.statistic-text {
						flex: 1;
						display: flex;
						flex-direction: column;
						align-items: flex-start;
						margin-left: 50rpx;

						.text {
							display: flex;
							flex-direction: row;
							line-height: 60rpx;

							.label,
							.value {
								font-size: 32rpx;
							}

							.value {
								margin-left: 10rpx;
								font-size: 40rpx;
								font-weight: bold;
								color: #D26106;
							}
						}
					}
				}

				.chart-statistic-box {
					margin-top: 20rpx;

					&.trend-statistic-box {
						margin-bottom: 50rpx;
					}

					.title {
						font-size: 32rpx;
						font-weight: bold;
					}

					.chart-box {
						margin-top: 20rpx;
						width: 100%;
						height: 484rpx;
					}
				}
			}
		}
	}
</style>