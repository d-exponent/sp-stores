import mongoose from 'mongoose'

export function getMongooseConnectArgs() {
	const connectionString = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.ntzames.mongodb.net/${process.env.DB}?retryWrites=true&w=majority`

	const connectionConfiq = {
		useUnifiedTopology: true,
		family: 4,
	}

	return {
		connectionString,
		connectionConfiq,
	}
}

const connection = {}

/** Connects to mongoDb with mongoose.connect method  */
export async function dbConnect() {
	if (connection.isConnected) return

	const { connectionString, connectionConfiq } = getMongooseConnectArgs()

	try {
		const db = await mongoose.connect(connectionString, connectionConfiq)
		connection.isConnected = db.connections[0].readyState === 1
		process.env.NODE_ENV !== 'production' &&
			console.log('👍Connected to mongoDb successfully')
	} catch (error) {
		process.env.NODE_ENV !== 'production' && console.log('🧰 Error connecting to mongoDB')
		throw new Error(error.message)
	}
}
