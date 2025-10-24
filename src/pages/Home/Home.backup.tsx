import Scroller from '@/components/Marquee/Scroller'
import HeroSlider from '@/components/Slider/HeroSlider'
import useLearningPaths from '@/hooks/useLearningPaths'
import { PostData } from '@/types/posts'
import Link from 'next/link'
import useDeveloperTools from '@/hooks/useDeveloperTools'
import ToolsCard from '@/components/Cards/Tools'
import TutorialCard from '@/components/Cards/Tutorial'
import LearningPathCard from '@/components/Cards/LearningPath'
import Carousel from '@/components/Slider/Carousel'
import useTutorials from '@/hooks/useTutorials'
import HomeHeroImage from '../../../public/images/home-hero.webp'
import Image from 'next/image'

export default function Home(props: { postData: PostData[] }) {
    const allPostsData = props.postData
    const LearningPathsData = useLearningPaths()
    const DeveloperToolsData = useDeveloperTools()
    const TutorialData = useTutorials()
    
    return (
        <div className="md:mt-40">
            <HeroSlider>
                <div className="slide">
                    <div className="col-lt">
                        <picture>
                            <Image src={HomeHeroImage} alt="" style={{ mixBlendMode: 'lighten' }} />
                        </picture>
                    </div>
                    <div className="col-rt">
                        <div className="inner">
                            <span className="subtitle">Learning Paths</span>
                            <h1 className="title">Basic Concepts</h1>
                            <p>Learn the core syntax, data structures, and fundamental concepts of the Move Language.</p>
                            <a href="/learning-paths/basic-concepts" className="btn btn-yellow">Get Started</a>
                        </div>
                    </div>
                </div>
            </HeroSlider>

            <section className="contain learning-paths">
                <div className="section-head">
                    <h3>Movement Learning Paths</h3>
                    <Link href="/learning-paths" className="btn btn-12">
                        View All
                    </Link>
                </div>
                <div className="path-link">
                    <div className="video-bg">
                        <video autoPlay loop muted playsInline preload="meta">
                            <source src="/videos/learning-paths-bg.mp4" type="video/mp4" />
                        </video>
                    </div>
                    <div className="path-content">
                        <div className="path-grid">
                            {Object.keys(LearningPathsData).map((key) => (
                                <LearningPathCard key={key} cardKey={key} data={LearningPathsData[key]} />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="contain guides">
                <div className="section-head">
                    <h3>Tutorials & Guides</h3>
                    <Link href="/tutorials" className="btn btn-12">
                        View All
                    </Link>
                </div>
                <div className="guides-grid">
                    {Object.keys(TutorialData).slice(0, 4).map((key) => (
                        <TutorialCard key={key} data={TutorialData[key]} />
                    ))}
                </div>
            </section>

            <section className="contain dev-tools">
                <div className="section-head">
                    <h3>Developer Tools</h3>
                    <Link href="/dev-tools" className="btn btn-12">
                        View All
                    </Link>
                </div>
                <Carousel>
                    {Object.keys(DeveloperToolsData).map((key) => (
                        <ToolsCard key={key} data={DeveloperToolsData[key]} />
                    ))}
                </Carousel>
            </section>

            <Scroller />
        </div>
    )
}
