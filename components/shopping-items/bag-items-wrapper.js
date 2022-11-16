import Router from 'next/router'
import { useContext } from 'react'
import { TbCurrencyNaira } from 'react-icons/tb'

import { formatToCurrency } from '../../lib/utils'
import { getCheckoutPrice, getItemsIds } from '../../lib/checkout-utils'
import BagItems from './bag-items'
import PaystackCustomerPay from '../ui/paystack'
import ShoppingBagContext from '../../context/shopping-bag'

import classes from './css-modules/bag-items-wrapper.module.css'

const BagItemsWrapper = () => {
	const { items } = useContext(ShoppingBagContext)

	const totalPrice = getCheckoutPrice(items)
	const formattedTotalPrice = formatToCurrency(totalPrice)

	const clearLocalStorage = () => {
		window.localStorage.clear()
		Router.reload(window.location.pathname)
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
					<PaystackCustomerPay
						itemIds={getItemsIds(items)}
						amount={totalPrice}
						text='Checkout'
						execute={clearLocalStorage}
					/>
				</div>
			</div>
		</div>
	)
}

export default BagItemsWrapper
