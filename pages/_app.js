import Head from 'next/head'
import { SessionProvider } from 'next-auth/react'

import { NotificationContextProvider } from '../context/notification'
import Layout from '../components/layout/layout'
import '../styles/globals.css'

export default function MyApp({ Component, pageProps: { session, ...pageProps } }) {
	return (
		<SessionProvider session={session}>
			<NotificationContextProvider>
				<Layout>
					<Head>
						<meta charSet='UTF-8' />
						<meta httpEquiv='X-UA-Compatible' content='IE=edge' />
						<meta
							name='viewport'
							content='width=device-width, initial-scale=1.0, maximum-scale=1.0'
						/>
						<meta httpEquiv='Content-Type' content='text/html; charset=utf-8' />
						<title>Sarah P Collections</title>
						<meta
							name='description'
							content='Sarah P Collections | We sell high quality | affordable clothing and accessories for males and females '
						/>
						<link rel='icon' href='/favicon.ico' />
					</Head>
					<Component {...pageProps} />
				</Layout>
			</NotificationContextProvider>
		</SessionProvider>
	)
}

 
