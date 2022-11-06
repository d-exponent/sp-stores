import { useRef, useContext } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

import NotificationContext from '../context/notification'
import { sendDataToAPi } from '../lib/auth-utils'
import Input from './ui/input'

const UserProfile = () => {
	const { showNotification } = useContext(NotificationContext)
	const { data, status } = useSession()

	const currentPasswordRef = useRef(null)
	const newPasswordRef = useRef(null)

	// const isAuthneticated = status === 'authenticated'
	async function formSubmitHandler(event) {
		event.preventDefault()
		showNotification('Updating your password').pending()

		const enteredCurrentPassword = currentPasswordRef.current.value
		const enteredNewPassword = newPasswordRef.current.value

		try {
			const { response, serverRes } = await sendDataToAPi({
				url: `/api/auth/users/${data.user.email}`,
				data: {
					currentPassword: enteredCurrentPassword,
					newPassword: enteredNewPassword,
				},
				method: 'PATCH',
			})

			if (!response.ok) {
				throw new Error(serverRes.message)
			}

			currentPasswordRef.current.value = ''
			newPasswordRef.current.value = ''

			showNotification('Password updated successfully').success()
		} catch (error) {
			const errorMessage = error.message || 'Somethign went wrong. Please try again!'
			showNotification(errorMessage).error()
		}
	}

	const isAuthenticated = status === 'authenticated'
	const isLoading = status === 'loading'

	if (isLoading) {
		return (
			<div>
				<h2>Verifying Authnetication</h2>
			</div>
		)
	}

	if (isAuthenticated) {
		return (
			<section>
				<div div>{data.user.name}</div>
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

	return (
		<div>
			<h2>Your are not logged in</h2>
			<Link href='/auth/users'>
				<a>
					<span>Login</span>
				</a>
			</Link>
		</div>
	)
}

export default UserProfile
