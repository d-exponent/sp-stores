import classes from './sizes.module.css'

export default function Sizes(props) {
	const { sizes, getsize, selectedSizeIndexInSizes, setSelectedSizeIndexInSizes } = props

	const handleClick = function (size, quantity, index) {
		return function () {
			setSelectedSizeIndexInSizes(index)
			getsize(size, quantity)
		}
	}

	return (
		<div className={classes.sizes}>
			<h3>Available Sizes: </h3>
			{sizes ? (
				<ul>
					{sizes.map(({ size, quantity }, index) => {
						let style = classes.list

						if (index === selectedSizeIndexInSizes) {
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
			) : null}
		</div>
	)
}
