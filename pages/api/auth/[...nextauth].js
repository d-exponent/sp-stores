import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'

import User from '../../../models/user-model'
import dbConnect from '../../../lib/db-utils'
import AppError from '../../../lib/app-error'
import { bcryptCompare } from '../../../lib/controller-utils'
import { isValidEmail } from '../../../lib/utils'

const throwError = (message) => {
	throw new Error(message)
}

export const nextAuthConfig = {
	jwt: {
		maxAge: 60 * 24 * 60 * 60, //two months
	},
	pages: {
		signIn: '/auth/sign-in',
	},
	providers: [
		CredentialsProvider({
			async authorize(credentails) {
				const { email, password } = credentails

				if (!email || !password || !isValidEmail(email)) {
					throwError('Please provide your valid email address and Password')
				}

				try {
					await dbConnect()
				} catch (e) {
					throwError('Please check your internet connection and try again')
					AppError.saveServerErrorToDatabase(e)
				}

				let user
				try {
					user = await User.findOne({ email }).select('+password')
				} catch (e) {
					throwError('Something went wrong. Please try again')
				}

				//Verify User
				if (!user) {
					throwError('User not found. Please create an account.')
				}

				//Verify active
				if (!user.active) {
					throwError('Account does not exist or has been deleted')
				}

				//Verify password
				const verifiedPassword = await bcryptCompare(password, user.password)

				if (!verifiedPassword) {
					throwError('Incorrect password. Forgot password?')
				}

				return {
					email: user.email,
					name: user.fullName,
				}
			},
		}),

		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		}),
	],
}

export default NextAuth(nextAuthConfig)
