import { useRef, useContext } from 'react'

import Input from '../ui/input'
import Button from '../ui/button'
import NotificationContext from '../../context/notification'
import { withFetch } from '../../lib/auth-utils'

import classes from './forgot-passowrd.module.css'

const ForgotPassword = () => {
	const emailInputRef = useRef()

	const { showNotification } = useContext(NotificationContext)

	async function submitHandler(event) {
		event.preventDefault()

		showNotification('Processing..').pending()

		const enteredEmail = emailInputRef.current.value

		try {
			const { response, serverRes } = await withFetch({
				method: 'POST',
				url: `/api/auth/users/forgot-password`,
				data: { email: enteredEmail },
			})

			if (!response.ok) {
				const errorMessage = 'Error resetting your password. Please try again!'
				throw new Error(serverRes.message || errorMessage).error()
			}

			const successMessage = `A password reset link has been sent to your email address. Click on the link to reset your password`
			showNotification(serverRes.message || successMessage).success()

			emailInputRef.current.value = ''
		} catch (error) {
			showNotification('Something went wrong').error()
		}
	}

	return (
		<section className={`${classes.container} grid`}>
			<form onSubmit={submitHandler}>
				<Input
					type='email'
					required={true}
					label='Enter your email'
					name='email'
					reference={emailInputRef}
					placeholder='youremail@email.com'
				/>
				<Button text='Get Reset link' />
			</form>
		</section>
	)
}

export default ForgotPassword
