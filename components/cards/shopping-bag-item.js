import Image from 'next/image'
import { TbCurrencyNaira } from 'react-icons/tb'
import Button from '../ui/button'

import classes from './shopping-bag-item.module.css'

const ShoppingBagItem = (props) => {
	return (
		<li className={classes.list}>
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
			<div className={classes.cta}>
				<div className={classes.justify}>
					<span className={classes.naira}>
						<TbCurrencyNaira />
					</span>
					<span>{props.priceAsCurrency}</span>
				</div>

				<Button onClick={props.handleCta} text='Remove Item' />
			</div>
		</li>
	)
}

export default ShoppingBagItem
