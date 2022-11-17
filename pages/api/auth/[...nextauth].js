import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'

import User from '../../../models/user-model'
import { dbConnect } from '../../../lib/db-utils'
import { bcryptCompare } from '../../../lib/controller-utils'

export const nextAuthConfig = {
	session: {
		jwt: true,
	},
	secret: process.env.NEXTAUTH_SECRET,
	pages: {
		signIn: '/auth/sign-in',
	},
	providers: [
		CredentialsProvider({
			async authorize(credentails) {
				const { email, password } = credentails

				if (!email) {
					throw new Error('Please provide your email address')
				}

				if (!password) {
					throw new Error('Please provide your password')
				}

				await dbConnect()
				const user = await User.findOne({ email }).select('+password')

				if (!user) {
					throw new Error(
						'Incorrect email address. Please confirm the email address or register a new account'
					)
				}

				const isVerifiedPassword = await bcryptCompare(password, user.password)

				if (!isVerifiedPassword) {
					throw new Error('Incorrect password. Forgot password?')
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
