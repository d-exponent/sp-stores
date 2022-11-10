import Image from 'next/image'
import { useContext } from 'react'
import { useRouter } from 'next/router'

import ShoppingBagContext from '../../context/shopping-bag'
import Price from '../ui/price'
import Button from '../ui/button'
import { formatToCurrency } from '../../lib/utils'

import classes from './item.module.css'



const Item = (props) => {
	const router = useRouter()
	const { addToBag } = useContext(ShoppingBagContext)

	const { product, showToCollections, toBag } = props
	const { category } = product

	const pushToDetailPage = () => {
		router.push(`/products/${product.slug}`)
	}

	const pushToCollectionsPage = () => {
		router.push(`/${category}`)
	}

	const pushToBagItemsPage = () => addToBag(product)


	const displayCollectionBtnText =
		category === 'clothing' || 'Clothing' ? 'Clothes' : category

	return (
		<figure
			className={`${classes.container} ${props.useBoxShadow}`}
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
						{/* <Button onClick={pushToDetailPage} text='See details' /> */}
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
