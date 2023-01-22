import Button from '../ui/button'
import Input from '../ui/input'

export default function UpdatePasswordForm(props) {
	return (
		<form onSubmit={props.onSubmit} className='box-shadow-light'>
			<>
				<Input
					type='password'
					label='current password'
					name='current-password'
					required={true}
					reference={props.currentPasswordRef}
					placeholder='Enter your current password'
				/>
				<Input
					type='password'
					label='New password'
					name='new-password'
					required={true}
					reference={props.newPasswordRef}
					placeholder='Enter your new password'
				/>
			</>
			<Button text='Update Password' />
		</form>
	)
}
