import { signIn } from 'next-auth/react'
import Link from 'next/link'

import Login from './forms/login'

const AuthenticationPage = (props) => {
	return (
		<section>
			<div>
				<>
					<Login {...props} />
					<Link href='/auth/forgot-password'>
						<a>
							<span>Forgot password?</span>
						</a>
					</Link>
				</>
			</div>
			<div>
				<button onClick={() => signIn('google')}>Sign in with google</button>
			</div>
		</section>
	)
}

export default AuthenticationPage
