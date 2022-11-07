import { useContext, useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

import { getCheckoutPrice, getItemsIds } from '../lib/checkout-utils'
import NotificationContext from '../context/notification'
import ShoppingItemsContext from '../context/shopping-bag'
import ShoppingItemCard from './cards/shopping-bag-item'
import { withFetch } from '../lib/auth-utils'
import classes from './css-modules/shopping-bag-items.module.css'

const ShoppingBagItems = () => {
	const [isBagItems, setIsBagItems] = useState(false)

	const { items, removeFromBag } = useContext(ShoppingItemsContext)
	const { showNotification } = useContext(NotificationContext)

	
	const session = useSession()

	useEffect(() => {
		if (items.length > 0) {
			setIsBagItems(true)
		}
	}, [items])

	let itemsCardsEl
	if (items.length) {
		itemsCardsEl = items.map((item) => {
			const imagePath = `/images/products/${item.imageCover}`
			const customProps = {
				...item,
				imagePath,
				handleCta: () => removeFromBag(item.slug),
			}
			return <ShoppingItemCard key={item.slug} {...customProps} />
		})
	}

	async function paystackCheckoutHandler() {
		if (!session.data || session.status !== 'authenticated') {
			return showNotification('Please login to make payment').error()
		}

		showNotification('Processing your payment').pending()

		const { user } = session.data
		const { name, email } = user

		const checkoutData = {
			client: { name, email },
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
		<section>
			<h1>Proceed to checkout</h1>
			{isBagItems ? <ul>{itemsCardsEl}</ul> : null}
			{isBagItems ? (
				<button onClick={paystackCheckoutHandler}>Pay with paystack</button>
			) : null}
		</section>
	)
}

export default ShoppingBagItems
