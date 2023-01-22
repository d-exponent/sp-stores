import classes from './hero.module.css'

export default function Hero() {
	return (
		<div className={`${classes.hero} grid`}>
			<h1 className={classes.title}>SP-Collections</h1>
			<span className={classes.subTitle}>we swag different!😎</span>
		</div>
	)
}
