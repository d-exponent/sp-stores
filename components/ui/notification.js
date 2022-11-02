import ReactDOM from 'react-dom'
import { useContext } from 'react'
import classes from './notification.module.css'
import NotificationContext from '../../context/notification'

const Notification = (props) => {
	const { showNotification } = useContext(NotificationContext)

	const status = {
		success: classes.success,
		pending: classes.pending,
		error: classes.error,
	}

	const hideNotificationHandler = () => showNotification().hide()

	return ReactDOM.createPortal(
		<div
			className={`${classes.container} ${status[props.status]}`}
			onClick={hideNotificationHandler}
		>
			<p>{props.message}</p>
		</div>,
		document.getElementById('notifications')
	)
}

export default Notification
