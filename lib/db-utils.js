import mongoose from 'mongoose'

export function getMongooseConnectArgs() {
	const connectionString = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.ntzames.mongodb.net/${process.env.DB}?retryWrites=true&w=majority`

	const connectionConfiq = {
		useNewUrlParser: true,
		useUnifiedTopology: true,
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
	} catch (error) {
		throw new Error(error.message)
	}
}


