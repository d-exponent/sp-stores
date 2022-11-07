import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { TbCurrencyNaira } from 'react-icons/tb'
import { formatToCurrency } from '../../lib/utils'

const Product = ({ product }) => {
	const [isDiscount, ] = useState(product.discountPrice)
	const router = useRouter()

	const pushToItemDetailPageHandler = () => {
		router.push(`/products/${product.slug}`)
	}

	return (
		<figure onClick={pushToItemDetailPageHandler}>
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
					<span className='flex'>
						<TbCurrencyNaira />
						{product.discountPriceAsCurrency || formatToCurrency(product.discountPrice)}
					</span>
				) : null}
				{!isDiscount ? (
					<span className='flex'>
						<TbCurrencyNaira />
						{product.priceAsCurrency || formatToCurrency(product.price)}
					</span>
				) : null}
			</figcaption>
		</figure>
	)
}

export default Product
