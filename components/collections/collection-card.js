import { useRouter } from 'next/router'
import Image from 'next/image'

import Button from '../ui/button'

const CollectionCard = (props) => {
	const router = useRouter()

	const collectionPath = `/${props.slug}`
	const imageSource = `/images/collections/${props.slug}/${props.slug}.jpg`

	function handleClick() {
		router.push(collectionPath)
	}

	return (
		<div onClick={handleClick}>
			<div>
				<Image
					src={imageSource}
					alt={props.title}
					width={200}
					height={150}
					layout='responsive'
				/>
			</div>
			<p>{`${props.title}`}</p>
		</div>
	)
}

export default CollectionCard
