import Button from '../ui/button'
import BagItems from './bag-items'
import { TbCurrencyNaira } from 'react-icons/tb'
import { formatToCurrency } from '../../lib/utils'

import classes from './css-modules/bag-items-wrapper.module.css'

const BagItemsWrapper = (props) => {
	const formattedTotalPrice = formatToCurrency(props.totalPrice)
	return (
		<div>
			<div className={classes.itemsList}>
				<BagItems />
			</div>
			<div>
				<div className={classes.priceTotal}>
					<span>Total Price:</span>
					<span className={`${classes.naira} grid-center `}>
						<TbCurrencyNaira />
					</span>
					<span>{formattedTotalPrice}</span>
				</div>
				<div className={classes.cta}>
					<Button onClick={props.handlePaystack} text='Pay with Paystack' />
				</div>
			</div>
		</div>
	)
}

export default BagItemsWrapper