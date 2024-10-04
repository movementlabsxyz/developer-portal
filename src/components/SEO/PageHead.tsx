import Head from 'next/head'

const SEO = (
    { pageTitle, pageDescription }: { pageTitle: string; pageDescription: string }
) => (
    <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
    </Head>
)

export default SEO
