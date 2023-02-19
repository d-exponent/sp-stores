import { unstable_getServerSession } from 'next-auth/next'

import { nextAuthConfig } from '../api/auth/[...nextauth]'
import ResetPassword from '../../components/credentials/reset-password'
import { redirectToPage } from '../../lib/controller-utils'

const ResetPassowrdPage = () => <ResetPassword />

export async function getServerSideProps(context) {
	const session = await unstable_getServerSession(
		context.req,
		context.res,
		nextAuthConfig
	)

	if (session) return redirectToPage('/auth/users')

	// getServerSideProps must return an object.
	return {
		props: { auth: 'dummy-prop' },
	}
}
export default ResetPassowrdPage
