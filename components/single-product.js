import { useContext, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

import { withFetch } from '../lib/auth-utils'
import ShoppingItemsContext from '../context/shopping-bag'
import NotificationContext from '../context/notification'
import { getCartItems } from '../lib/checkout-utils'

import Price from './ui/price'
import Carousel from './ui/carousel'
import Button from './ui/button'
import Star from './ui/star'
import Reviews from './cards/review'
import ReviewForm from './forms/review'
import Paystack from './ui/paystack'
import Quantity from './single-item/quantity'
import Sizes from './single-item/sizes'

import classes from './css-modules/single-product.module.css'

export default function SingleProductPage(props) {
	const [product] = useState(props.product)
	const [reviews, setReviews] = useState(product.reviews)

	const price = product.discountPrice || product.price

	const [cartItem, setCartDetails] = useState({ quantity: 1, amount: price, size: '' })

	const [showReviewForm, setShowReviewForm] = useState(false)
	const [hasBoughtProduct, setHasBoughtProduct] = useState(false)
	const [canUpdateReview, setCanUpdateReview] = useState(false)
	const [currentUserReveiwId, setCurrentUserReviewId] = useState(null)
	const [render, setRender] = useState(false)

	const { data, status } = useSession()

	const { addToBag } = useContext(ShoppingItemsContext)
	const { showNotification } = useContext(NotificationContext)

	const isAuthenticated = status === 'authenticated'

	//  Update the reviews
	useEffect(() => {
		withFetch({ url: `/api/products/${product._id}` })
			.then(({ serverRes: { data } }) => {
				setReviews(data.reviews)
			})
			.catch((err) => console.log(err.message))
	}, [product._id, showReviewForm])

	// Get the amount of the cart item
	useEffect(() => {
		if (cartItem.quantity === 0) return

		setCartDetails((prev) => ({ ...prev, amount: prev.quantity * price }))
	}, [cartItem.quantity, price])

	//  Find the current user's Review and extract the Id
	useEffect(() => {
		if (reviews?.length < 1 || !isAuthenticated) return

		const { user: email } = data

		if (!reviews) return

		const userReview = reviews?.find((review) => review.customerEmail === email)

		if (userReview) {
			setCurrentUserReviewId(userReview._id)
			setCanUpdateReview(true)
		}
	}, [isAuthenticated, reviews, data])

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

	//Cart Utils
	const increment = () => {
		if (cartItem.quantity < product.quantity) {
			setCartDetails((prevDetails) => ({
				...prevDetails,
				quantity: prevDetails.quantity + 1,
			}))
		}
	}

	const decrement = () => {
		if (cartItem.quantity > 1) {
			setCartDetails((prevDetails) => ({
				...prevDetails,
				quantity: prevDetails.quantity - 1,
			}))
		}
	}

	const getSize = (size) => {
		setCartDetails((prevDetails) => ({ ...prevDetails, size }))
	}

	//HANDLERS
	const handleAddtoBag = () => {
		try {
			checkForCartItemSize(cartItem)
			addToBag({ ...product, cart: cartItem })
			//
		} catch (e) {
			showNotification(e.message).error()
		}
	}

	const handleToggleForm = () => setShowReviewForm(!showReviewForm)

	const handleToggleRender = () => setRender(!render)

	const handleHideReviewForm = () => setShowReviewForm(false)

	const carouselImages = getCarouselImages(product)
	const hasReviews = reviews?.length > 0
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

			<div className={classes.details}>
				<p>{`Only ${product.quantity}units remaining. `}</p>

				<Sizes product={product} getsize={getSize} />

				<Quantity increment={increment} decrement={decrement} count={cartItem.quantity} />

				<div className={classes.orderDetails}>
					<h3>Order Details</h3>
					<p>Quantity: {cartItem.quantity}</p>
					<p>Amount: {cartItem.amount}</p>
					<p>Size: {cartItem.size}</p>
				</div>
			</div>

			<div className={`${classes.cta} grid`}>
				<>
					<Button onClick={handleAddtoBag} text='Add to cart' />
					<Paystack
						items={[{ ...product, cart: cartItem }]}
						singleItem={true}
						amount={price}
						execute={handleToggleRender}
						hasSize={cartItem.size !== ''}
					/>
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
						<Reviews reviews={reviews} />
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


const checkForCartItemSize = (item) => {
	if (!item.size) {
		throw new Error(`Please pick a size😊`)
	}
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
