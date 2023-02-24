import Link from 'next/link'
import classes from './css-modules/empty-items-wrapper.module.css'

export default function EmptyItems() {
  return (
    <div className={`${classes.empty} grid-center`}>
      <h2>Your cart is Empty</h2>
      <Link href="/products">Go to store</Link>
    </div>
  )
}
