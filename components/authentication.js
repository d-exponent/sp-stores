import { useRouter } from 'next/router'
import { useState, useContext } from 'react'
import { signIn } from 'next-auth/react'

import Register from './forms/register'
import CredentialsSignIn from './credentials-signin'
import NotificationContext from '../context/notification'
import { handleSignIn, submitUserToApi } from '../lib/auth-page-utils'
import classes from './css-modules/authentication.module.css'

const getErrorMessage = (error) =>
	error.message || "It's not you, it's us. Please try again! 😭"

const Authentication = () => {
	const [disableLoginBtn, setDisableLoginBtn] = useState(false)
	const [disableRegisterBtn, setDisableRegisterBtn] = useState(false)

	const [isLogin, setIsLogin] = useState(true)
	const [loginForm, setLoginForm] = useState({ email: '', password: '' })
	const [registerForm, setRegisterForm] = useState({
		firstName: '',
		lastName: '',
		phoneNumber: '',
		email: '',
		password: '',
		confirmPassword: '',
	})

	const router = useRouter()
	const { showNotification } = useContext(NotificationContext)

	const ctaText = isLogin ? 'Not' : 'Already'
	const ctaSpan = isLogin ? ' Register' : ' Login'

	const toggleLogin = () => setIsLogin((prevLogin) => !prevLogin)

	function handleChange(event) {
		const { name, value } = event.target

		let formDataValue = value
		if ([name] !== 'password' && [name] !== 'confirmPassword') {
			formDataValue = value.trim()
		}

		if (isLogin) setLoginForm({ ...loginForm, [name]: formDataValue })
		if (!isLogin) setRegisterForm({ ...registerForm, [name]: formDataValue })
	}

	async function handleSubmit(event) {
		event.preventDefault()
		// Login form
		if (isLogin) {
			setDisableLoginBtn(true)

			showNotification('Logging you in... 🐱‍🏍').pending()

			try {
				const fallbackMsg = 'ERROR! Please check your internet connection and try again!'

				await handleSignIn(signIn, loginForm, fallbackMsg)
				showNotification('Login successfull 👌').success()

				router.replace(router.query.callback || '/')
			} catch (error) {
				setDisableLoginBtn(false)
				showNotification(getErrorMessage(error)).error()
			}

			return
		}

		//Register form
		setDisableRegisterBtn(true)
		showNotification('Creating your account...').pending()

		try {
			await submitUserToApi(registerForm)
			await handleSignIn(signIn, registerForm, 'Something went wrong!')

			const successMessage = 'Your account is created successfully 👍'
			showNotification(successMessage).success()

			router.replace(router.query.callback || '/')
		} catch (error) {
			setDisableRegisterBtn(false)
			showNotification(getErrorMessage(error)).error()
		}
	}

	return (
		<section>
			<div>
				<div>
					<p>
						{ctaText} a member?
						<span className={classes.cta} onClick={toggleLogin}>
							click to {ctaSpan}
						</span>
					</p>
				</div>

				<div>
					<div>
						{isLogin ? (
							<CredentialsSignIn
								handleChange={handleChange}
								formData={loginForm}
								handleSubmit={handleSubmit}
								disableBtn={disableLoginBtn}
							/>
						) : null}
					</div>
					{!isLogin ? (
						<Register
							handleChange={handleChange}
							formData={registerForm}
							handleSubmit={handleSubmit}
							disableBtn={disableRegisterBtn}
						/>
					) : null}
				</div>
			</div>
		</section>
	)
}

export default Authentication
