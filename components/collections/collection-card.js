import { useRouter } from 'next/router'
import Image from 'next/image'

import Button from '../ui/button'
import classes from './collection-card.module.css'

const CollectionCard = (props) => {
	const router = useRouter()

	const collectionsPagePath = `/${props.slug}`
	const imageSource = `/images/collections/${props.slug}/${props.slug}.jpg`

	function handleClick() {
		router.push(collectionsPagePath)
	}

	return (
		<div className={classes.container}>
			<div className={classes.imgWrapper}>
				<Image
					className={classes.image}
					src={imageSource}
					alt={props.title}
					width={200}
					height={150}
					layout='responsive'
				/>
			</div>
			<h3>{props.title}</h3>
			<p>{props.summary}</p>
			<Button onClick={handleClick} text='view collection' />
		</div>
	)
}

export default CollectionCard
