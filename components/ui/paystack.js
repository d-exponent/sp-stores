import { useSession } from 'next-auth/react'
import { useContext } from 'react'
import { usePaystackPayment } from 'react-paystack'

import { withFetch } from '../../lib/auth-utils'
import NotificationContext from '../../context/notification'
import Button from './button'

const handleSuccess = (notify, func) => {
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

		if (func) {
			func()
		}
	}
}

const handleClose = (fn, message) => {
	return () => fn(message).error()
}

const PaystackCustomerPay = (props) => {
	const { showNotification } = useContext(NotificationContext)

	const { data, status } = useSession()

	const isAuthenticated = status === 'authenticated'

	const getPaymentOptions = () => {
		if (!isAuthenticated) return {}

		return {
			publicKey: 'pk_test_9b85118dc69a219c04177eaa758df84da917cdd1',
			email: data.user.email,
			amount: props.amount * 100, //KOBO
			currency: 'NGN',
			metadata: {
				bag_items_ids: props.itemIds,
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
		isAuthenticated ? handlePayment() : notifyToLogin()
	}

	const btnText = props.text || 'Buy Now'

	return <Button text={btnText} onClick={handleClick} />
}

export default PaystackCustomerPay
