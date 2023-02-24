import Link from 'next/link'
import { useRef, useContext } from 'react'

import Input from '../ui/input'
import Button from '../ui/button'
import NotificationContext from '../../context/notification'
import { withFetch } from '../../lib/auth-utils'

import classes from './forgot-passoword.module.css'

const SUCCESS_MESSAGE = `A password reset link has been sent to your email address. Click on the link to reset your password`

export default function ForgotPassword() {
  const emailInputRef = useRef()

  const { showNotification } = useContext(NotificationContext)

  const handleSubmit = async function (event) {
    event.preventDefault()

    showNotification('Processing..').pending()

    const enteredEmail = emailInputRef.current.value

    const [resPromise] = withFetch({
      method: 'PATCH',
      url: `/api/auth/users/forgot-password`,
      data: { email: enteredEmail },
    })

    try {
      const res = await resPromise

      if (!res.success) {
        const errorMessage =
          'Error resetting your password. Please try again!'
        throw new Error(res.message || errorMessage)
      }

      showNotification(SUCCESS_MESSAGE).success()

      emailInputRef.current.value = ''
    } catch (error) {
      showNotification(error.message).error()
    }
  }

  return (
    <section className={`${classes.container} grid`}>
      <form onSubmit={handleSubmit}>
        <Input
          type="email"
          required={true}
          label="Enter your email"
          name="email"
          reference={emailInputRef}
          placeholder="youremail@email.com"
        />
        <Button text="Get Reset link" />
      </form>
      <div href="">
        <span>Back to </span>
        <Link href="/auth/users">Login</Link>
      </div>
    </section>
  )
}
