import mongoose from 'mongoose'

import { isValidEmail, capitalize } from '../lib/utils'
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
			trim: true,
		},
		email: {
			type: String,
			lowercase: true,
			trim: true,
			required: [true, 'Please enter your email address'],
			validate: [isValidEmail, 'Please enter a valid email address'],
		},
		phoneNumber: String,
		password: {
			type: String,
			minlength: 8,
			required: true,
			select: false,
		},
		passwordModifiedAt: {
			type: Date,
			select: false,
		},
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
		createdAt: {
			type: Date,
			default: Date.now,
		},
		
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
)

userSchema.index({ email: 1, phoneNumber: -1 }, { unique: true })

//Concatenate names
userSchema.virtual('fullName').get(function () {
	return this.firstName + ' ' + this.lastName
})

//Capitalize Names
userSchema.pre('save', function (next) {
	this.firstName = capitalize(this.firstName)
	this.lastName = capitalize(this.lastName)

	next()
})

// Hash Password
userSchema.pre('save', async function (next) {
	if (this.isNew === true) {
		this.password = await bcryptHash(this.password)
	}
	next()
})

//Remove __v feild
userSchema.pre(/^find/, function (next) {
	this.select('-__v')
	next()
})


//Handle passsword reset token
userSchema.methods.createResetToken = function () {
	const resetToken = cryptoToken(30)

	this.passwordResetToken = cryptoHash(resetToken)
	this.passwordResetTokenExpiresAt = Date.now() + 5 * 60 * 1000 // 5 minutes

	return resetToken
}

export default mongoose.models.User || mongoose.model('User', userSchema)
