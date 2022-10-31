import Image from 'next/image'
import { useContext } from 'react'
import { TbCurrencyNaira } from 'react-icons/tb'

import ShoppingItemsContext from '../../context/shopping-bag'

const Product = ({ product, favorite, purchase, showPrice }) => {
	const { addToBag } = useContext(ShoppingItemsContext)

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
				{showPrice && (
					<span className='flex'>
						<TbCurrencyNaira />
						{product.priceAsCurrency}
					</span>
				)}
			</figcaption>
			<div>
				{favorite && <button>Buy now</button>}
				{purchase && <button onClick={() => addToBag(product)}>Add to bag</button>}
			</div>
		</figure>
	)
}

export default Product
