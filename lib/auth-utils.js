/**
 *
 * @param {{body: object, method: string, url:string}} config
 * @returns {{response: object, serverRes: object}}
 * Makes a network request to the url specified and returns the fecth and server response objects
 */

export async function withFetch(config) {
	const { url, data, method } = config

	const response = await fetch(url, {
		body: JSON.stringify(data),
		method: method,
		headers: { 'Content-Type': 'application/json' },
	})

	const serverRes = await response.json()

	return { response, serverRes }
}

/**
 *
 * @param {string} errorMessage Error message to be displayed for operational errors
 * @param {string} genericMessage A generic error message for non-operational errors
 * @returns {string} Error message
 */
export const getLoginErrorMessage = (errorMessage, genericMessage) => {
	const operationalErrors = [
		'Incorrect password. Forgot password?',
		'Incorrect email address. Please confirm the email address or register a new account',
		'Please provide your password',
		'Please provide your email address',
	]

	if (errorMessage === 'Error connecting to database') {
		return 'Network Error! Please check your internet connection and try again'
	}

	if (operationalErrors.includes(errorMessage)) {
		return errorMessage
	}

	return genericMessage
}

/**
 *
 * @param {function} func SignIn function from NextAuth
 * @param {{email: string, password: string}} credentials An object containing the user's email and password
 * @param {string} genericMsg Generic error message to be displayed if a non-operational error is encountered
 * Signs a user in or throw an error if provided with invalid credentials
 */

export async function handleSignIn(func, credentials, genericMsg) {
	const { email, password } = credentials

	const { error } = await func('credentials', {
		redirect: false,
		email: email,
		password: password,
	})

	// Handle signIn errors
	if (error) {
		const message = getLoginErrorMessage(error, genericMsg)
		throw new Error(message)
	}
}
