import { useSession } from 'next-auth/react'
import { useContext, useRef } from 'react'

import Input from '../ui/input'
import Button from '../ui/button'

import { withFetch } from '../../lib/auth-utils'
import NotificationContext from '../../context/notification'

const Review = (props) => {
	const { showNotification } = useContext(NotificationContext)

	const { data, status } = useSession()

	const reviewRef = useRef(null)
	const ratingRef = useRef(null)

	const handleSubmit = async (event) => {
		event.preventDefault()


		if (status !== 'authenticated') {
			return showNotification('Login to write a review').error()
		}

		showNotification('Adding review').pending()

		const enteredRating = ratingRef.current?.value * 1

		if (!enteredRating) {
			return showNotification('Please enter a rating').error()
		}

		const enteredReview = reviewRef.current?.value

		const review = {
			customerEmail: data.user.email,
			customerName: data.user.name,
			product: props.productId,
			review: enteredReview || '',
			rating: +enteredRating,
		}


		try {
			const { response, serverRes } = await withFetch({
				url: '/api/review',
				method: 'POST',
				data: review,
			})

			if (!response.ok) {
				throw new Error(serverRes.message)
			}

			showNotification('Success!! ✔').success()
			props.update()

			reviewRef.current.value = ''
			ratingRef.current.value = ''

		} catch (err) {
			const duplicateReviewServerMessage =
				'This product already exits. Please try another!'
			const isDuplicateMessage = err.message.trim() === duplicateReviewServerMessage

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
