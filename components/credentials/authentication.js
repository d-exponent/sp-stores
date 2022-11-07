import { useRouter } from 'next/router'
import { useState, useContext } from 'react'
import { signIn } from 'next-auth/react'

import SignUP from '../forms/register'
import SignIn from './signin'
import NotificationContext from '../../context/notification'
import { handleSignIn, withFetch } from '../../lib/auth-utils'
import classes from '../css-modules/authentication.module.css'

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
	const ctaSpan = isLogin ? ' Sign Up' : ' Login'

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

		//SignUP form
		setDisableRegisterBtn(true)
		showNotification('Creating your account...').pending()

		const fetchConfig = {
			method: 'POST',
			url: '/api/auth/users/register',
			data: registerForm,
		}

		try {
			const { response, serverRes } = await withFetch(fetchConfig)
			if (!response.ok) {
				throw new Error(serverRes.message)
			}

			const successMessage =
				serverRes.message || 'Your account is created successfully 👍'
			showNotification(successMessage).success()
		} catch (error) {
			setDisableRegisterBtn(false)

			const errorMessage = error.message || 'Something went wrong!'
			return showNotification(errorMessage).error()
		}

		setTimeout(async () => {
			showNotification('Logging you in').pending()

			try {
				await handleSignIn(signIn, registerForm, 'Something went wrong!')
				router.replace(router.query.callback || '/')
			} catch (error) {
				setDisableRegisterBtn(false)
				showNotification(getErrorMessage(error)).error()
			}

			showNotification('Logged in successfully').success()
		}, 1500)
	}

	return (
		<section>
			<div className={classes.container}>
				<div>
					<p>
						{ctaText} a member?
						<span className={classes.cta} onClick={toggleLogin}>
							 {ctaSpan}
						</span>
					</p>
				</div>

				<div className={classes.formsWrapper}>
					{isLogin ? (
						<div className={classes.signInContainer}>
							<SignIn
								handleChange={handleChange}
								formData={loginForm}
								handleSubmit={handleSubmit}
								disableBtn={disableLoginBtn}
							/>
						</div>
					) : null}
					{!isLogin ? (
						<div className={classes.signUpContainer}>
							<SignUP
								handleChange={handleChange}
								formData={registerForm}
								handleSubmit={handleSubmit}
								disableBtn={disableRegisterBtn}
							/>
						</div>
					) : null}
				</div>
			</div>
		</section>
	)
}

export default Authentication
