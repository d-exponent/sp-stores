import { useRouter } from 'next/router'
import { useState, useContext } from 'react'
import { signIn } from 'next-auth/react'

import Register from './forms/register'
import CredentialsSignIn from './credentials-signin'
import NotificationContext from '../context/notification'
import { handleSignIn, submitUserToApi, getNotification } from '../lib/auth-page-utils'
import classes from './authentication.module.css'

const Authentication = () => {
	const router = useRouter()
	const { showNotification } = useContext(NotificationContext)

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
			
			const pendingNotification = getNotification('pending', 'Logging in')
			showNotification(pendingNotification)

			try {
				const fallbackMsg = 'ERROR! Please check your internet connection and try again!'

				await handleSignIn(signIn, loginForm, fallbackMsg)
				const successNotification = getNotification('success', 'Login successful')
				showNotification(successNotification)

				router.replace(router.query.callback || '/')
			} catch (error) {
				setDisableLoginBtn(false)
				const errorNotification = getNotification(
					'error',
					error.message || "It's not you, it's us. Please try again! 😭"
				)
				showNotification(errorNotification)
			}
		}

		//Register form
		if (!isLogin) {
			setDisableRegisterBtn(true)
			const pendingNotification = getNotification('pending', 'Creating your account ...')
			showNotification(pendingNotification)

			try {
				await submitUserToApi(registerForm)

				//Automatically Login user
				await handleSignIn(signIn, registerForm, 'Something went wrong!')
				showNotification({
					status: 'success',
					message: 'Welcome to the sp-collections family 🥳',
				})

				router.replace(router.query.callback || '/')
			} catch (error) {
				setDisableRegisterBtn(false)
				const errorMessage =
					error.message || "It's not you, it's us. Please try again! 😭"
				showNotification({ status: 'error', message: errorMessage })
			}
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


