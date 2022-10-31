import classes from './input.module.css'

const Input = (props) => {
	const { type, name, label, accept, required } = props

	if (type === 'textarea') {
		return (
			<div className={classes.formGroup}>
				<label className={classes.formLabel} htmlFor={name}>
					{label}
				</label>
				<textarea
					className={classes.formTextArea}
					rows={6}
					id={name}
					name={name}
				></textarea>
			</div>
		)
	}

	if (type === 'file') {
		return (
			<div className={classes.formGroup}>
				<label className={classes.formLabel} htmlFor={name}>
					{label}
				</label>
				<input type='file' accept={accept} id={name} name={name} />
			</div>
		)
	}

	return (
		<div className={classes.formGroup}>
			<label className={classes.formLabel} htmlFor={name}>
				<p>{label}</p>
				{required && <i>Required</i>}
			</label>

			<input
				className={classes.formControl}
				type={type}
				id={name}
				name={name}
				ref={props.reference}
				placeholder={`Enter ${label}`}
				required={required === true}
			/>
		</div>
	)
}

export default Input
