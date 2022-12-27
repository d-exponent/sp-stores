import React, { useSession } from 'next-auth/react'
import { useContext, useRef } from 'react'

import { withFetch } from '../../lib/auth-utils'
import NotificationContext from '../../context/notification'

import Input from '../ui/input'
import Button from '../ui/button'

const Review = (props) => {
	const { showNotification } = useContext(NotificationContext)

	const { data: session, status } = useSession()

	const reviewRef = useRef(null)
	const ratingRef = useRef(null)

	const handleSubmit = async (event) => {
		event.preventDefault()

		//TODO: Make review comments optional for both creating or updating a review

		if (status !== 'authenticated') {
			return showNotification('Login to write a review').error()
		}

		const enteredRating = ratingRef.current?.value * 1
		const enteredComment = reviewRef.current?.value

		if (!enteredRating) {
			return showNotification('Please Enter a rating').error()
		}

		if (!enteredComment) {
			return showNotification('Please Enter a review').error()
		}

		showNotification('Adding review').pending()

		const review = {
			customerEmail: session.user.email,
			customerName: session.user.name,
			productId: props.productId,
			review: enteredComment || '',
			rating: +enteredRating,
		}

		let url = '/api/review'
		let method = 'POST'

		if (props.useUpdateAction) {
			//Modify the Url
			url = `${url}/${props.userReviewId}?`
			method = 'PATCH'

			// Remove redundant properties
			delete review.customerEmail
			delete review.customerName
			delete review.productId
		}

		try {
			await withFetch({
				url,
				method,
				data: review,
			})

			showNotification('Success!! ✔').success()

			reviewRef.current.value = ''
			ratingRef.current.value = ''

			props.hideForm()
		} catch (err) {
			const isDuplicateMessage =
				err.message.trim() === 'This product already exits. Please try another!'

			const errorMessage = isDuplicateMessage
				? 'You already reviewed this product'
				: err.message

			showNotification(errorMessage).error()
		}
	}

	return (
		<form onSubmit={handleSubmit}>
			<select ref={ratingRef}>
				<option value='0'>--Rating--</option>
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

export default Review
