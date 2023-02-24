import { TbCurrencyNaira } from 'react-icons/tb'
import { getProductPrice } from '../../lib/utils'

export default function Price(props) {
  return (
    <span className="flex">
      <TbCurrencyNaira />
      {getProductPrice(props.product)}
    </span>
  )
}
