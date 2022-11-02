import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
	render() {
		return (
			<Html>
				<Head lang='en' />
				<body>
					<div id='side-nav'></div>
					<Main />
					<NextScript />
					<div id='notifications'></div>
				</body>
			</Html>
		)
	}
}

export default MyDocument
