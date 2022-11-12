import { TbCurrencyNaira } from 'react-icons/tb'
import { getProductPrice } from '../../lib/utils'

const Price = ({ product }) => {
	const price = getProductPrice(product)
	

	return (
		<span className='flex'>
			<TbCurrencyNaira />
			{price}
		</span>
	)
}

export default Price
