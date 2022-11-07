import classes from './button.module.css'

const Button = (props) => {
	if (props.onClick) {
		return (
			<button className={classes.btn} onClick={props.onClick}>
				{props.text}
			</button>
		)
	}
	return <button className={classes.btn}>{props.text}</button>
}

export default Button
