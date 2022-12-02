import Star from '../ui/star'

const Reviews = ({ reviews }) => {
	console.log(reviews)

	return (
		<ul>
			{reviews.map(({ _id, customerName, rating, review }) => (
				<li key={_id}>
					<h4>{customerName}</h4>
					<p>{review}</p>
					<span>
						<Star goldCount={rating} />
					</span>
				</li>
			))}
		</ul>
	)
}

export default Reviews
