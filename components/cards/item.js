import Image from 'next/image'
import { useContext } from 'react'
import { useRouter } from 'next/router'

import ShoppingBagContext from '../../context/shopping-bag'
import Price from '../ui/price'
import Button from '../ui/button'

import classes from './item.module.css'
import { TbChevronsDownLeft } from 'react-icons/tb'

const Item = (props) => {
	const { push } = useRouter()

	const { addToBag } = useContext(ShoppingBagContext)

	const { product, showToCollections, toBag } = props
	const { category } = product

	

	const handlePushItemDetail = () => {
		push(`/products/${product.slug}`)
	}

	const handlePushToCollection = () => push(`/${category}`)

	const handlePushToBag = () => addToBag(product)

	const displayCollectionBtnText =
		category === 'clothing' || 'Clothing' ? 'Clothes' : category

	return (
		<figure
			className={`${classes.container} ${props.useBoxShadow} grid`}
			onClick={handlePushItemDetail}
		>
			<div>
				<Image
					// src={`/images/products/${product.imageCover}`}
					src={product.imageCover}
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
								onClick={handlePushToCollection}
								text={`See more ${displayCollectionBtnText} like this`}
							/>
						) : null}
						{toBag ? <Button onClick={handlePushToBag} text='Add to bag' /> : null}
					</>
				</div>
			</figcaption>
		</figure>
	)
}

export default Item
