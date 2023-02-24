import classes from './input.module.css'

export default function Input(props) {
  const {
    type,
    name,
    label,
    accept,
    required,
    reference,
    value,
    placeholder,
    readOnly,
  } = props

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
          ref={reference}
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
        <input type="file" accept={accept} id={name} name={name} />
      </div>
    )
  }

  if (type === 'password') {
    return (
      <div className={classes.formGroup}>
        {label ? (
          <label className={classes.formLabel} htmlFor={name}>
            <p>{label}</p>
            {required && <span>*</span>}
          </label>
        ) : null}

        <input
          className={classes.formControl}
          type={type}
          id={name}
          name={name}
          ref={reference}
          placeholder={placeholder}
          required={required === true}
          readOnly={readOnly}
        />
      </div>
    )
  }

  return (
    <div className={classes.formGroup}>
      <label className={classes.formLabel} htmlFor={name}>
        <p>{label}</p>
        {required && <span>*</span>}
      </label>

      <input
        className={classes.formControl}
        type={type}
        id={name}
        name={name}
        value={value}
        ref={props.reference}
        placeholder={props.placeholder}
        required={required}
        readOnly={props.readOnly}
      />
    </div>
  )
}
