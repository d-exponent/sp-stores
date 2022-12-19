import Button from '../ui/button'
import Input from '../ui/input'

import classes from './quantity.module.css'

const Qunatity = (props) => {
	const { increment, decrement, count } = props

	return (
		<div className={classes.container}>
			<h4>👇 Click to increase or reduce purchase items</h4>
			<div className={classes.cta}>
				<Button text='-' onClick={decrement} />
				<input value={count} readOnly />
				<Button text='+' onClick={increment} />
			</div>
		</div>
	)
}

export default Qunatity
