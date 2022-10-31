import { signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useContext } from 'react'

import NotificationContext from '../../context/notification'
import Notification from '../../lib/notification-client'

const LogoutButton = (props) => {
	const router = useRouter()
	const notficationCtx = useContext(NotificationContext)

	async function handleSignOut() {
		const pendingNotification = new Notification('Logging out...').pending()
		notficationCtx.showNotification(pendingNotification)

		const callbackPath = router.asPath === '/auth/users' ? '/' : router.asPath

		try {
			const result = await signOut({ redirect: false, callbackUrl: callbackPath })
			const successNotification = new Notification('Logged out successfully').success()
			notficationCtx.showNotification(successNotification)

			router.replace(result.url)
		} catch (error) {
			const errorNotification = new Notification(
				'Error logging out! Please try again'
			).error()
			notficationCtx.showNotification(errorNotification)
		}
	}

	return <button onClick={handleSignOut}>{props.text || 'Logout'}</button>
}

export default LogoutButton
