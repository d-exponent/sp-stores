function removePaystackRef(func) {
	return async function (context) {
		/**
		 * Paystack always returns reference and trxref query parameters to our callback URL.
		 * The value of the reference can be used to create new orders in db
		 * This implemetation is to prevent the broswer from receiving the reference
		 * as we handle database operations in webhooks checkout handler
		 */

		const trxrefReg = /trxref/
		const referenceReg = /reference/

		if (trxrefReg.test(context.req.url) && referenceReg.test(context.req.url)) {
			// To be sure its paystack use (&&)
			return {
				redirect: {
					destination: '/',
				},
			}
		}

		return func(context)
	}
}

export default removePaystackRef

