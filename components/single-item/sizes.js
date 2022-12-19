import { useState } from 'react'
import classes from './sizes.module.css'

const Sizes = ({ product, getsize }) => {
	const [listIndex, setListIndex] = useState(null)

	const handleClick = (size, index) => {
		return () => {
			setListIndex(index)
			getsize(size)
		}
	}

	return (
		<div className={classes.sizes}>
			<h3>Available Sizes: </h3>
			<ul>
				{product.sizes?.map(({ size }, index) => {
					let style = classes.list

					if (index === listIndex) {
						style = style + ' ' + classes.clickedStyle
					}

					return (
						<li key={size + index} onClick={handleClick(size, index)} className={style}>
							{size}
						</li>
					)
				})}
			</ul>
		</div>
	)
}

export default Sizes
