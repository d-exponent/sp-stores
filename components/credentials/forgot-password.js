import { useRef, useContext } from 'react'

import Input from '../ui/input'
import NotificationContext from '../../context/notification'
import { withFetch } from '../../lib/auth-utils'

const ForgotPassword = () => {
	const emailInputRef = useRef()

	const { showNotification } = useContext(NotificationContext)

	async function handleClick() {
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
			showNotification(error.message || 'Something went wrong').error()
		}
	}

	return (
		<section>
			<div>
				<Input
					type='email'
					required={true}
					label='Email'
					name='email'
					reference={emailInputRef}
				/>
				<button onClick={handleClick}>Submit</button>
			</div>
		</section>
	)
}

export default ForgotPassword
