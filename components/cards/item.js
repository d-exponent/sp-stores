import Image from 'next/image'
import { useRouter } from 'next/router'
import { TbCurrencyNaira } from 'react-icons/tb'

import Button from '../ui/button'
import { formatToCurrency } from '../../lib/utils'

import classes from './item.module.css'

function getProductPrice(product) {
	if (product.discountPrice) {
		return product.discountPrice
	}

	return product.price
}

const Product = (props) => {
	const { product, showToCollections } = props
	const { category } = product
	const router = useRouter()

	const pushToDetailPage = () => {
		router.push(`/products/${product.slug}`)
	}

	const pushToCollectionsPage = () => {
		router.push(`/${category}`)
	}

	const productPrice = getProductPrice(product)
	const formattedPrice = formatToCurrency(productPrice)

	const displayCollectionBtnText = category === 'clothing' ? 'Clothes' : category

	return (
		<figure className={classes.container}>
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
			<figcaption>
				<h2>{product.name}</h2>

				<span className='flex'>
					<TbCurrencyNaira />
					{formattedPrice}
				</span>
				<div className={classes.ctaButtons}>
					<>
						<Button onClick={pushToDetailPage} text='View details' />
						{showToCollections ? (
							<Button
								onClick={pushToCollectionsPage}
								text={`View more ${displayCollectionBtnText} like this`}
							/>
						) : null}
					</>
				</div>
			</figcaption>
		</figure>
	)
}

export default Product
