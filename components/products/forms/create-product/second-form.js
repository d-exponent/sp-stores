import Input from '../../../ui/input'
import classes from './second-form.module.css'

export default function SecondForm(props) {
	return (
		<form className={classes.form} onSubmit={props.onSubmit}>
			<Input
				type='text'
				name='image-num'
				reference={props.reference}
				label='Number of images to upload.'
			/>
			<button className={classes.btn}>Enter</button>
		</form>
	)
}
