import { unstable_getServerSession } from 'next-auth'
import { nextAuthConfig } from '../pages/api/auth/[...nextauth]'
import { AppError } from './app-error'

const getServerSession = async (request, response) => {
  let serverSession

  try {
    serverSession = await unstable_getServerSession(
      request,
      response,
      nextAuthConfig
    )
  } catch (err) {
    await AppError.saveServerErrorToDatabase(err)
    serverSession = null
  }
  return serverSession
}

export default getServerSession
