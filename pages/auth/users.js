import Authentication from '../../components/credentials/authentication'
import { unstable_getServerSession } from 'next-auth/next'
import { nextAuthConfig } from '../api/auth/[...nextauth]'

const AuthPage = () => {
	return <Authentication />
}

export async function getServerSideProps(context) {
	const session = await unstable_getServerSession(
		context.req,
		context.res,
		nextAuthConfig
	)

	//Redirect to home page on active session
	if (session) {
		return {
			redirect: {
				destination: '/',
			},
		}
	}

	return {
		props: { session },
	}
}

export default AuthPage
