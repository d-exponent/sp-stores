import { useSession } from 'next-auth/react'
import { useRef, useContext } from 'react'

import NotificationContext from '../context/notification'
import Input from './ui/input'

const UserProfile = () => {
	const { showNotification } = useContext(NotificationContext)

	const { data, status } = useSession()

	const isAuthneticated = status === 'authenticated'

	const currentPasswordRef = useRef(null)
	const newPasswordRef = useRef(null)

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
		enteredCurrentPassword = ''
		enteredNewPassword = ''
	}

	return (
		<section>
			{isAuthneticated ? <div>{data.user.name}</div> : null}
			{isAuthneticated ? <div>{data.user.email}</div> : null}
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
