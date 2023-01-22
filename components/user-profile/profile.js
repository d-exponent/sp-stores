import { useRef, useContext, useState } from 'react'
import { useSession } from 'next-auth/react'

import { withFetch } from '../../lib/auth-utils'
import NotificationContext from '../../context/notification'
import UpdatePasswordForm from '../forms/update-password'
import Button from '../ui/button'
import Auth from './auth'
import classes from './css-modules/profile.module.css'

export default function UserProfile() {
	const [updatePassword, setUpdatePassword] = useState(false)

	const { showNotification } = useContext(NotificationContext)

	const { data, status } = useSession()

	const currentPasswordRef = useRef(null)
	const newPasswordRef = useRef(null)

	const updatePasswordTogglerText = updatePassword ? 'Hide ' : 'Update Password'

	const showUpdatePasswordToggler = function () {
		setUpdatePassword((prev) => !prev)
	}

	const formSubmitHandler = async function (event) {
		event.preventDefault()
		
		showNotification('Updating your password').pending()

		const enteredCurrentPassword = currentPasswordRef.current.value
		const enteredNewPassword = newPasswordRef.current.value

		try {
			const { response, serverRes } = await withFetch({
				url: `/api/auth/users/${data.user.email}`,
				data: {
					currentPassword: enteredCurrentPassword,
					newPassword: enteredNewPassword,
				},
				method: 'PATCH',
			})

			if (!response.ok) throw new Error(serverRes.message)

			currentPasswordRef.current.value = ''
			newPasswordRef.current.value = ''

			setUpdatePassword(false)
			showNotification('Password updated successfully').success()
		} catch (error) {
			const errorMessage = error.message || 'Something went wrong. Please try again!'
			showNotification(errorMessage).error()
		}
	}

	if (status === 'authenticated') {
		return (
			<section className={classes.container}>
				<div className={classes.infoWrapper}>
					<div className={`${classes.userInfo}`}>
						<span>Name: </span>
						<span>{data.user.name}</span>
					</div>
					<div className={`${classes.userInfo}`}>
						<span>Email: </span>
						<span>{data.user.email}</span>
					</div>
				</div>

				<div className={classes.ctaWrapper}>
					<Button text={updatePasswordTogglerText} onClick={showUpdatePasswordToggler} />
					{updatePassword ? (
						<UpdatePasswordForm
							onSubmit={formSubmitHandler}
							currentPasswordRef={currentPasswordRef}
							newPasswordRef={newPasswordRef}
						/>
					) : null}
				</div>
			</section>
		)
	}

	if (status === 'loading') {
		return (
			<div className={classes.verify}>
				<Auth
					title='Verifying your Identity'
					href='/'
					text='Please wait while we check your login status or click the button bellow to shop now'
					linkText='Shop Now'
				/>
			</div>
		)
	}

	return (
		<div className={classes.verify}>
			<Auth
				title='You are not Logged in'
				href='/auth/users'
				linkText='Click to login'
				text='Please login to access your account'
			/>
		</div>
	)
}
