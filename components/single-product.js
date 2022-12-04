import { useContext, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

import Price from './ui/price'
import Carousel from './ui/carousel'
import Button from './ui/button'
import Star from './ui/star'
import Reviews from './cards/review'
import ReviewForm from './forms/review'
import PaystackCustomerPay from './ui/paystack'

import { handleFetchResponse } from '../lib/utils'
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

export default function SingleProductPage(props) {
	const [product, setProduct] = useState(props.product)
	const [showReviewForm, setShowReviewForm] = useState(true)
	const [canReview, setCanReview] = useState(false)

	useEffect(() => {
		console.log('🧰From useEffect')
		console.log(product)
	}, [])

	useEffect(() => {
		fetch(`/api/products/${product.slug}`)
			.then(async (res) => await handleFetchResponse(res))
			.then(({ data }) => {
				setProduct((prevProduct) => ({ ...prevProduct, ...data }))
			})
			.catch((err) => console.log(err.message))
	}, [product.slug, showReviewForm])

	const { addToBag } = useContext(ShoppingItemsContext)

	const { data: session, status } = useSession()

	// GOAL: Only allow users who have purchased a product to write a review
	// useEffect(() => {
	// 	if (status !== 'authenticated') return

	// 	const controller = new AbortController()
	// 	let query = `customerEmail=${session.user.email}`

	// 	fetch(`/api/orders?${query}`, { signal: controller.signal })
	// 		.then(async (res) => await handleFetchResponse(res))
	// 		.then(({ data: usersOrders }) => {
	// 			//
	// 			let hasPurchased = false

	// 			let index = 0

	// 			// Check  usersOrders and find current product if purchased
	// 			while (!hasPurchased && index < usersOrders.length) {
	// 				const { items } = usersOrders[index]
	// 				index++
	// 				hasPurchased = items.some((item) => item._id === product._id)
	// 			}

	// 			// Allow user to review product is hasPurchased is true
	// 			hasPurchased && setCanReview(true)
	// 		})
	// 		.catch((err) => {
	// 			setCanReview(false)
	// 		})
	// }, [product._id, session?.user.email, status])

	

	const handleAddtoBag = () => addToBag(product)
	const handleShowReviewForm = () => setShowReviewForm(!showReviewForm)

	const handleUpdateUi = () => {
		setShowReviewForm(false)
		setCanReview(false)
	}

	const carouselImages = getCarouselImages(product)
	const price = product.discountPrice || product.price
	const hasReviews = product.reviews?.length > 0
	const ratingsText = hasReviews ? 'reviews and ratings' : 'ratings'

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

			<div className={classes.reviewsContainer}>
				<h3>{ratingsText}</h3>
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
					{canReview && !showReviewForm ? (
						<Button onClick={handleShowReviewForm} text='Review Product' />
					) : null}
					{showReviewForm ? (
						<ReviewForm productId={product._id} update={handleUpdateUi} />
					) : null}
				</div>
			</div>
		</section>
	)
}
