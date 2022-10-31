import { createContext, useState, useEffect } from 'react'

const NotificationContext = createContext({
	notificationContent: {},
	showNotification: function (content) {},
})

export const NotificationContextProvider = (props) => {
	const [content, setContent] = useState()

	useEffect(() => {
		const timer = setTimeout(() => {
			setContent(null)
		}, 3700)

		return () => clearTimeout(timer)
	}, [content])

	const context = {
		notificationContent: content,
		showNotification: (content) => setContent(content),
	}

	return (
		<NotificationContext.Provider value={context}>
			{props.children}
		</NotificationContext.Provider>
	)
}

export default NotificationContext
