import Script from 'next/script'
import Button from './ui/button'

function PaystackScript(props) {
	return (
		<form onSubmit={props.handleSubmit} className='grid'>
			<Script src='https://js.paystack.co/v1/inline.js' />
			<Button text='Pay with Paystack' />
		</form>
	)
}

export default PaystackScript
