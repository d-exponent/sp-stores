import classes from './css-modules/empty-items-wrapper.module.css'

const EmptyItems = () => {
	return (
		<div className={classes.empty}>
			<h2>Your cart is Empty</h2>
			<span>Place holder for shopping link</span>
		</div>
	)
}

export default EmptyItems
