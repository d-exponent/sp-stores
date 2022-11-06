import { useRef, useContext } from 'react'

import Input from '../ui/input'
import NotificationContext from '../../context/notification'

const ForgotPassword = () => {
	const emailInputRef = useRef()

	const { showNotification } = useContext(NotificationContext)

	async function handleClick() {
		showNotification('Processing..').pending()
		const enteredEmail = emailInputRef.current.value

		const response = await fetch(`/api/auth/users/forgot-password`, {
			method: 'POST',
			body: JSON.stringify({ email: enteredEmail }),
			headers: { 'Content-Type': 'application/json ' },
		})

		const serverRes = await response.json()

		if (!response.ok) {
			const errorMessage = 'Error reseting your password. Please try again!'
			showNotification(serverRes.message || errorMessage).error()
		}

		const successMessage = `A password reset link has been sent to your email address. Click on the link to reset your password`
		showNotification(serverRes.message || successMessage).success()

		emailInputRef.current.value = ''
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
