import { useRouter } from 'next/router'
import { useState, useContext } from 'react'
import { signIn } from 'next-auth/react'

import SignUP from '../forms/register'
import SignIn from './signin'
import NotificationContext from '../../context/notification'
import { handleSignIn, withFetch } from '../../lib/auth-utils'
import classes from './authentication.module.css'

const getErrorMessage = function (error) {
	return error.message || "It's not you, it's us. Please try again! 😭"
}

const FALLBACK_MESSAGE = 'Please check your internet connection and try again!'

export default function Authentication() {
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

	const toggleLogin = function () {
		setIsLogin((prevLogin) => !prevLogin)
	}

	const handleChange = function (event) {
		const { name, value } = event.target

		let formDataValue = value.toLowerCase().trim()
		if ([name] !== 'password' && [name] !== 'confirmPassword') {
			formDataValue = value.trim()
		}

		if (isLogin) setLoginForm({ ...loginForm, [name]: formDataValue })
		if (!isLogin) setRegisterForm({ ...registerForm, [name]: formDataValue })
	}

	const handleSubmit = async function (event) {
		event.preventDefault()
		// Login form
		if (isLogin) {
			setDisableLoginBtn(true)

			showNotification('Logging you in... 🐱‍🏍').pending()

			try {
				await handleSignIn(signIn, loginForm, FALLBACK_MESSAGE)
				showNotification('Login successfull 👌').success()

				router.replace(router.query.callback || '/')
			} catch (error) {
				setDisableLoginBtn(false)
				showNotification(getErrorMessage(error)).error()
			}

			return
		}

		// SignUp form
		setDisableRegisterBtn(true)
		showNotification('Creating your account...').pending()

		const fetchConfig = {
			method: 'POST',
			url: '/api/auth/users/register',
			data: registerForm,
		}

		const [resPromise] = withFetch(fetchConfig)

		try {
			const res = await resPromise

			if (!res.success) throw new Error(res.message)

			showNotification(res.message + ' 🐱‍🏍').success()
		} catch (error) {
			setDisableRegisterBtn(false)

			const errorMessage =
				'Something went wrong with creating your account. Please try again'

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
		}, 700)
	}

	return (
		<section className='pd-top-30'>
			<div className={`${classes.container} box-shadow-light`}>
				<div>
					<p>
						{ctaText} a member?
						<span className={classes.cta} onClick={toggleLogin}>
							{ctaSpan}
						</span>
					</p>
				</div>

				<div className={classes.formsWrapper}>
					{isLogin && (
						<div className={classes.signInContainer}>
							<SignIn
								handleChange={handleChange}
								formData={loginForm}
								handleSubmit={handleSubmit}
								disableBtn={disableLoginBtn}
							/>
						</div>
					)}
					{!isLogin && (
						<div className={classes.signUpContainer}>
							<SignUP
								handleChange={handleChange}
								formData={registerForm}
								handleSubmit={handleSubmit}
								disableBtn={disableRegisterBtn}
							/>
						</div>
					)}
				</div>
			</div>
		</section>
	)
}
