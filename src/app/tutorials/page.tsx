import BreadCrumbs from '@/components/Breadcrumbs/BreadCrumbs'
import Link from 'next/link'
import { Metadata } from 'next'
import useTutorials from '@/hooks/useTutorials'
import { TutorialType } from '@/types/content'
import TutorialCard from '@/components/Cards/Tutorial'

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: `Tutorials & Guides - Movement Network`,
        description: 'Tutorials for building on the Movement Network',
    }
}

export default function TutorialsLandingPage() {
    const TutorialsData = useTutorials()
    const featuredTutorialObject: TutorialType = Object.fromEntries(
        Object.entries(TutorialsData).filter(([key, value]) => value.featured === true)
    ) || null
    const featuredTutorial = featuredTutorialObject ? Object.values(featuredTutorialObject) : null

    return (
        <div id="learning-paths-inner-wrap" className="subpage-wrap">
            <div className="contain">
                <BreadCrumbs contain={false}>
                    <Link href="/tutorials">Tutorials</Link>
                </BreadCrumbs>

                {featuredTutorial && (
                    <div className="page-intro">
                        <span className="subtitle body-12">Featured Tutorial</span>
                        <h1 className="title">{featuredTutorial[0].title}</h1>
                        <p className="body-24">{featuredTutorial[0].description}</p>
                        <Link href={featuredTutorial[0].link || ""} target="_blank" className="btn">
                            Start
                        </Link>
                    </div>
                )}

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
