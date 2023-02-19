import { useSession } from 'next-auth/react'
import { useContext } from 'react'
import { usePaystackPayment } from 'react-paystack'

import { withFetch } from '../../../lib/auth-utils'
import { getCartItems, getCheckoutPrice } from '../../../lib/checkout-utils'
import NotificationContext from '../../../context/notification'
import Button from '../../ui/button'

const handlePaymentSuccess = function (notify, callToActions) {
	return async ({ reference }) => {
		// Validate the payment status and notify the user
		const [resPromise] = withFetch({
			method: 'POST',
			data: { reference },
			url: '/api/checkout/verify-payment',
		})

		let serverRes

		try {
			serverRes = await resPromise
		} catch (e) {
			notify('Something went wrong. Contact customer care any complaints').error()
		}

		if (!serverRes.success) return notify(serverRes.message).error()

		notify(serverRes.message).success()

		// Execute arguments
		if (callToActions.length > 0) {
			callToActions.forEach((callToAction) => callToAction())
		}
	}
}

const handlePaymentCancel = (fn, message) => () => fn(message).error()

export default function Paystack(props) {
	const { showNotification } = useContext(NotificationContext)

	const { data, status } = useSession()

	const isAuthenticated = status === 'authenticated'

	const getPaymentOptions = function () {
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

	const handleClick = function () {
		if (props.singleItem && !props.hasSize) {
			showNotification('Please select a size for this product').error()
			return
		}

		isAuthenticated
			? handlePayment()
			: showNotification('Please login to make payment').error()
	}

	const handlePayment = async function () {
		showNotification('Processing your payment').pending()

		initializePayment(
			handlePaymentSuccess(showNotification, props.execute),
			handlePaymentCancel(showNotification, 'Payment was terminated')
		)
	}

	const btnText = props.text || 'Buy Now'

	return <Button text={btnText} onClick={handleClick} />
}
