import { useSession } from 'next-auth/react'
import { useContext } from 'react'
import { usePaystackPayment } from 'react-paystack'

import { withFetch } from '../../lib/auth-utils'
import { getCartItems, getCheckoutPrice } from '../../lib/checkout-utils'
import NotificationContext from '../../context/notification'
import Button from './button'

const handleSuccess = (notify, ...args) => {
	return async ({ reference }) => {
		// Validate the payment status and notify the user
		const { response, serverRes } = await withFetch({
			method: 'POST',
			data: { reference },
			url: '/api/checkout/verify-payment',
		})

		const { message } = serverRes

		if (!response.ok) return notify(message).error()

		notify(message).success()

		// Execute arguments
		if (args.length > 0) {
			console.log("Has Args🧰")
			args.forEach((arg) => arg())
		}
	}
}

const handleClose = (fn, message) => {
	return () => fn(message).error()
}

const Paystack = (props) => {
	const { showNotification } = useContext(NotificationContext)

	const { data, status } = useSession()

	const isAuthenticated = status === 'authenticated'

	const getPaymentOptions = () => {

		if (!isAuthenticated) return {}
		
		return {
			publicKey: 'pk_test_9b85118dc69a219c04177eaa758df84da917cdd1',
			email: data.user.email,
			amount: getCheckoutPrice(props.items) * 100, //KOBO
			currency: 'NGN',
			metadata: {
				cartItems: getCartItems(props.items),
				customer_names: data.user.name,
			},
		}
	}
	
	const initializePayment = usePaystackPayment(getPaymentOptions())

	

	const handlePayment = async () => {
		showNotification('Processing your payment').pending()

		initializePayment(
			handleSuccess(showNotification, props.execute),
			handleClose(showNotification, 'Payment was terminated')
		)
	}

	const notifyToLogin = () => {
		showNotification('Please login to make payment').error()
	}

	const handleClick = () => {

		if (props.singleItem && !props.hasSize) {
			showNotification('Please select a size for this product').error()
			return
		}

		isAuthenticated ? handlePayment() : notifyToLogin()
	}

	const btnText = props.text || 'Buy Now'

	return <Button text={btnText} onClick={handleClick} />
}

export default Paystack
