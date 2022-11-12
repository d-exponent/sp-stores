import { TbCurrencyNaira } from 'react-icons/tb'
import { getProductPrice } from '../../lib/utils'

const Price = ({ product }) => {
	return (
		<span className='flex'>
			<TbCurrencyNaira />
			{getProductPrice(product)}
		</span>
	)
}

export default Price
