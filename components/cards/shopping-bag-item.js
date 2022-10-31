import Image from 'next/image'
import { TbCurrencyNaira } from 'react-icons/tb'

const ShoppingBagItem = (props) => {
	return (
		<li>
			<h2>{props.name}</h2>
			<div>
				<Image
					src={props.imagePath}
					alt={props.name}
					width={400}
					height={400}
					layout='responsive'
				/>
			</div>
			<div className='flex'>
				<span>
					<TbCurrencyNaira />
				</span>
				<span>{props.priceAsCurrency}</span>
			</div>
			<button onClick={props.handleCta}>Remove Item</button>
		</li>
	)
}

 
export default ShoppingBagItem;


