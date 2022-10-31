import classes from './button.module.css'

const Button = (props) => {

	let positionClass = ''
	
	if(props.btnClass === 'allow-positioning'){
		positionClass = classes.position
	}
	
	const btnClasses = `${classes.btn} ${positionClass}`
	return <button className={btnClasses}>{props.value}</button>
}

export default Button
