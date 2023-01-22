import { AiFillStar } from 'react-icons/ai'
import classes from './star.module.css'

export default function Star ({ goldCount })  {
	const countArray = new Array(5).fill(0)

	const stars = countArray.map((star, i) => {
		if (!goldCount) {
			return (
				<span key={i}>
					<AiFillStar />
				</span>
			)
		}
        
        const reducedGoldCount = goldCount - 1
		const isGoldStar = i <= reducedGoldCount
		const starClass = isGoldStar ? classes.goldStar : classes.plainStar

		return (
			<span key={i} className={starClass}>
				<AiFillStar />
			</span>
		)
	})

	return <span>{stars}</span>
}

