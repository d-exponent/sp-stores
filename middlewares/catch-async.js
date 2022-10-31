const catchAsync = (fn) => {
	return async function (req, res) {
		try {
			await fn(req, res)
		} catch (err) {
			throw err
		}
	}
}

export default catchAsync
