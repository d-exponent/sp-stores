function logger(req, res, next) {
	const requestTime = new Date(Date.now()).toISOString()
	console.log(`🧰 method: ${req.method},  Url: ${req.url},  [${requestTime} ]`)

	next()
}

export default logger
