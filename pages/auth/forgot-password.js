import { unstable_getServerSession } from 'next-auth/next'

import ForgotPassword from '../../components/credentials/forgot-password'
import { redirectToPage } from '../../lib/controller-utils'
import { nextAuthConfig } from '../api/auth/[...nextauth]'

const ForgotPasswordPage = () => <ForgotPassword />

export async function getServerSideProps(context) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    nextAuthConfig
  )

  if (session) return redirectToPage('/auth/users')

  // getServerSideProps must return an object.
  return {
    props: { auth: 'dummy-prop' },
  }
}

export default ForgotPasswordPage
