import { useState } from 'react'
import classes from './sizes.module.css'

const Sizes = ({ sizes, getsize }) => {
	const [listIndex, setListIndex] = useState(null)
	const [] = useState(0)

	const handleClick = (size, quantity, index) => {
		return () => {
			setListIndex(index)
			getsize(size, quantity)
		}
	}
	

	return (
		<div className={classes.sizes}>
			<h3>Available Sizes: </h3>
			<ul>
				{sizes.map(({ size, quantity }, index) => {
					let style = classes.list

					if (index === listIndex) {
						style = style + ' ' + classes.clickedStyle
					}

					return (
						<li
							key={size + index}
							onClick={handleClick(size, quantity, index)}
							className={style}
						>
							{size}
						</li>
					)
				})}
			</ul>
		</div>
	)
}

export default Sizes
