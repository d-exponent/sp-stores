import mongoose from 'mongoose'

const errorSchema = new mongoose.Schema({
	name: { type: String, default: 'Unknown Error' },
	message: { type: String, default: 'No error message provided' },
	stack: String,
	cause: { type: Object, default: '' },
	isOperationalError: { type: Boolean, default: false },
	unCaughtFeilds: Object,
	createdAt: { type: Date, default: Date.now },
})

export default mongoose.models.ErrorLog || mongoose.model('ErrorLog', errorSchema)
