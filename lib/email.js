import nodemailer from 'nodemailer'
import htmlToText from 'html-to-text'

class Email {
  constructor(user, url) {
    this.userName = `${user.firstName} ${user.lastName} `
    this.to = user.email
    this.from = process.env.APP_EMAIL_ADDRESS
    this.url = url
  }

  mailTransport() {
    const devTransportConfig = {
      host: process.env.MAILTRAP_HOST,
      port: +process.env.MAILTRAP_PORT,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    }

    //TODO: Setup the transport configuration for Production environment

    return nodemailer.createTransport(devTransportConfig)
  }

  async sender(config) {
    const { subject, html } = config
    const transporter = this.mailTransport()
    const htmlToTextFmt = htmlToText.convert(html, { wordwrap: 130 })

    //TODO: Handle errors
    await transporter.sendMail({
      from: this.from,
      to: this.to,
      subject,
      html: html,
      text: htmlToTextFmt,
    })
  }

  //TODO: Setup email templates
  async sendWelcome() {
    await this.sender({
      subject: 'Welcome to SP-collections!',
      html: `<div><h1>Thank your for joining us</h1><a href=${this.url}>Click to continue</a></div>`,
    })
  }

  async sendPasswordResetLink() {
    await this.sender({
      subject: 'Reset Password',
      html: `<div><h1>Click the link to reset your password. It expires in 5 minutes.</h1><a href=${this.url}>Click to continue</a></div>`,
    })
  }
}

export default Email
