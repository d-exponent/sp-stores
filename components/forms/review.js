import React, { useSession } from 'next-auth/react'
import { useContext, useRef } from 'react'

import { withFetch } from '../../lib/auth-utils'
import NotificationContext from '../../context/notification'

import Input from '../ui/input'
import Button from '../ui/button'

export default function Review(props) {
	const { showNotification } = useContext(NotificationContext)

	const { data: session, status } = useSession()

	const reviewRef = useRef(null)
	const ratingRef = useRef(null)

	const handleSubmit = async function (event) {
		event.preventDefault()

		if (status !== 'authenticated') {
			return showNotification('Login to write a review').error()
		}

		const enteredReviewRating = ratingRef.current?.value * 1
		const enteredReviewComment = reviewRef.current?.value
		const newReview = !Boolean(props.useUpdateAction)

		if (newReview && !enteredReviewRating) {
			return showNotification('Please Enter a rating').error()
		}

		if (!newReview && !enteredReviewRating && !enteredReviewComment) {
			return showNotification('Please Enter a rating or a review').error()
		}

		const pendingMessage = newReview ? 'Adding review' : 'Updating your review'
		showNotification(pendingMessage).pending()

		const review = {
			customerEmail: session.user.email,
			customerName: session.user.name,
			productId: props.productId,
			review: enteredReviewComment || '',
			rating: +enteredReviewRating || 0,
		}

		let url = '/api/review'
		let method = 'POST'

		if (!newReview) {
			// Remove redundant properties
			delete review.customerEmail
			delete review.customerName
			delete review.productId

			//configure review and ratings properties on the review object
			review.review = Boolean(enteredReviewComment)
				? enteredReviewComment
				: props.userReviewDetails.review

			review.rating = Boolean(enteredReviewRating)
				? +enteredReviewRating
				: props.userReviewDetails.rating

			review.review === '' && delete review.review
			review.rating < 1 && delete review.rating

			//Modify the Url
			url = `${url}/${props.userReviewDetails.reviewId}?`
			method = 'PATCH'
		}

		review.review = review.review === '' ? undefined : review.review
		
		const [resPromise] = withFetch({
			url,
			method,
			data: review,
		})

		try {
			const res = await resPromise

			if (!res.success) throw new Error(res.message)

			reviewRef.current.value = ''
			ratingRef.current.value = ''

			props.afterSubmit()
			showNotification('Success!! ✔').success()
		} catch (err) {
			
			// const isDuplicateMessage =
			// 	err.message.trim() === 'This product already exits. Please try another!'

			// const errorMessage = isDuplicateMessage
			// 	? 'You already reviewed this product'
			// 	: err.message

			showNotification('Error').error()
		}
	}

	return (
		<form onSubmit={handleSubmit}>
			<select ref={ratingRef}>
				<option value=''>--Rating--</option>
				<option value='1'>1</option>
				<option value='2'>2</option>
				<option value='3'>3</option>
				<option value='4'>4</option>
				<option value='5'>5</option>
			</select>

			<Input type='textarea' label='Review Note:' reference={reviewRef} name='review' />
			<Button text='Submit review' />
		</form>
	)
}
