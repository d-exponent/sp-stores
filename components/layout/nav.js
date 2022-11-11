import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { useContext, useState, useEffect } from 'react'

import ShoppingItemsContext from '../../context/shopping-bag'
import LogoutButton from '../ui/logout-button'
import Button from '../ui/button'
import { HiOutlineShoppingBag } from 'react-icons/hi'
import classes from './nav.module.css'

const Nav = () => {
	const [itemsCount, setItemsCount] = useState('')
	const { items } = useContext(ShoppingItemsContext)

	const router = useRouter()
	const { status: authStatus } = useSession()

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
			<Link href={'/shopping-bag'}>
				<a className={classes.navLink}>
					<div className={bagLogoClasses} data-items-count={itemsCount}>
						<HiOutlineShoppingBag />
					</div>
				</a>
			</Link>

			{authStatus === 'authenticated' ? (
				<Link href={'/account'} className={classes.navLink}>
					<a>
						<span className={classes.profile}>Account</span>
					</a>
				</Link>
			) : null}
			{authStatus === 'authenticated' ? (
				<div className={`${classes.navLink} ${classes.logoutBtn}`}>
					<LogoutButton />
				</div>
			) : null}

			{authStatus !== 'authenticated' && authStatus !== 'loading' ? (
				<div
					onClick={handlePushToAuthPage}
					className={`${classes.navLink} ${classes.loginBtn}`}
				>
					<p>
						<Button text='Login/Signup' />
					</p>
				</div>
			) : null}
		</nav>
	)
}

export default Nav
