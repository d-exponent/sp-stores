import { unstable_getServerSession } from 'next-auth/next'

import { nextAuthConfig } from '../api/auth/[...nextauth]'
import ResetPassword from '../../components/credentials/reset-password'

const ResetPassowrdPage = () => {
	return <ResetPassword />
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
export default ResetPassowrdPage
