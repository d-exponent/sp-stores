import CollectionCard from './collection-card'

const CollectionGrid = ({ collections }) => {
	return (
		<div>
			<h1>Explore our collections</h1>
			<div>
				{collections.map((collection) => (
					<CollectionCard key={collection.slug} {...collection} />
				))}
			</div>
		</div>
	)
}

export default CollectionGrid
