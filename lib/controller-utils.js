import bcrypt from 'bcryptjs'
import crypto from 'crypto'

/**
 *
 * @param {object*} res NodeJs response object
 * @param {number} status The http status code to be sent in the resposne header
 * @param {object} messageObj Object to be sent as json a response
 *
 * Send the response from the server to the client
 */
export const sendResponse = (res, status, messageObj) => {
  res.status(status).json(messageObj || {})
}

export const sendMethodNotAllowedResponse = (res, method) => {
  sendResponse(res, 400, {
    success: false,
    message: `${method} method is not allowed on this route`,
  })
}

/**
 *
 * @param {string} text a string to be hashed
 * @returns {string} a hashed string
 */
export const bcryptHash = async text => {
  return await bcrypt.hash(text, 12)
}

/**
 *
 * @param {string} plainPassword  String to be compared to a hash
 * @param {string} hashedPassword A hashed string to be compared against
 * @returns {boolean} true if the plainPassword is a match for the hashedPassword, flase otherwise
 */
export const bcryptCompare = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword)
}

/**
 *
 * @param {string} str String to be hashed
 * @returns {string} a hashed string
 */
export const cryptoHash = str => {
  return crypto.createHash('sha256').update(str).digest('hex')
}

/**
 *
 * @param {string} bytes
 * @returns
 */
export const cryptoToken = bytes => {
  return crypto.randomBytes(bytes).toString('hex')
}

/**
 *
 * @returns {string} http or https depending on the node enviroment
 */
export const getProtocol = () => {
  const isProduction = process.env.NODE_ENV === 'production'

  return isProduction ? 'https' : 'http'
}

export const getHost = req => req.headers.host

/**
 * @param {object}
 * @return {string} base URL of the	request
 */
export const getBaseUrl = req => {
  const protocol = getProtocol()
  const host = getHost(req)

  return `${protocol}://${host}`
}

export const redirectToPage = (page = '/') => {
  const redirectConfig = {
    redirect: {
      destination: page,
    },
  }
  return redirectConfig
}

export const isProductionEnv = () => process.env.NODE_ENV === 'production'
