import Image from 'next/image'
import classes from './css-modules/single-product.module.css'

const SingleProductPage = (props) => {

	const { product } = props
	return (
		<section>
			<h1>{product.name}</h1>
			<div>
				<h2>Image Cover</h2>
				<Image
					src={`/images/products/${product.imageCover}`}
					alt={product.name}
					width={500}
					height={500}
				/>
			</div>
			<div>
				<h2>Other Images</h2>
				{product.images.map((image) => (
					<Image
						key={image}
						src={`/images/products/${image}`}
						width={300}
						height={200}
						alt={image}
					/>
				))}
			</div>
			<p>{product.description}</p>
		</section>
	)
}

export default SingleProductPage
