import mongoose from 'mongoose'

import { logByEnviroment } from './utils'

/**
 * @returns {object}
 * An object containing a MongoDb connection string abd the congiguration Object
 */
export const getMongooseConnectArgs = () => {
	const connectionString = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.ntzames.mongodb.net/${process.env.DB}?retryWrites=true&w=majority`

	const connectionConfiq = {
		useUnifiedTopology: true,
	}

	return {
		connectionString,
		connectionConfiq,
	}
}

/** Connects to mongoDb with mongoose.connect method  */
export const dbConnect = async () => {
	const { connectionString, connectionConfiq } = getMongooseConnectArgs()

	try {
		await mongoose.connect(connectionString, connectionConfiq)
		logByEnviroment('dev', '👍Connected to mongoDb successfuly')
	} catch (error) {
		logByEnviroment(null, `🧰 Error connecting to mongoDb ${error.message}`)
		throw new Error(error)
	}
}


