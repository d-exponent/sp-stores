import { useContext, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

import Price from './ui/price'
import Carousel from './ui/carousel'
import Button from './ui/button'
import Star from './ui/star'
import Reviews from './cards/review'

import PaystackCustomerPay from './ui/paystack'
import ShoppingItemsContext from '../context/shopping-bag'
import classes from './css-modules/single-product.module.css'

const SingleProductPage = (props) => {
	const [product, setProduct] = useState(props.product)

	useEffect(() => {
		fetch(`/api/products/${product.slug}`)
			.then((res) => res.json())
			.then(({ data }) => setProduct(data))
		// .catch((err) => console.log(err)) //TODO: Handle error
	}, [product.slug])

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
			<div className={classes.stats}>
				{product.totalRatings ? <p>Total Ratings: {product.totalRatings}</p> : null}
				<Star goldCount={product.ratingsAverage} />
			</div>
			<div className={classes.reviews}>
				{product.reviews ? <Reviews reviews={product.reviews} /> : null}
			</div>
		</section>
	)
}

export default SingleProductPage
