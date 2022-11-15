/**
 * 
 * @param {object} a JavaScript object to be converted to a pure Object 
 * @returns {object} a pure JavaScript object

 */
export const purify = (obj) => JSON.parse(JSON.stringify(obj))

/**
 *
 * @param {number} number Value to be converted to a currency
 * @returns {string} String representation of a number in currency format
 *
 */
export const formatToCurrency = (number) => {
	return new Intl.NumberFormat('en-us').format(number)
}

/**
 *
 * @param {Object} product an abject containing the products price properties
 * @returns {string} a string representation of the the products price in currency format
 */
export const getProductPrice = (product) => {
	const { discountPriceAsCurrency, priceAsCurrency, discountPrice, price } = product

	if (
		discountPriceAsCurrency &&
		discountPriceAsCurrency !== '' &&
		discountPriceAsCurrency !== '0'
	) {
		return discountPriceAsCurrency
	}

	if (discountPrice) {
		return formatToCurrency(discountPrice)
	}

	if (priceAsCurrency && priceAsCurrency !== '' && priceAsCurrency !== '0') {
		return priceAsCurrency
	}

	return formatToCurrency(price)
}

/**
 *
 * @param {string} email Email address to be validated
 * @returns {boolean} true if email is valid or false if it's not
 */
export const isValidEmail = (email) => {
	const rfc5322StandardEmailRegex =
		/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g

	return rfc5322StandardEmailRegex.test(email)
}

/**
 * @param {string} env Node environment the function will run console logging
 * @param {string} message Message to be logged to the console
 */
export const logByEnviroment = (env, message) => {
	if (!env) {
		return console.log(message)
	}

	process.env.NODE_ENV === env && console.log(message)
}
