import { logByEnviroment } from '../lib/utils'

const logger = (env) => {
	return (req, res, next) => {
		const requestTime = new Date(Date.now()).toISOString()

		const log = `🧰 method: ${req.method},  Url: ${req.url},  [${requestTime} ]`
		logByEnviroment(env, log)

		next()
	}
}

export default logger
