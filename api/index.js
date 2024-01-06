import request from '@/utils/request'

export const getCaltex = (data) => {
	return request({
		url: '/api/home/caltex',
		method: 'post',
		data
	})
}

export const getCarInfo = (data) => {
	return request({
		url: '/api/home/carInfo',
		method: 'post',
		data
	})
}

export const bindCar = (data) => {
	return request({
		url: '/api/home/bindCar',
		method: 'post',
		data
	})
}

export const order = (data) => {
	return request({
		url: '/api/refuel/order',
		method: 'post',
		data
	})
}

export const info = (data) => {
	return request({
		url: '/api/user/info',
		method: 'post',
		data
	})
}

export const billingOrder = (data) => {
	return request({
		url: '/api/user/billingOrder',
		method: 'post',
		data
	})
}

export const statistic = (data) => {
	return request({
		url: '/api/ledger/statistic',
		method: 'post',
		data
	})
}

export const fuelTrend = (data) => {
	return request({
		url: '/api/ledger/fuelTrend',
		method: 'post',
		data
	})
}

export const preference = (data) => {
	return request({
		url: '/api/ledger/preference',
		method: 'post',
		data
	})
}
