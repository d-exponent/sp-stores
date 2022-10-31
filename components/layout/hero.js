import styles from './hero.module.css'

const Hero = () => {
	return (
		<div className={styles.hero}>
			<h1 className={styles.heroTitle}>
				<span className={styles.heroTitleMain}>SP-Collections</span>
				<span className={styles.heroTitleSub}>we swag different!😎</span>
			</h1>
		</div>
	)
}

export default Hero
