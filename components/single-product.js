import {  useContext } from 'react'
import { useSession } from 'next-auth/react'

import Price from './ui/price'
import Carousel from './ui/carousel'
import ShoppingItemsContext from '../context/shopping-bag'
import NotificationContext from '../context/notification'
import PaystackScript from './paystack-script'
import classes from './css-modules/single-product.module.css'

import Button from './ui/button'

const SingleProductPage = ({ product }) => {
	const { data, status } = useSession()

	const { addToBag } = useContext(ShoppingItemsContext)
	const { showNotification } = useContext(NotificationContext)

	const secondaryImages = product.images.map((image, i) => ({
		src: `/images/products/${image}`,
		alt: `${product.name}-${i + 1}`,
	}))

	const coverImage = { src: `/images/products/${product.imageCover}`, alt: product.name }
	const carouselImages = [coverImage, ...secondaryImages]

	function handleAddtoBag() {
		addToBag(product)
	}

	function handlePayWithPaystack(e) {
		e.preventDefault()

		if (status !== 'authenticated') {
			return showNotification('Please login to make payment').error()
		}

		showNotification('Processing payment').pending()
		const {
			user: { name, email },
		} = data

		const productPrice = product.discountPrice || product.price

		let handler = PaystackPop.setup({
			key: 'pk_test_9b85118dc69a219c04177eaa758df84da917cdd1',
			email: email,
			amount: productPrice * 100,
			currency: 'NGN',
			metadata: {
				bag_items_ids: [product._id],
				customer_names: name,
			},
			onClose: function () {
				showNotification('Payment was terminated. Please try again').error()
			},

			callback: function (response) {
				let reference = response.reference

				//TODO: Make a fetch requet via api to confirm reference. Show notification
			},
		})

		handler.openIframe()
	}

	
	const formattedProductName = product.name.toUpperCase()
	return (
		<section className={classes.container}>
			<Carousel images={carouselImages} interval={3500} />
			<h2>{formattedProductName}</h2>
			<p>{product.description}</p>
			
			<Price product={product}/>
			<div className={classes.cta}>
				<>
					<Button onClick={handleAddtoBag} text='Add to cart' />
					<PaystackScript handleSubmit={handlePayWithPaystack} />
				</>
			</div>
			<h3>Reviews and ratings</h3>
		</section>
	)
}

export default SingleProductPage
