import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { FcGoogle } from 'react-icons/fc'

import Login from '../forms/login'
import Button from '../ui/button'
import classes from './sigin.module.css'

const AuthenticationPage = (props) => {
	const googleSignInHandler = () => signIn('google')
	return (
		<div>
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
			<div className={classes.divider}>
				<div></div>
				<span className={classes.span}>or</span>
				<div></div>
			</div>
			<div className={classes.ctaWrapper}>
				<Button onClick={googleSignInHandler} renderChildren>
					<div className={classes.googleSignin}>
						<span className={classes.googleLogo}>
							<FcGoogle />
						</span>
						<span className={classes.googleText}>Sign in with google</span>
					</div>
				</Button>
			</div>
		</div>
	)
}

export default AuthenticationPage
