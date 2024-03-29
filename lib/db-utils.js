import mongoose from 'mongoose'

import { logByEnviroment } from './utils'
import { isProductionEnv } from './controller-utils'

export const connectionString = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.ntzames.mongodb.net/${process.env.DB}?retryWrites=true&w=majority`

export const connectionConfiq = {
  useUnifiedTopology: true,
  autoIndex: !isProductionEnv(),
}

const activeConnection = {}

/** Connects to mongoDb with mongoose.connect method  */
export const dbConnect = async () => {
  //Take advantage of pooling
  if (activeConnection.isConnected) return

  try {
    const db = await mongoose.connect(connectionString, connectionConfiq)
    activeConnection.isConnected = db.connections[0].readyState === 1

    logByEnviroment('dev', '👍Connected to mongoDb successfuly')
  } catch (error) {
    logByEnviroment(null, '🧰 Error connecting to mongoDb')
    throw error
  }
}
