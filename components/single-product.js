import { useContext, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

import { withFetch } from '../lib/auth-utils'
import ShoppingItemsContext from '../context/shopping-bag'

import Price from './ui/price'
import Carousel from './ui/carousel'
import Button from './ui/button'
import Star from './ui/star'
import Reviews from './cards/review'
import ReviewForm from './forms/review'
import Paystack from './ui/paystack'

import classes from './css-modules/single-product.module.css'

export default function SingleProductPage(props) {
	const [product, setProduct] = useState(props.product)

	const [showReviewForm, setShowReviewForm] = useState(false)
	const [hasBoughtProduct, setHasBoughtProduct] = useState(false)
	const [canUpdateReview, setCanUpdateReview] = useState(false)
	const [currentUserReveiwId, setCurrentUserReviewId] = useState(null)
	const [render, setRender] = useState(false)

	const { data, status } = useSession()

	const { addToBag } = useContext(ShoppingItemsContext)

	const isAuthenticated = status === 'authenticated'

	//  Get the latest version of the current product on every render cycle
	useEffect(() => {
		withFetch({ url: `/api/products/${product._id}` })
			.then(({ serverRes }) => {
				setProduct(serverRes.data)
			})
			.catch((err) => console.log(err.message))
	}, [showReviewForm])

	//  Find the current user's Review and extract the Id
	useEffect(() => {
		if (product.reviews?.length < 1 || !isAuthenticated) return

		const userReview = product.reviews?.find(
			(review) => review.customerEmail === data.user.email
		)

		if (!userReview) return

		setCurrentUserReviewId(userReview._id)
		setCanUpdateReview(true)
	}, [isAuthenticated, product.reviews?.length, data?.user.email])

	//  Only allow users who have purchased the current product to write a review
	useEffect(() => {
		if (!isAuthenticated || hasBoughtProduct) return

		//Fetch all orders for this user
		let query = `customerEmail=${data.user.email}`
		const url = `/api/orders?${query}`

		withFetch({ url })
			.then(({ serverRes: { data: usersOrders } }) => {
				let hasPurchased = false
				let index = 0

				// Check if the current product is in the current user's Orders
				while (!hasPurchased && index < usersOrders.length) {
					const { items } = usersOrders[index]
					hasPurchased = items.some((item) => item._id === product._id)
					index++
				}

				// Allow current user to review the product if hasPurchased is true
				hasPurchased && setHasBoughtProduct(true)
			})
			.catch((err) => setHasBoughtProduct(false))
	}, [isAuthenticated, hasBoughtProduct, product._id, data?.user.email])

	//HANDLERS
	const handleAddtoBag = () => addToBag(product)

	const handleToggleForm = () => setShowReviewForm(!showReviewForm)

	const handleToggleRender = () => setRender(!render)

	const handleHideReviewForm = () => setShowReviewForm(false)

	const carouselImages = getCarouselImages(product)
	const price = product.discountPrice || product.price
	const hasReviews = product.reviews?.length > 0
	const ratingsText = hasReviews ? 'reviews and ratings' : 'ratings'

	let showFormBtnText = 'Write a review'

	if (canUpdateReview) {
		showFormBtnText = 'Update my review'
	}

	if ((canUpdateReview || hasBoughtProduct) && showReviewForm) {
		showFormBtnText = 'I change my mind'
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

			<div className={classes.details}>
				<p>{product.quantity}</p>
				<ul>
					{product.sizes?.map((size) => (
						<li key={size}>{size}</li>
					))}
				</ul>
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

				{isAuthenticated && hasBoughtProduct ? (
					<div>
						<Button onClick={handleToggleForm} text={showFormBtnText} />

						{showReviewForm ? (
							<ReviewForm
								productId={product._id}
								hideForm={handleHideReviewForm}
								useUpdateAction={canUpdateReview}
								userReviewId={currentUserReveiwId}
							/>
						) : null}
					</div>
				) : null}
			</div>
		</section>
	)
}

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
