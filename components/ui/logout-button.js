import { signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useContext } from 'react'

import NotificationContext from '../../context/notification'
import Button from './button'

const LogoutButton = (props) => {
	const router = useRouter()
	const { showNotification } = useContext(NotificationContext)

	async function handleSignOut() {

		showNotification('Logging out...').pending()
		
		const callbackPath = router.asPath === '/auth/users' ? '/' : router.asPath

		try {
			const result = await signOut({ redirect: false, callbackUrl: callbackPath })
			showNotification('Logged out successfully').success()

			router.replace(result.url)
		} catch (error) {
			showNotification('Error logging out! Please try again').error()
		}
	}

	return <Button onClick={handleSignOut} text={props.text || 'Logout'} />
}

export default LogoutButton
