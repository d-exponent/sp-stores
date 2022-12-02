import { useContext, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

import Price from './ui/price'
import Carousel from './ui/carousel'
import Button from './ui/button'
import Star from './ui/star'
import Reviews from './cards/review'
import ReviewForm from './forms/review'

import PaystackCustomerPay from './ui/paystack'
import ShoppingItemsContext from '../context/shopping-bag'
import classes from './css-modules/single-product.module.css'

const getCarouselImages = ({ imageCover, name, images }) => {
	const imagePath = '/images/products'
	const coverImage = { src: `${imagePath}/${imageCover}`, alt: name }

	const secondaryImages = images?.map((image, i) => ({
		src: `${imagePath}/${image}`,
		alt: `${name}-${i + 1}`,
	}))

	return secondaryImages ? [coverImage, ...secondaryImages] : [coverImage]
}



const SingleProductPage = (props) => {
	const { addToBag } = useContext(ShoppingItemsContext)
	
	const [product, setProduct] = useState(props.product)
	const [reRender, setReRender] = useState(false)

	useEffect(() => {
		fetch(`/api/products/${product.slug}`)
			.then((res) => res.json())
			.then(({ data }) => setProduct(data))
		// .catch((err) => console.log(err)) //TODO: Handle error
	}, [product.slug, reRender])


	const handleAddtoBag = () => addToBag(product)
	const handleRender = () => setReRender((prev) => !prev)

	const carouselImages = getCarouselImages(product)
	const price = product.discountPrice || product.price
	const hasReviews = product.reviews?.length > 0

	return (
		<section className={classes.container}>
			<Carousel images={carouselImages} interval={3500} />
			<h2>{product.name}</h2>

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
			{hasReviews ? (
				<div className={classes.reviews}>
					<Reviews reviews={product.reviews} />
				</div>
			) : null}

			<div>
				<ReviewForm productId={product._id} update={handleRender} />
			</div>
		</section>
	)
}

export default SingleProductPage
