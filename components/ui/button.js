import classes from './button.module.css'

const Button = (props) => {
	if (props.renderChildren && props.onClick) {
		return <button onClick={props.onClick}>{props.children}</button>
	}

	if (props.renderChildren) {
		return <button>{props.children}</button>
	}

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
