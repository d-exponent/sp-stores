import Image from 'next/image'
import { useContext } from 'react'
import { useRouter } from 'next/router'

import ShoppingBagContext from '../../context/shopping-bag'
import Price from '../ui/price'
import Button from '../ui/button'

import classes from './item.module.css'

const Item = (props) => {
	const { push } = useRouter()

	const { addToBag } = useContext(ShoppingBagContext)

	const { product, showToCollections, toBag } = props
	const { category } = product

	const pushToDetailPage = () => push(`/products/${product.slug}`)

	const pushToCollectionsPage = () => push(`/${category}`)

	const pushToBagItemsPage = () => addToBag(product)

	const displayCollectionBtnText =
		category === 'clothing' || 'Clothing' ? 'Clothes' : category

	return (
		<figure
			className={`${classes.container} ${props.useBoxShadow} grid`}
			onClick={pushToDetailPage}
		>
			<div>
				<Image
					src={`/images/products/${product.imageCover}`}
					alt={product.name}
					width={200}
					height={200}
					layout='responsive'
					priority='eager'
				/>
			</div>
			<figcaption className='grid'>
				<h3>{product.name}</h3>
				<Price product={product} />
				<div className='grid'>
					<>
						{showToCollections ? (
							<Button
								onClick={pushToCollectionsPage}
								text={`See more ${displayCollectionBtnText} like this`}
							/>
						) : null}
						{toBag ? <Button onClick={pushToBagItemsPage} text='Add to bag' /> : null}
					</>
				</div>
			</figcaption>
		</figure>
	)
}

export default Item
