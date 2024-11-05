import Scroller from '@/components/Marquee/Scroller'
import HeroSlider from '@/components/Slider/HeroSlider'
import useLearningPaths from '@/hooks/useLearningPaths'
import { getSubCategories } from '@/lib/posts'
import { PostData } from '@/types/posts'
import Link from 'next/link'
import useDeveloperTools from '@/hooks/useDeveloperTools'
import ToolsCard from '@/components/Cards/Tools'
import TutorialCard from '@/components/Cards/Tutorial'
import LearningPathCard from '@/components/Cards/LearningPath'
// import lottiebkg from '../../../public/json/home-circles.json'
// import LottiePlayer from '@/components/Lottie/Player'
import Carousel from '@/components/Slider/Carousel'
import useTutorials from '@/hooks/useTutorials'

export default function Home(props: { postData: PostData[] }) {
    const allPostsData = props.postData
    const categories = getSubCategories('learning-paths')
    const LearningPathsData = useLearningPaths()
    const DeveloperToolsData = useDeveloperTools()
    const TutorialData = useTutorials()
    return (
        <div className="md:mt-40">
            <HeroSlider>
            <div className="slide">
                <div className="col-lt">
                    <picture>
                    <img src="/images/nft-drop.jpg" alt="" style={{ mixBlendMode: 'lighten' }} />
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
                            <source type="video/mp4" src="/video/video-bg-2.mp4" />
                        </video>
                    </div>
                    <Link href="/learning-paths" className="learning-content">
                        <h4>Jump in and start learning</h4>
                        <p>
                            A curated list of resources for developers in specific verticals to learn how to build on
                            movement
                        </p>
                        <span className="ul-link body-12">View All Paths</span>
                    </Link>
                </div>
            </section>

            <section className="contain path-cards">
                <div className="grid grid-3-column">
                    {Object.keys(LearningPathsData).map((key) => (
                        <LearningPathCard cardKey={key} data={LearningPathsData[key]} key={key} />
                    ))}
                </div>
            </section>

            <section className="contain guides">
                <div className="section-head">
                    <h3>Guides and Tutorials</h3>
                    <Link href="/tutorials" className="btn btn-12">
                        View All
                    </Link>
                    <div className="slick-arrows section-arrows">
                    </div>
                </div>
                <div className="guides-grid">
                    <Carousel>
                        {Object.keys(TutorialData).map((key) => (
                            <TutorialCard key={key} data={TutorialData[key]} />
                        ))}
                    </Carousel>
                </div>
            </section>

            <section className="contain dev-tools">
                <div className="section-head">
                    <h3>Developer Tools</h3>
                    <Link href="/developer-tools" className="btn btn-12">
                        View All
                    </Link>
                    <div className="slick-arrows section-arrows"></div>
                </div>
                <div className="guides-grid">
                    <Carousel>
                        {Object.keys(DeveloperToolsData).map((key) => (
                            <ToolsCard key={key} data={DeveloperToolsData[key]} />
                        ))}
                    </Carousel>
                </div>
            </section>
        </div>
    )
}
