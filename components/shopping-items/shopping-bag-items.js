import { useContext } from 'react'
import { useSession } from 'next-auth/react'

import { getCheckoutPrice, getItemsIds } from '../../lib/checkout-utils'
import { withFetch } from '../../lib/auth-utils'
import NotificationContext from '../../context/notification'
import ShoppingItemsContext from '../../context/shopping-bag'
import BagItemsWrapper from './bag-items-wrapper'
import EmptyItemsWrapper from './empty-items-wrapper'

import classes from './css-modules/shopping-bag-items.module.css'

const ShoppingBagItems = () => {
	const { items, isItems } = useContext(ShoppingItemsContext)
	const { showNotification } = useContext(NotificationContext)

	const session = useSession()

	async function paystackCheckoutHandler() {
		if (!session.data || session.status !== 'authenticated') {
			return showNotification('Please login to make payment').error()
		}

		showNotification('Processing your payment').pending()
		const { user } = session.data

		const checkoutData = {
			client: { name: user.name, email: user.email },
			items: {
				totalPrice: getCheckoutPrice(items) * 100,
				ids: getItemsIds(items),
			},
		}

		try {
			const { response, serverRes } = await withFetch({
				url: `/api/checkout/payment-session`,
				method: 'POST',
				data: checkoutData,
			})

			if (!response.ok) {
				const errorMessage =
					serverRes.message || 'Error processing payment request! Please try again'

				throw new Error(errorMessage)
			}

			window.location.href = serverRes.auth_url
		} catch (error) {
			showNotification(error.message).error()
		}
	}

	return (
		<section className={classes.container}>
			{!isItems ? <EmptyItemsWrapper /> : null}
			{isItems ? (
				<BagItemsWrapper
					handlePaystack={paystackCheckoutHandler}
					totalPrice={getCheckoutPrice(items)}
				/>
			) : null}
		</section>
	)
}

export default ShoppingBagItems
