import { useSession } from 'next-auth/react'
import { useContext } from 'react'

import { withFetch } from '../../lib/auth-utils'
import NotificationContext from '../../context/notification'
import Button from './button'

const PaystackPayButton = (props) => {
	const { data: session, status } = useSession()
	const { showNotification } = useContext(NotificationContext)

	const handlePay = async () => {
		if (!session || status !== 'authenticated') {
			return showNotification('Please login to make payment').error()
		}

		showNotification('Processing your payment').pending()

		const {
			user: { name, email },
		} = session

		const checkoutData = {
			client: { name, email },
			items: props.checkoutItemsData,
		}

		try {
			const { response, serverRes } = await withFetch({
				url: `/api/checkout/payment-session`,
				method: 'POST',
				data: checkoutData,
			})

			if (!response.ok) {
				const errorMessage =
					serverRes.message || 'Error processing your  payment request! Please try again'

				throw new Error(errorMessage)
			}

			window.location.href = serverRes.auth_url
		} catch (error) {
			showNotification(error.message).error()
		}
	}

	return <Button onClick={handlePay} text={props.text} />
}

export default PaystackPayButton
