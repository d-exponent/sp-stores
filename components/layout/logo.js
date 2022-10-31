
import Link from 'next/link'
import classes from './logo.module.css'

const Logo = () => {


	return (
		<div className={classes.headerLogo}>
			<Link href='/'>
				<h1>SP Collections</h1>
			</Link>
		</div>
	)
}

export default Logo
