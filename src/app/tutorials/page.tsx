import Link from 'next/link'
import { Metadata } from 'next'
import BreadCrumbs from '@/components/Breadcrumbs/BreadCrumbs'
import useTutorials from '@/hooks/useTutorials'
import TutorialCard from '@/components/Cards/Tutorial'

interface PostPageProps {
    params: {
        category: string[]
    }
}

// export async function generateStaticParams() {
//     const posts = getAllPostsData()
//     return posts.map((post) => ({
//         slug: post.filePath.replace('.md', '').split('/'),
//     }))
// }


export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {

    return {
        title: `Tutorials & Guides - Movement Network`,
        description: 'Tutorials for building on the Movement Network',
    }
}

export default function TutorialsLandingPage() {
    const TutorialsData = useTutorials()
    return (
        <div id="learning-paths-inner-wrap" className="subpage-wrap">
            <div className="contain">
                <BreadCrumbs contain={false}>
                    <Link href="/tutorials">Tutorials</Link>
                </BreadCrumbs>

                <div className="page-intro">
                    <span className="subtitle body-12">Featured Tutorials</span>
                    <h1 className="title">DeFi</h1>
                    <p className="body-24">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                    </p>
                    <Link href={`#`} className="btn">
                        Start
                    </Link>
                </div>

                <section className="guides">
                    <div className="flex flex-col gap-10 mt-40">
                        <div className="grid grid-4-column guides-grid">

                        {Object.keys(TutorialsData).map((key) => (
                            <TutorialCard key={key} data={TutorialsData[key]} />
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}
