import { useContext, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

import { withFetch } from '../lib/auth-utils'
import ShoppingItemsContext from '../context/shopping-bag'
import NotificationContext from '../context/notification'

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
	const [product, setProduct] = useState(props.product)

	const price = product.discountPrice || product.price
	const { reviews } = product

	const [cartItem, setCartItems] = useState({ quantity: 1, amount: price, size: '' })
	const [showReviewForm, setShowReviewForm] = useState(false)
	const [hasPurchasedProduct, setHasPurchasedProduct] = useState(false)
	const [canUpdateReview, setCanUpdateReview] = useState(false)
	const [userReviewId, setUserReviewId] = useState(null)
	const [reRender, setReRender] = useState(false)

	const { data, status } = useSession()

	const { addToBag } = useContext(ShoppingItemsContext)
	const { showNotification } = useContext(NotificationContext)

	const isAuthenticated = status === 'authenticated'

	//  Update the product after a  successfull review
	useEffect(() => {
		withFetch({ url: `/api/products/${product.id}` })
			.then(({ serverRes: { data: product } }) => setProduct(product))
			.catch((err) => console.log(err.message))
	}, [product.id, reRender])

	// Get the amount of the cart item
	useEffect(() => {
		if (cartItem.quantity === 0) return

		setCartItems((prev) => ({ ...prev, amount: prev.quantity * price }))
	}, [cartItem.quantity, price])

	//  Find the current user's Review and extract the Id
	useEffect(() => {
		if (reviews.length < 1 || !isAuthenticated) return

		const { user: email } = data

		const userReview = product.reviews?.find((review) => review.customerEmail === email)

		if (!userReview) return

		setUserReviewId(userReview._id)
		setCanUpdateReview(true)
	}, [isAuthenticated, data, product.reviews, reviews.length])

	//  Only allow users who have purchased the current product to write a review
	// useEffect(() => {
	// 	if (!isAuthenticated || hasPurchasedProduct) return

	// 	//Fetch all orders for this user
	// 	const query = `customerEmail=${data.user.email}`
	// 	const url = `/api/orders?${query}`

	// 	withFetch({ url })
	// 		.then(({ serverRes: { data: usersOrders } }) => {
	// 			const ordersLength = usersOrders.length
	// 			let hasBought = false
	// 			let index = 0

	// 			// Check if the current product is in the user's Orders
	// 			while (!hasBought && index < ordersLength) {
	// 				const { cartItems } = usersOrders[index]
	// 				hasBought = cartItems.some((item) => item.productId === product._id)
	// 				index++
	// 			}

	// 			// Allow current user to review the product if hasBought is true
	// 			hasBought && setHasPurchasedProduct(true)
	// 		})
	// 		.catch((err) => setHasPurchasedProduct(false))
	// }, [isAuthenticated, hasPurchasedProduct, product._id, data?.user.email])

	//Cart Utils
	const increment = () => {
		if (!cartItem.size) {
			return showNotification('Please pick a size').error()
		}

		const sizeDetails = product.sizes.find(({ size }) => size === cartItem.size)

		if (cartItem.quantity < sizeDetails.quantity) {
			setCartItems((prevDetails) => ({
				...prevDetails,
				quantity: prevDetails.quantity + 1,
			}))
		}
	}

	const decrement = () => {
		if (cartItem.quantity > 1) {
			setCartItems((prevDetails) => ({
				...prevDetails,
				quantity: prevDetails.quantity - 1,
			}))
		}
	}

	const getSize = (size, quantity) => {
		setCartItems((prevDetails) => ({ ...prevDetails, size, quantity }))
	}

	//HANDLERS
	const handleAddtoBag = () => {
		try {
			checkForCartItemSize(cartItem)
			addToBag({ ...product, cart: cartItem })
		} catch (e) {
			showNotification(e.message).error()
		}
	}

	const handleToggleForm = () => setShowReviewForm(!showReviewForm)

	const handleToggleRender = () => setReRender(!reRender)

	const handleHideReviewForm = () => setShowReviewForm(false)

	const handleAfterSubmitReviewForm = () => {
		handleHideReviewForm()
		setReRender(!reRender)
	}

	const carouselImages = getCarouselImages(product)
	const ratingsText = product.reviews?.length > 0 ? 'reviews and ratings' : 'ratings'

	let showFormBtnText = 'Write a review'

	if (canUpdateReview) {
		showFormBtnText = 'Update my review'
	}

	if ((canUpdateReview || hasPurchasedProduct) && showReviewForm) {
		showFormBtnText = 'I change my mind'
	}

	return (
		<section className={classes.container}>
			<Carousel images={carouselImages} interval={3500} />
			<h2>{product.name}</h2>

			<Price product={product} />

			<div className={classes.details}>
				<p>{`Only ${product.quantity} units left! `}</p>

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
				{reviews?.length > 0 ? (
					<div className={classes.reviews}>
						<Reviews reviews={reviews} />
					</div>
				) : null}

				{isAuthenticated && hasPurchasedProduct ? (
					<div>
						<Button onClick={handleToggleForm} text={showFormBtnText} />

						{showReviewForm ? (
							<ReviewForm
								productId={product.id}
								afterSubmit={handleAfterSubmitReviewForm}
								useUpdateAction={canUpdateReview}
								userReviewId={userReviewId}
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

	// TODO: Change setup in production to relative paths
	// const imagePath = '/images/products'
	// const coverImage = { src: `${imagePath}/${imageCover}`, alt: name }
	// const imagePath = '/images/products'
	// const coverImage = { src: `${imagePath}/${imageCover}`, alt: name }
	const coverImage = { src: imageCover, alt: name }

	const secondaryImages = images?.map((image, i) => ({
		// src: `${imagePath}/${image}`,
		src: image,
		alt: `${name}-${i + 1}`,
	}))

	return secondaryImages ? [coverImage, ...secondaryImages] : [coverImage]
}
