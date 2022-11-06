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

export async function handleSignIn(func, credentials, genericMsg) {
	const result = await func('credentials', {
		redirect: false,
		email: credentials.email,
		password: credentials.password,
	})

	// Handle signIn errors
	if (result.error) {
		const message = getLoginErrorMessage(result.error, genericMsg)
		throw new Error(message)
	}
}
