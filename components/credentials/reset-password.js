import { useState, useRef, useContext } from 'react'
import { useRouter } from 'next/router'

import Input from '../ui/input'
import NotificationContext from '../../context/notification'

const ResetPassword = () => {
	const router = useRouter()

	const { showNotification } = useContext(NotificationContext)

	const newPasswordRef = useRef(null)
	const passwordConfirmRef = useRef(null)

	async function handleFormSubmit(event) {
		event.preventDefault()

		if (!router.query.token) {
			return showNotification(
				'Please check your email and click the link to reset your password'
			).error()
		}

		showNotification('Resetting Password...').pending()

		const enteredNewPassword = newPasswordRef.current.value
		const enteredPasswordConfirm = passwordConfirmRef.current.value

		const resetData = {
			newPassword: enteredNewPassword,
			confirmPassword: enteredPasswordConfirm,
			resetToken: router.query.token,
		}

		const response = await fetch('/api/auth/users/reset-password', {
			method: 'PATCH',
			body: JSON.stringify(resetData),
			headers: { 'Content-Type': 'application/json ' },
		})

		const serverRes = await response.json()

		if (!response.ok) {
			const errorMessage = serverRes.message || 'error updating your password.'
			return showNotification(errorMessage).error()
		}

		setTimeout(() => {
			showNotification('Login into your account').success()
			router.replace('/auth/users')
		}, 4000)

		const successMessage = serverRes.message || 'Password reset successfully'
		showNotification(successMessage).success()

		newPasswordRef.current.value = ''
		passwordConfirmRef.current.value = ''
	}

	return (
		<section>
			<form onSubmit={handleFormSubmit}>
				<Input
					type='password'
					label='new password'
					required={true}
					name='new-password'
					reference={newPasswordRef}
				/>
				<Input
					type='password'
					label='Confirm password'
					required={true}
					name='confirm-password'
					reference={passwordConfirmRef}
				/>
				<button>Submit</button>
			</form>
		</section>
	)
}

export default ResetPassword
