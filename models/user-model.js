import mongoose from 'mongoose'

import { isValidEmail } from '../lib/utils'
import { bcryptHashed } from '../lib/controller-utils'

const userSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: [true, 'Please enter your first name'],
		capitalize: true,
		trim: true,
	},
	lastName: {
		type: String,
		required: [true, 'Please enter your last name'],
		lowercase: true,
		trim: true,
	},
	email: {
		type: String,
		lowercase: true,
		trim: true,
		required: [true, 'Please enter your email address'],
		validate: [isValidEmail, 'Please enter a valid email address'],
		unique: true,
	},
	phoneNumber: {
		type: String,
		trim: true,
		required: [true, 'Please enter your phone number'],
	},
	password: {
		type: String,
		trim: true,
		min: [8, 'Password must be at least 8 characters long'],
		required: true,
		select: false,
	},
	confirmPassword: {
		type: String,
		trim: true,
		required: true,
		validate: {
			validator: function (value) {
				return value === this.password
			},
			message: 'Password must match the confirm password',
		},
	},
	regMethod: {
		type: String,
		enum: ['credentials', 'auto_on_paystack_payment'],
	},
	role: {
		type: String,
		enum: ['customer', 'staff', 'admin', 'super-admin'],
		default: 'customer',
		trim: true,
		lowercase: true,
	},
	active: {
		type: Boolean,
		default: true,
	},
})

userSchema.indexes({ email: 1 })

userSchema.pre('save', function (next) {
	if (this.password === process.env.ON_PAY_PAYSTACK_WEBHOOK_USER) {
		this.regMethod = 'auto_on_paystack_payment'
		return next()
	}

	this.regMethod = 'credentials'
	next()
})

//let's hash the password
userSchema.pre('save', async function (next) {
	//Exit if this isn't a new document
	if (!this.isNew) {
		return next()
	}

	this.password = await bcryptHashed(this.password, 12)
	this.confirmPassword = undefined
	next()
})

// Query Middlewares
userSchema.pre(/^find/, function (next) {
	this.select('-__v')
	next()
})

const User = mongoose.models.User || mongoose.model('User', userSchema)
export default User
