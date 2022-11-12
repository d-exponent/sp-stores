import { useContext } from 'react'

import Price from './ui/price'
import Carousel from './ui/carousel'
import Button from './ui/button'

import PaystackPayButton from './ui/paystack-pay-button'
import ShoppingItemsContext from '../context/shopping-bag'
import classes from './css-modules/single-product.module.css'

const SingleProductPage = ({ product }) => {
	const { addToBag } = useContext(ShoppingItemsContext)
	

	const handleAddtoBag = () => addToBag(product)

	const imagePath = '/images/products'
	const coverImage = { src: `${imagePath}/${product.imageCover}`, alt: product.name }

	const secondaryImages = product.images?.map((image, i) => ({
		src: `${imagePath}/${image}`,
		alt: `${product.name}-${i + 1}`,
	}))

	const carouselImages = secondaryImages ? [coverImage, ...secondaryImages] : [coverImage]

	const price = product.discountPrice || product.price

	const checkoutItemsData = {
		totalPrice: price * 100,
		ids: [product._id],
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
					<PaystackPayButton text='Buy now' checkoutItemsData={checkoutItemsData} />
				</>
			</div>
			<h3>Reviews and ratings</h3>
		</section>
	)
}

export default SingleProductPage
