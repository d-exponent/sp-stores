import { signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useContext } from 'react'

import NotificationContext from '../../context/notification'

const LogoutButton = (props) => {
	const router = useRouter()
	const notficationCtx = useContext(NotificationContext)

	async function handleSignOut() {
		notficationCtx.showNotification({
			status: 'pending',
			message: 'Logging out...',
		})
		const callbackPath = router.asPath === '/auth/users' ? '/' : router.asPath

		try {
			const result = await signOut({ redirect: false, callbackUrl: callbackPath })
			notficationCtx.showNotification({
				status: 'success',
				message: 'Logged out successfully',
			})
			router.replace(result.url)
		} catch (error) {
			notficationCtx.showNotification({
				status: 'error',
				message: 'Error logging out! Please try again',
			})
		}
	}

	return <button onClick={handleSignOut}>{props.text || 'Logout'}</button>
}

export default LogoutButton
