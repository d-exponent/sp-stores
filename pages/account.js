import UserProfile from '../components/user-profile/profile'

import { unstable_getServerSession } from 'next-auth/next'
import { nextAuthConfig } from './api/auth/[...nextauth]'
import { purify } from '../lib/utils'

const AccountPage = () => <UserProfile />

export async function getServerSideProps(context) {
	const session = await unstable_getServerSession(
		context.req,
		context.res,
		nextAuthConfig
	)

	if (!session) {
		return {
			redirect: {
				destination: '/auth/users',
			},
		}
	}

	return {
		props: { session: purify(session) },
	}
}

export default AccountPage
