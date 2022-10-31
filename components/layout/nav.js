import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { useContext, useState, useEffect } from 'react'

import ShoppingItemsContext from '../../context/shopping-bag'
import LogoutButton from '../ui/logout-button'
import { HiOutlineShoppingBag } from 'react-icons/hi'
import classes from './nav.module.css'

const Nav = () => {
	const [isLoggedin, setIsLoggedin] = useState(false)
	const [itemsCount, setItemsCount] = useState('')

	const router = useRouter()
	const session = useSession()

	const { items } = useContext(ShoppingItemsContext)

	useEffect(() => {
		if (session.status === 'authenticated') {
			return setIsLoggedin(true)
		}
		//Else
		setIsLoggedin(false)
	}, [session.status])

	useEffect(() => {
		setItemsCount(`${items.length}`)
	}, [items])

	let bagLogoClasses = classes.navLogo

	if (itemsCount > 0) {
		bagLogoClasses = `${classes.navLogo} ${classes.bagIcon}`
	}

	function handlePushToAuthPage() {
		let callbackPath = router.asPath

		if (router.query.callback) {
			const paths = router.query.callback.split('=')
			callbackPath = paths[paths.length - 1]
		}

		router.push(`/auth/users?callback=${callbackPath}`)
	}

	return (
		<nav className={classes.nav}>
			{isLoggedin ? (
				<div className={classes.navLink}>
					<LogoutButton />
				</div>
			) : null}

			{!isLoggedin ? (
				<div onClick={handlePushToAuthPage} className={classes.navLink}>
					<a>
						<span>Login</span>
						<span>\Register</span>
					</a>
				</div>
			) : null}

			<Link href={'/shopping-bag'}>
				<a className={classes.navLink}>
					<span className={bagLogoClasses} data-items-count={itemsCount}>
						<HiOutlineShoppingBag />
					</span>
				</a>
			</Link>
		</nav>
	)
}

export default Nav
