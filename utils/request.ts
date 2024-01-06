import ENV_CONFIG from './env.js'

const { NODE_ENV } = process.env

const request = (config: any) => {
	config.url = `${ENV_CONFIG[NODE_ENV].baseUrl}${config.url}`
	const promise = new Promise(function (resolve, reject) {
		uni.showLoading({
			title: '请稍后'
		})
		uni.request(config)
			.then((responses: any) => {
				const response = responses.data
				uni.hideLoading()
				resolve(response)
			})
			.catch((error: any) => {
				uni.hideLoading()
				reject(error)
			})
	})
	return promise
}

export default request
