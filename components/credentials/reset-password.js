import { useRef, useContext } from 'react'
import { useRouter } from 'next/router'

import Input from '../ui/input'
import Button from '../ui/button'
import NotificationContext from '../../context/notification'
import { withFetch } from '../../lib/auth-utils'
import classes from './reset-password.module.css'

const missingAuthMessage =
  'MISSING AUTHENTICATION. Please check your email and click the link to reset your password'

export default function ResetPassword() {
  const router = useRouter()

  const { showNotification } = useContext(NotificationContext)

  const newPasswordRef = useRef(null)
  const passwordConfirmRef = useRef(null)

  const handleSubmit = async function (event) {
    event.preventDefault()

    const resetTokenInUrl = router.query?.token

    if (!resetTokenInUrl) {
      return showNotification(missingAuthMessage).error()
    }

    showNotification('Resetting Password...').pending()

    const enteredNewPassword = newPasswordRef.current.value
    const enteredPasswordConfirm = passwordConfirmRef.current.value

    const resetData = {
      newPassword: enteredNewPassword,
      confirmPassword: enteredPasswordConfirm,
      resetToken: router.query.token,
    }

    const [resPromise] = withFetch({
      url: '/api/auth/users/reset-password',
      method: 'PATCH',
      data: resetData,
    })

    try {
      const res = await resPromise

      if (!res.success) {
        const errorMessage = res.message || 'error updating your password.'
        throw new Error(errorMessage)
      }

      setTimeout(() => {
        showNotification('Login into your account').success()
        router.replace('/auth/users')
      }, 1000)

      showNotification('Password reset successfully').success()

      newPasswordRef.current.value = ''
      passwordConfirmRef.current.value = ''
    } catch (error) {
      showNotification(error.message).error()
    }
  }

  return (
    <section className={classes.container}>
      <form onSubmit={handleSubmit}>
        <Input
          type="password"
          label="Password"
          required={true}
          name="new-password"
          reference={newPasswordRef}
          placeholder="New password"
        />

        <Input
          type="password"
          label="Verify Password"
          required={true}
          name="confirm-password"
          reference={passwordConfirmRef}
          placeholder="Confirm password"
        />

        <Button text="Reset" />
      </form>
    </section>
  )
}
