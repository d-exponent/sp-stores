import ReactDOM from 'react-dom'
import classes from './notification.module.css'

const Notification = (props) => {
	const status = {
		success: classes.success,
		pending: classes.pending,
		error: classes.error,
	}

	const statusClass = status[props.status]

	return ReactDOM.createPortal(
		<div className={`${classes.container} ${statusClass}`}>
			<p>{props.message}</p>
		</div>,
		document.getElementById('notifications')
	)
}

export default Notification
