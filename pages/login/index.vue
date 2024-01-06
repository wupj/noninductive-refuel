<template>
	<view class="container">
		<view class="page-box">
			<image class="logo" src="@/static/logo.png" mode="scaleToFill" />
			<view class="title">无感加油</view>
			<view class="text">无需下车  即加即走 自动扣款</view>
			<view class="btn flex-center">
				<template v-if="platform === mp-weixin">
					<uni-icons type="weixin" size="30" color="#fff" />
					<view class="text" @click="openPopup">微信授权一键登录</view>
				</template>
				<template v-else>
					<view class="text" @click="openPopup">登录</view>
				</template>
			</view>
		</view>
		<uni-popup ref="popupRef" type="bottom">
			<view class="popup-header flex-center">
				<image class="logo" src="@/static/logo.png" mode="scaleToFill" />
				<view class="title">无感加油</view>
			</view>
			<view class="popup-body">
				<view class="title">获取你的手机号</view>
				<view class="grey-text">分辨用户</view>
				<view class="phone-box flex-space-between">
					<view class="left">
						<view class="phone">183****2412</view>
						<view class="grey-text">微信绑定号码</view>
					</view>
					<view class="right">
						<uni-icons type="checkmarkempty" size="30" color="#23CB0B" />
					</view>
				</view>
				<view class="blue-text">使用其他手机号码</view>
			</view>
			<view class="popup-footer">
				<button class="refuse-btn" @click="closePopup">拒绝</button>
				<button class="allow-btn" @click="closePopup">允许</button>
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

	const platform = ref('')
	const popupRef = ref()

	const openPopup = () => {
		popupRef.value.open()
	}

	const closePopup = () => {
		popupRef.value.close()
	}

	onReady(() => {
		platform.value = uni.getSystemInfoSync().uniPlatform
	})
</script>

<style lang="scss" scoped>
	.container {
		background-color: #fff;

		.page-box {
			display: flex;
			align-items: center;
			flex-direction: column;
			padding: 20rpx 60rpx;

			.logo {
				width: 350rpx;
				height: 350rpx;
			}

			.title {
				line-height: 120rpx;
				font-size: 48rpx;
				font-weight: bold;
			}

			.text {
				font-size: 40rpx;
			}

			.btn {
				margin-top: 120rpx;
				padding: 20rpx 80rpx;
				background-color: #0C790B;
				border-radius: 8rpx;
				cursor: pointer;

				.text {
					margin-left: 10rpx;
					font-size: 36rpx;
					color: #fff;
				}
			}
		}

		:deep(.uni-popup__wrapper) {
			width: calc(100% - 60rpx);
			padding: 30rpx;
			background-color: #fff !important;
			border-radius: 46rpx 46rpx 0 0;

			.popup-header {
				justify-content: flex-start;

				.logo {
					width: 80rpx;
					height: 80rpx;
				}

				.title {
					margin-left: 20rpx;
					font-size: 40rpx;
					font-weight: bold;
					display: inline-block;
				}
			}

			.popup-body {
				margin-top: 30rpx;

				.title {
					font-size: 40rpx;
					font-weight: bold;
				}

				.grey-text {
					padding: 15rpx 0;
					font-size: 36rpx;
					color: #948E8E;
					border-bottom: 1rpx solid #DAD7D7;
				}

				.phone-box {
					padding: 15rpx 0;
					border-bottom: 1rpx solid #DAD7D7;

					.phone,
					.grey-text,
					.uni-icons {
						display: inline-block;
					}

					.phone {
						font-size: 36rpx;
					}

					.grey-text {
						margin-left: 30rpx;
						border-bottom: none;
					}
				}

				.blue-text {
					padding: 15rpx 0;
					font-size: 36rpx;
					color: #2629BC;
				}
			}

			.popup-footer {
				text-align: center;
				margin: 30rpx 0 50rpx;

				.refuse-btn,
				.allow-btn {
					width: 192rpx;
					height: 68rpx;
					line-height: 68rpx;
					border-radius: 8rpx;
					display: inline-block;

					&:after {
						border: none;
					}
				}

				.refuse-btn {
					margin-right: 40rpx;
					background-color: #EDE8E8;
				}

				.allow-btn {
					margin-left: 40rpx;
					color: #fff;
					background-color: #08810F;
				}
			}
		}
	}
</style>