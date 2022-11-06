import mongoose from 'mongoose'

import { isValidEmail } from '../lib/utils'
import { bcryptHash, cryptoToken, cryptoHash } from '../lib/controller-utils'

const userSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: [true, 'Please enter your first name'],
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
		phoneNumber: String,
		password: {
			type: String,
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
		passwordModifiedAt: Date,
		passwordResetToken: String,
		passwordResetTokenExpiresAt: Date,
		regMethod: {
			type: String,
			enum: ['credentials', 'auto_on_paystack_payment'],
			default: 'credentials',
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
	},
	{
		methods: {
			createResetToken() {
				const resetToken = cryptoToken(30)

				this.passwordResetToken = cryptoHash(resetToken)
				this.passwordResetTokenExpiresAt = Date.now() + 5 * 60 * 1000 // 5 minutes

				return resetToken
			},
		},
	}
)


//let's hash the password
userSchema.pre('save', async function (next) {
	this.password = await bcryptHash(this.password)
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
