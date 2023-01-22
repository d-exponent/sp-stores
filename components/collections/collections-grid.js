import CollectionCard from './collection-card'

export default function CollectionGrid({ collections }) {
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
