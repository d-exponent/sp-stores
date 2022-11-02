import { createContext, useState, useEffect } from 'react'
import Notification from '../lib/notification-client'

const NotificationContext = createContext({
	notificationContent: Object,
	showNotification: function (content) {},
})

export const NotificationContextProvider = (props) => {
	const [content, setContent] = useState()

	useEffect(() => {
		const timer = setTimeout(() => {
			setContent(null)
		}, 5000)

		return () => clearTimeout(timer)
	}, [content])

	function showNotifcationHandler(message) {
		return new Notification(message, setContent)
	}

	const context = {
		notificationContent: content,
		showNotification: showNotifcationHandler,
	}

	return (
		<NotificationContext.Provider value={context}>
			{props.children}
		</NotificationContext.Provider>
	)
}

export default NotificationContext
