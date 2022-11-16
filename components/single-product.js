import { useContext } from 'react'
import { useSession } from 'next-auth/react'

import Price from './ui/price'
import Carousel from './ui/carousel'
import Button from './ui/button'

import PaystackCustomerPay from './ui/paystack'
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

	return (
		<section className={classes.container}>
			<Carousel images={carouselImages} interval={3500} />
			<h2>{product.name.toUpperCase()}</h2>
			<p>{product.description}</p>

			<Price product={product} />
			<div className={`${classes.cta} grid`}>
				<>
					<Button onClick={handleAddtoBag} text='Add to cart' />
					<PaystackCustomerPay itemIds={[product._id]} amount={price} />
				</>
			</div>
			<h3>Reviews and ratings</h3>
		</section>
	)
}

export default SingleProductPage
