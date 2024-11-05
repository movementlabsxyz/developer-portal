import type { Metadata } from 'next'
import './globals.css'
import '@/sass/movement.scss'
import localFont from 'next/font/local'
import { cn } from '@/lib/utils'
import GTM from '@/components/GTM/GTM'
import NavHeader from '@/components/Header/Nav'
import Footer from '@/components/Footer/Footer'
// import WeGlot from '@/components/Translation/weGlot'

const twkEverett = localFont({
    src: [
        {
            path: '../../public/fonts/twkeverett/TWKEverett-Ultralight.otf',
            weight: '200',
            style: 'normal',
        },
        {
            path: '../../public/fonts/twkeverett/TWKEverett-Light.otf',
            weight: '300',
            style: 'normal',
        },
        {
            path: '../../public/fonts/twkeverett/TWKEverett-Regular.otf',
            weight: '400',
            style: 'normal',
        },
        {
            path: '../../public/fonts/twkeverett/TWKEverett-Medium.otf',
            weight: '500',
            style: 'normal',
        },
        {
            path: '../../public/fonts/twkeverett/TWKEverett-Bold.otf',
            weight: '700',
            style: 'normal',
        },
        {
            path: '../../public/fonts/twkeverett/TWKEverett-BlackItalic.otf',
            weight: '700',
            style: 'italic',
        },
        {
            path: '../../public/fonts/twkeverett/TWKEverett-Black.otf',
            weight: '900',
            style: 'normal',
        },
    ],
    variable: '--ff_1',
})

const twkEverettMono = localFont({
    src: [
        {
            path: '../../public/fonts/twk-everett-mono/TWKEverettMono-Regular.ttf',
            weight: '400',
        },
        {
            path: '../../public/fonts/TWKEverettMono-Medium.ttf',
            weight: '500',
        },
    ],
    variable: '--ff_2',
})

export const metadata: Metadata = {
    title: 'Movement Network Developer Portal',
    description: 'Helpful resources and tutorials for building on the Movement Network.',
    metadataBase: new URL('https://developer.movementnetwork.xyz'),
    openGraph: {
        locale: 'en_US',
        siteName: 'The Movement Network Developer Portal',
    },
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <head>
                <link rel="stylesheet" href="https://use.typekit.net/ntd7efg.css" />
            </head>
            <body className={cn(twkEverett.variable, twkEverettMono.variable)}>
                <NavHeader />
                <main>{children}</main>
                <Footer />
                <GTM />
                {/* <WeGlot /> */}
            </body>
        </html>
    )
}
