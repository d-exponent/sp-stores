class Notification {
  constructor(message, func) {
    this.message = message
    this.handler = func
  }

  pending() {
    this.handler({
      status: 'pending',
      message: this.message,
    })
  }

  success() {
    this.handler({
      status: 'success',
      message: this.message,
    })
  }

  error() {
    this.handler({
      status: 'error',
      message: this.message,
    })
  }

  hide() {
    this.handler(null)
  }
}

export default Notification
