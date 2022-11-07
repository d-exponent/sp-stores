import { useState } from 'react'
import Image from 'next/image'
import { useContext } from 'react'
import { TbCurrencyNaira } from 'react-icons/tb'

import Button from '../ui/button'
import ShoppingItemsContext from '../../context/shopping-bag'
import { formatToCurrency } from '../../lib/utils'

const Product = ({ product }) => {
	const [isDiscount, setIsDiscount] = useState(product.dicscountPrice)
	const { addToBag } = useContext(ShoppingItemsContext)

	const addToshoppingBagHandler = () => addToBag(product)

	return (
		<figure>
			<div>
				<Image
					src={`/images/products/${product.imageCover}`}
					alt={product.name}
					width={200}
					height={250}
					layout='responsive'
					priority='eager'
				/>
			</div>
			<figcaption>
				<h2>{product.name}</h2>
				{isDiscount ? (
					<span>
						{product.discountPriceAsCurrency || formatToCurrency(product.discountPrice)}
					</span>
				) : null}
				{!isDiscount ? (
					<span className='flex'>
						<TbCurrencyNaira />
						{product.priceAsCurrency || formatToCurrency(product.price)}
					</span>
				) : null}
				<Button onClick={addToshoppingBagHandler} text='Add to cart' />
			</figcaption>
		</figure>
	)
}

export default Product
