import { useSession } from 'next-auth/react'
import { useRef, useContext } from 'react'

import NotificationContext from '../context/notification'
import Input from './ui/input'

const UserProfile = () => {

	const { showNotification } = useContext(NotificationContext)
	const { data } = useSession()

	const currentPasswordRef = useRef(null)
	const newPasswordRef = useRef(null)
	
	// const isAuthneticated = status === 'authenticated'
	async function formSubmitHandler(event) {
		event.preventDefault()
		showNotification('Updating your password').pending()

		const enteredCurrentPassword = currentPasswordRef.current.value
		const enteredNewPassword = newPasswordRef.current.value

		const patchData = {
			currentPassword: enteredCurrentPassword,
			newPassword: enteredNewPassword,
		}

		const fetchConfig = {
			method: 'PATCH',
			body: JSON.stringify(patchData),
			headers: {
				'Content-Type': 'application/json',
			},
		}

		const response = await fetch(`/api/auth/users/${data.user.email}`, fetchConfig)
		const serverRes = await response.json()

		if (!response.ok) {
			const errorMessage = serverRes.message || 'Somethign went wrong. Please try again!'
			return showNotification(errorMessage).error()
		}

		showNotification('Password updated successfully').success()

		currentPasswordRef.current.value = ''
		newPasswordRef.current.value = ''
	}

	return (
		<section>
			<div>{data.user.name}</div>
			<div>{data.user.email}</div>
			<div>
				<form onSubmit={formSubmitHandler}>
					<>
						<Input
							type='password'
							label='current password'
							name='current-password'
							required={true}
							reference={currentPasswordRef}
						/>
						<Input
							type='password'
							label='New password'
							name='new-password'
							required={true}
							reference={newPasswordRef}
						/>
					</>
					<button>Submit</button>
				</form>
			</div>
		</section>
	)
}

export default UserProfile
