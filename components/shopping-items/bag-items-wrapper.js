import { useContext } from 'react'
import { TbCurrencyNaira } from 'react-icons/tb'

import { formatToCurrency } from '../../lib/utils'
import { getCheckoutPrice, getItemsIds } from '../../lib/checkout-utils'
import BagItems from './bag-items'
import PaystackPayButton from '../ui/paystack-pay-button'
import ShoppingBagContext from '../../context/shopping-bag'

import classes from './css-modules/bag-items-wrapper.module.css'

const BagItemsWrapper = () => {
	const { items } = useContext(ShoppingBagContext)

	const totalPrice = getCheckoutPrice(items)
	const formattedTotalPrice = formatToCurrency(totalPrice)

	const checkoutItemsData = {
		totalPrice: totalPrice * 100,
		ids: getItemsIds(items),
	}

	return (
		<div className={classes.wrapper}>
			<div className={classes.itemsList}>
				<BagItems />
			</div>
			<div>
				<div className={`${classes.priceTotal} flex-align-center`}>
					<span>Total Price:</span>
					<span className={`${classes.naira} grid-center `}>
						<TbCurrencyNaira />
					</span>
					<span>{formattedTotalPrice}</span>
				</div>
				<div className={`${classes.cta} grid`}>
					<PaystackPayButton checkoutItemsData={checkoutItemsData} text='Checkout' />
				</div>
			</div>
		</div>
	)
}

export default BagItemsWrapper
