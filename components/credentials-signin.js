import { signIn } from 'next-auth/react'
import Login from './forms/login'

const AuthenticationPage = (props) => {
	return (
		<section>
			<Login {...props} />
			<div>
				<button onClick={() => signIn('google')}>Sign in with google</button>
			</div>
		</section>
	)
}

export default AuthenticationPage
