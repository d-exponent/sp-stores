import Star from '../ui/star'

const Reviews = ({ reviews }) => {
	return (
		<ul>
			{reviews.map(({ _id, customer, ratings, review }) => (
				<li key={_id}>
					<h4>{customer.fullName}</h4>
					<p>{review}</p>
					<span>
						<Star goldCount={ratings} />
					</span>
				</li>
			))}
		</ul>
	)
}

export default Reviews
