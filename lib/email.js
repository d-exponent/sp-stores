import nodemailer from 'nodemailer'
import htmlToText from 'html-to-text'

import { isProductionEnv } from './controller-utils'

const environment = process.env
class Email {
  constructor(user, url) {
    this.userName = `${user.firstName} ${user.lastName} `
    this.to = user.email
    this.from = environment.APP_EMAIL_ADDRESS
    this.url = url
  }

  mailTransport() {
    const devTransportConfig = {
      host: environment.MAILTRAP_HOST,
      port: +environment.MAILTRAP_PORT,
      auth: {
        user: environment.MAILTRAP_USER,
        pass: environment.MAILTRAP_PASSWORD,
      },
    }

    const prodTransportConfig = {
      host: environment.APP_HOST,
      port: +environment.APP_PORT,
      secureConnection: false,
      tls: {
        ciphers: 'SSLv3',
      },
      auth: {
        user: environment.APP_EMAIL,
        pass: environment.APP_PASSWORD,
      },
    }

    const transportConfig = isProductionEnv()
      ? prodTransportConfig
      : devTransportConfig

    return nodemailer.createTransport(transportConfig)
  }


  async sender({ subject, html }) {
    const transporter = this.mailTransport()
    const htmlToTextFmt = htmlToText.convert(html, { wordwrap: 130 })

    const senderConfiq = {
      from: this.from,
      to: this.to,
      subject,
      html: html,
      text: htmlToTextFmt,
    }
    
    await transporter.sendMail(senderConfiq)
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
