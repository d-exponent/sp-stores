import Image from 'next/image'

import styles from 'react-responsive-carousel/lib/styles/carousel.min.css'
import 'react-responsive-carousel/lib/styles/carousel.min.css' // requires a loader
import { Carousel as Slider } from 'react-responsive-carousel'
import classes from './carousel.module.css'

export default function Carousel(props) {
	// TODO: Uptimimize Carousel Component
	return (
		<Slider
			autoPlay
			useKeyboardArrows={true}
			interval={props.interval}
			emulateTouch={true}
			infiniteLoop={true}
			renderThumbs={() => {
				if (!props.showThumbs) {
					return
				}
				return props.images.map((image, index) => (
					<div key={index}>
						<Image
							src={image.src}
							alt={image.alt}
							width={900}
							height={600}
							layout='responsive'
							priority={index === 0}
						/>
					</div>
				))
			}}
		>
			{props.images.map((image, index) => (
				<div key={image.alt}>
					<Image
						src={image.src}
						alt={image.alt}
						width={900}
						height={600}
						layout='responsive'
						priority={index === 0}
					/>
				</div>
			))}
		</Slider>
	)
}
