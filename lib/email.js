import nodemailer from 'nodemailer'
import htmlToText from 'html-to-text'
import { getHttpProtocol, getHost } from './controller-utils'

class Email {
	constructor(user, url) {
		this.userName = `${user.firstName} ${user.lastName} `
		this.to = user.email
		this.from = process.env.APP_EMAIL_ADDRESS
		this.url = url
	}

	mailTransport() {
		let transporter
		if (process.env.NODE_ENV !== 'production') {
			transporter = nodemailer.createTransport({
				host: process.env.MAILTRAP_HOST,
				port: +process.env.MAILTRAP_PORT,
				auth: {
					user: process.env.MAILTRAP_USER,
					pass: process.env.MAILTRAP_PASSWORD,
				},
			})
		}


		return transporter
	}

	async sender(subject, html) {
		const transporter = this.mailTransport()
		const htmlToTextFmt = htmlToText.convert(html, { wordwrap: 130 })

		await transporter.sendMail({
			from: this.from,
			to: this.to,
			subject,
			html: html,
			text: htmlToTextFmt,
		})
	}

	async welcomeEmail() {
		await this.sender(
			'Welcome to SP-collections!',
			`<div><h1>Thank you for Chritie small Madam</h1><a href=${this.url}>Click to continue</a></div>`
		)
	}
}

export default Email
