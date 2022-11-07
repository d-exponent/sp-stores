const Register = (props) => {
	return (
		<form onSubmit={props.handleSubmit}>
			<input
				type='text'
				name='firstName'
				placeholder='First name'
				onChange={props.handleChange}
				value={props.formData.firstName}
				required
			/>
			<input
				type='text'
				placeholder='Last name'
				name='lastName'
				onChange={props.handleChange}
				value={props.formData.lastName}
				required
			/>
			<input
				type='email'
				placeholder='youremail@email.com'
				required
				onChange={props.handleChange}
				name='email'
				value={props.formData.email}
			/>
			<input
				type='text'
				placeholder='Phone Number'
				required
				name='phoneNumber'
				onChange={props.handleChange}
				value={props.formData.phoneNumber}
			/>
			<input
				type='password'
				placeholder='Enter Password'
				name='password'
				required
				onChange={props.handleChange}
				value={props.formData.password}
			/>
			<input
				type='password'
				placeholder='Confirm Password'
				name='confirmPassword'
				required
				onChange={props.handleChange}
				value={props.formData.confirmPassword}
			/>
			<button disabled={props.disableBtn}>Sign Up</button>
		</form>
	)
}

export default Register
