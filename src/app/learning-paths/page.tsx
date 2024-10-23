import HeroSlider from '@/components/Slider/HeroSlider'
import { getSubCategories } from '@/lib/posts'
import Link from 'next/link'

export default function LearningPathLandingPage() {

    // get categories by slug
    const categories = getSubCategories('learning-paths')
    
    return (
        <>
        <HeroSlider>
            <div className="slide">
                <div className="col-lt">
                    <picture>
                        <img src="/images/nft-drop.jpg" alt="" style={{ mixBlendMode: 'lighten' }} />
                    </picture>
                </div>
                <div className="col-rt">
                    <div className="inner">
                        <span className="subtitle">Learn to Build</span>
                        <h1 className="title">NFT Drop</h1>
                        <p>
                            Write your first smart contract and run it in your browser without any knowledge about
                            Ethereum or blockchains.
                        </p>
                        <a href="#" className="btn btn-yellow">
                            Guide
                        </a>
                        <a href="#" className="btn btn-yellow">
                            Demo
                        </a>
                    </div>
                </div>
            </div>
        </HeroSlider>

        <section className="contain learning-paths">
            {
                categories.map((category, index) => {
                    return (
                        <div className="path-link" key={index}>
                            <Link href={category.link} className="learning-content">
                                <h2>{category.name}</h2>
                                <p></p>
                            </Link>
                        </div>
                    )
                })
            }
        </section>
        </>
    )
}
