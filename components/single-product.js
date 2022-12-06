import { useContext, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

import Price from './ui/price'
import Carousel from './ui/carousel'
import Button from './ui/button'
import Star from './ui/star'
import Reviews from './cards/review'
import ReviewForm from './forms/review'
import Paystack from './ui/paystack'

import { withFetch } from '../lib/auth-utils'
import ShoppingItemsContext from '../context/shopping-bag'
import classes from './css-modules/single-product.module.css'

const getCarouselImages = (product) => {
	const { imageCover, name, images } = product
	//
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
	const [showReviewForm, setShowReviewForm] = useState(false)
	const [hasBoughtProduct, setHasBoughtProduct] = useState(false)
	const [canUpdateReview, setCanUpdateReview] = useState(false)
	const [userReviewId, setUserReviewId] = useState(null)
	const [render, setRender] = useState(false)

	const { data: session, status } = useSession()

	const { addToBag } = useContext(ShoppingItemsContext)

	const isAuthenticated = status === 'authenticated'

	// GOAL: Resolve if user has already reviewed this product
	useEffect(() => {
		if (product.reviews.length < 1 || !isAuthenticated) return

		const userReview = product.reviews.find(
			(review) => review.customerEmail === session.user.email
		)

		if (!userReview) return

		setUserReviewId(userReview._id)
		setCanUpdateReview(true)
	}, [isAuthenticated, product.reviews, product.reviews?.length, session?.user.email])

	// GOAL: Fetch product on every render
	useEffect(() => {
		const url = `/api/products/${product._id}`
		withFetch({ url })
			.then(({ response, serverRes }) => {
				if (!response.ok) {
					throw new Error(serverRes.message)
				}

				setProduct(serverRes.data)
			})
			.catch((err) => console.log(err.message))
	}, [])

	// GOAL: Only allow users who have purchased a product to write a review
	useEffect(() => {
		if (!isAuthenticated || hasBoughtProduct) return

		//Fetch all orders for this user
		let query = `customerEmail=${session.user.email}`
		const url = `/api/orders?${query}`

		withFetch({ url })
			.then(({ response, serverRes }) => {
				if (!response.ok) {
					throw new Error(serverRes.message)
				}

				const usersOrders = serverRes.data
				let hasPurchased = false
				let index = 0

				// Check if current product is in the User's Orders
				while (!hasPurchased && index < usersOrders.length) {
					const { items } = usersOrders[index]
					index++
					hasPurchased = items.some((item) => item._id === product._id)
				}

				// Allow user to review product if hasPurchased is true
				hasPurchased && setHasBoughtProduct(true)
			})
			.catch((err) => setHasBoughtProduct(false))
	}, [isAuthenticated, hasBoughtProduct, product._id, session?.user.email])

	//HANDLERS
	const handleAddtoBag = () => addToBag(product)
	const handleToggleForm = () => {
		setShowReviewForm((prevState) => !prevState)
	}

	const handleToggleRender = () => {
		setRender((prevState) => !prevState)
	}

	const handleUpdateUi = () => {
		setShowReviewForm(false)
		setHasBoughtProduct(false)
	}

	const carouselImages = getCarouselImages(product)
	const price = product.discountPrice || product.price
	const hasReviews = product.reviews?.length > 0
	const ratingsText = hasReviews ? 'reviews and ratings' : 'ratings'

	let showReviewFormBtnText = 'Write a review'

	if (canUpdateReview) {
		showReviewFormBtnText = 'Update my review'
	}

	if ((canUpdateReview || hasBoughtProduct) && showReviewForm) {
		showReviewFormBtnText = 'I change my mind'
	}

	return (
		<section className={classes.container}>
			<Carousel images={carouselImages} interval={3500} />
			<h2>{product.name}</h2>

			<Price product={product} />
			<div className={`${classes.cta} grid`}>
				<>
					<Button onClick={handleAddtoBag} text='Add to cart' />
					<Paystack itemIds={[product._id]} amount={price} execute={handleToggleRender} />
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

				{hasBoughtProduct ? (
					<div>
						<Button onClick={handleToggleForm} text={showReviewFormBtnText} />

						{showReviewForm ? (
							<ReviewForm
								productId={product._id}
								update={handleUpdateUi}
								useUpdateReview={canUpdateReview}
								updateReviewId={userReviewId}
							/>
						) : null}
					</div>
				) : null}
			</div>
		</section>
	)
}
