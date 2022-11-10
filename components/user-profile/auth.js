import Link from 'next/link'

import classes from './auth.module.css'

const Auth = (props) => {
	return (
		<div>
			<h2>{props.title}</h2>
			<p>{props.text}</p>
			<Link href={props.href}>
				<a className={classes.link}>
					<span>{'->'}</span>
					<p>{props.linkText}</p>
				</a>
			</Link>
		</div>
	)
}

export default Auth
