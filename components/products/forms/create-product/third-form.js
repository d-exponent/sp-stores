import classes from './third-form.module.css'

export default function ThirdForm(props) {
	return (
		<form onSubmit={props.onSubmit} className={classes.form}>
			{props.sizeArray.length > 0 && (
				<div className={classes.sizeContainer}>{props.sizes}</div>
			)}

			<div className={classes.sizeElWrapper}>
				<select className={classes.select} id='sizes' name='sizes' ref={props.reference}>
					<option value=''>Available Sizes</option>
					<option value='xs'>XS</option>
					<option value='sm'>SM</option>
					<option value='m'>M</option>
					<option value='l'>L</option>
					<option value='xl'>XL</option>
					<option value='xxl'>XXL</option>
				</select>
				<button>Add size</button>
			</div>
			<div className={classes.dummyDiv}></div>
		</form>
	)
}
