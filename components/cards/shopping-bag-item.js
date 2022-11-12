import Image from 'next/image'
import { TbCurrencyNaira } from 'react-icons/tb'

import Price from '../ui/price'
import Button from '../ui/button'

import classes from './shopping-bag-item.module.css'

const ShoppingBagItem = (props) => {
	const { discountPrice, price } = props

	const productPrices = { discountPrice, price }

	return (
		<li className={`${classes.list} grid`}>
			<h3>{props.name}</h3>
			<div>
				<Image
					src={props.imagePath}
					alt={props.name}
					width={400}
					height={400}
					layout='responsive'
				/>
			</div>
			<div className={`${classes.cta} flex`}>
				<div className={`${classes.alignCenter} flex`}>
					<Price product={productPrices} />
				</div>
				<div className={`${classes.ctaBtnWrapper} grid`}>
					<Button onClick={props.handleCta} text='Remove' />
				</div>
			</div>
		</li>
	)
}

export default ShoppingBagItem
