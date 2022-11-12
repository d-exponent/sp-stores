import { useContext } from 'react'
import { useSession } from 'next-auth/react'
import { PaystackButton } from 'react-paystack'

import Price from './ui/price'
import Carousel from './ui/carousel'
import Button from './ui/button'

import { withFetch } from '../lib/auth-utils'
import NotificationContext from '../context/notification'
import ShoppingItemsContext from '../context/shopping-bag'
import classes from './css-modules/single-product.module.css'

const SingleProductPage = ({ product }) => {
	const { addToBag } = useContext(ShoppingItemsContext)
	const { showNotification } = useContext(NotificationContext)
	const { data, status } = useSession()

	const handleAddtoBag = () => addToBag(product)

	const imageSrc = '/images/products'
	const coverImage = { src: `${imageSrc}/${product.imageCover}`, alt: product.name }

	const secondaryImages = product.images?.map((image, i) => ({
		src: `${imageSrc}/${image}`,
		alt: `${product.name}-${i + 1}`,
	}))

	const carouselImages = secondaryImages ? [coverImage, ...secondaryImages] : [coverImage]

	const handleSuccess = async ({ reference }) => {

		showNotification('Verifying success status').pending()

		const url = `/api/checkout/verify-checkout?reference=${reference}`

		const resposne = await fetch(url)
		const { message } = await resposne.json()

		if (!resposne.ok) {
			const errorMessage =
				message || 'Your transaction was not approved. Please try again'
			return showNotification(errorMessage).error()
		}

		showNotification(message).success()
	}

	const handleClose = () =>
		showNotification('Payment was closed before completion').error()

	let paystackProps
	if (status === 'authenticated') {
		paystackProps = {
			publicKey: 'pk_test_9b85118dc69a219c04177eaa758df84da917cdd1',
			email: data.user.email,
			amount: (product.discountPrice || product.price) * 100,
			currency: 'NGN',
			reference: `${data.user.email.split('@')[0]}${Date.now()}`,
			metadata: {
				bag_items_ids: [product._id],
				customer_names: data.user.name,
			},
			text: 'Buy Now',
			onClose: handleClose,
			onSuccess: handleSuccess,
		}
	}

	return (
		<section className={classes.container}>
			<Carousel images={carouselImages} interval={3500} />
			<h2>{product.name.toUpperCase()}</h2>
			<p>{product.description}</p>

			<Price product={product} />
			<div className={`${classes.cta} grid`}>
				<>
					<Button onClick={handleAddtoBag} text='Add to cart' />
					<PaystackButton {...paystackProps} />
				</>
			</div>
			<h3>Reviews and ratings</h3>
		</section>
	)
}

export default SingleProductPage
