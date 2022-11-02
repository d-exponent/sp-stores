import { useContext, useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

import { getCheckoutPrice, getItemsIds } from '../lib/checkout-utils'
import NotificationContext from '../context/notification'
import ShoppingItemsContext from '../context/shopping-bag'
import ShoppingItemCard from './cards/shopping-bag-item'
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

		const user = session.data.user
		const [firstName, lastName] = user.name.split(' ')

		const checkoutData = {
			client: { firstName, lastName, email: user.email },
			items: {
				totalPrice: getCheckoutPrice(items) * 100,
				ids: getItemsIds(items),
			},
		}

		const fetchConfig = {
			method: 'POST',
			body: JSON.stringify(checkoutData),
			headers: {
				'Content-Type': 'application/json',
			},
		}

		const res = await fetch(`/api/checkout/payment-session`, fetchConfig)
		const data = await res.json()

		if (!res.ok) {
			const errorNotification = new Notification(
				data.message || 'Error processing payment request! Please try again'
			).error()
			return showNotification(errorNotification)
		}
		window.location.href = data.auth_url
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
