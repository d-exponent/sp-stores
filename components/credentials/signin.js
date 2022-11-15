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
					<Link href='/auth/forgot-password'>Forgot password?</Link>
				</>
			</div>
			<div className={`${classes.divider} flex`}>
				<div></div>
				<span className={`${classes.dividerText} grid`}>or</span>
				<div></div>
			</div>
			<div className={classes.ctaWrapper}>
				<Button onClick={googleSignInHandler} renderChildren>
					<div className={`${classes.googleSignin} flex`}>
						<span className={`${classes.googleLogo} grid`}>
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
