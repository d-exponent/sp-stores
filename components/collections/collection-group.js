import { useRouter } from 'next/router'

import CollectionItemsGrid from './collection-items-grid'
import Button from '../ui/button'

const CollectionGroup = ({ groups }) => {
	const router = useRouter()

	const handleToCollection = (groupName) => {
		return () => {
			router.push(`/${groupName}`)
		}
	}

	return (
		<ul>
			{groups.map(({ group, _id }) => (
				<li key={_id}>
					<div>
						<h2>{_id}</h2>
						<Button onClick={handleToCollection(_id)} text='View More' />
					</div>

					<CollectionItemsGrid
						items={group}
						showToCollections={true}
						itemShowToBag={true}
					/>
				</li>
			))}
		</ul>
	)
}

export default CollectionGroup
