import { unstable_getServerSession } from 'next-auth/next'

import ForgotPassword from '../../components/credentials/forgot-password'
import { nextAuthConfig } from '../api/auth/[...nextauth]'

const ForgotPasswordPage = () => {
	return <ForgotPassword />
}

export async function getServerSideProps(context) {
	const session = await unstable_getServerSession(
		context.req,
		context.res,
		nextAuthConfig
	)

	if (session) {
		return {
			redirect: {
				destination: '/auth/users',
			},
		}
	}

	// getServerSideProps must return an object.
	return {
		props: { auth: 'dummy-prop' },
	}
}

export default ForgotPasswordPage
