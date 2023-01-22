import Link from 'next/link'

export default function Auth (props)  {
	return (
		<div>
			<h2>{props.title}</h2>
			<p>{props.text}</p>
			<Link href={props.href}>
				<a>
					<span>{'->'}</span>
					<p>{props.linkText}</p>
				</a>
			</Link>
		</div>
	)
}

 
