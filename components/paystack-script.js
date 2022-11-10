import Script from 'next/script'
import Button from './ui/button'

function PaystackScript(props) {
	return (
		<form onSubmit={props.handleSubmit} className='grid' id='paystack'>
			<Script
				src='https://js.paystack.co/v1/inline.js'
				id='use-paystack-inline'
				dangerouslySetInnerHTML={{
					__html: `document.getElementById('paystack')`,
				}}
			/>
			<Button text='Pay with Paystack' />
		</form>
	)
}

export default PaystackScript
