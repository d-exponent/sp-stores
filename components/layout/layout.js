import { useContext } from 'react'

import { ShoppingItemsContextProvider } from '../../context/shopping-bag'
import { SideNavContextProvider } from '../../context/side-nav'
import NotificationContext from '../../context/notification'
import Header from './header'
import Footer from './footer'
import Notification from '../ui/notification'

const Layout = (props) => {
	const { notificationContent, showNotification } = useContext(NotificationContext)

	const hideNotificationHandler = () => {
		showNotification(null)
	}

	return (
		<SideNavContextProvider>
			<ShoppingItemsContextProvider>
				<Header />
				<main>{props.children}</main>
				{/* <Footer /> */}
				{notificationContent ? (
					<div onClick={hideNotificationHandler}>
						<Notification
							status={notificationContent.status}
							message={notificationContent.message}
						/>
					</div>
				) : null}
			</ShoppingItemsContextProvider>
		</SideNavContextProvider>
	)
}

export default Layout
