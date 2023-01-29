import mongoose, { connection } from 'mongoose'

import { logByEnviroment } from './utils'
import { isProductionEnv } from './controller-utils'


/**
 * @returns {object}
 * An object containing a MongoDb connection string abd the congiguration Object
 */
export const getMongooseConnectArgs = () => {
	const connectionString = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.ntzames.mongodb.net/${process.env.DB}?retryWrites=true&w=majority`

	const connectionConfiq = {
		useUnifiedTopology: true,
		autoIndex: !isProductionEnv()
	}

	return {
		connectionString,
		connectionConfiq,
	}
}

let activeConnection = {}

/** Connects to mongoDb with mongoose.connect method  */
export const dbConnect = async () => {
	if (activeConnection?.isConnected) return

	const { connectionString, connectionConfiq } = getMongooseConnectArgs()

	try {
		const db = await mongoose.connect(connectionString, connectionConfiq)
		activeConnection.isConnected = db.connections[0].readyState === 1

		logByEnviroment('dev', '👍Connected to mongoDb successfuly')
	} catch (error) {
		logByEnviroment(null, `🧰 Error connecting to mongoDb ${error.message}`)
		throw error
	}
}



export const modelVirtualsConfiq = {
	toJSON: { virtuals: true },
	toObject: { virtuals: true },
}
