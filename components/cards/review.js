import Star from '../ui/star'
import classes from './review.module.css'

export default function Reviews({ reviews, currentUserReviewId }) {
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
