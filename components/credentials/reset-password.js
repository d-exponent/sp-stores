import { useRef, useContext } from 'react'
import { useRouter } from 'next/router'

import Input from '../ui/input'
import NotificationContext from '../../context/notification'
import { withFetch } from '../../lib/auth-utils'

const ResetPassword = () => {
	const router = useRouter()

	const { showNotification } = useContext(NotificationContext)

	const newPasswordRef = useRef(null)
	const passwordConfirmRef = useRef(null)

	async function handleFormSubmit(event) {
		event.preventDefault()

		if (!router.query.token) {
			return showNotification(
				'MISSING AUTHENTICATION. Please check your email and click the link to reset your password'
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

		try {
			const { response, serverRes } = await withFetch({
				url: '/api/auth/users/reset-password',
				method: 'PATCH',
				data: resetData,
			})

			if (!response.ok) {
				const errorMessage = serverRes.message || 'error updating your password.'
				throw new Error(errorMessage)
			}

			setTimeout(() => {
				showNotification('Login into your account').success()
				router.replace('/auth/users')
			}, 4000)

			const successMessage = serverRes.message || 'Password reset successfully'
			showNotification(successMessage).success()

			newPasswordRef.current.value = ''
			passwordConfirmRef.current.value = ''
			
		} catch (error) {
			showNotification(error.message).error()
		}
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
