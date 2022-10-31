class Notification {
	constructor(message) {
		this.message = message
	}

	pending() {
		return {
			status: 'pending',
			message: this.message,
		}
	}

	success() {
		return {
			status: 'success',
			message: this.message,
		}
	}
	error() {
		return {
			status: 'error',
			message: this.message,
		}
	}
}

export default Notification