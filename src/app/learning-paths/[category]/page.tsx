
import HeroSlider from '@/components/Slider/HeroSlider'
import { getAllPostsData, getPostData, getSubCategories } from '@/lib/posts'
import Link from 'next/link'
import { Metadata } from 'next'
import Article from '@/pages/Tutorials/Article'

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

// export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
//     const id = params.category
//     const postData = await getPostData(id)

//     if (!postData) {
//         return {}
//     }

//     return {
//         title: `${decodeURIComponent(postData.title || "")} - Movement Network`,
//         description: postData.description || '',
//     }
// }

export default async function LearningPathLandingPage({ params }: PostPageProps) {
    const { category: pageCategory } = params

    if (!pageCategory) {
        return;
    }
    
    const categories = getSubCategories('learning-paths', pageCategory[0])
    
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

        <section className="contain learning-paths grid grid-cols-4 gap-4">
            {
                categories.map((category, index) => {
                    return (
                        <div className="path-link" key={index}>
                            <Link href={`/learning-paths/${pageCategory}/${category.link}`} prefetch={false} className="learning-content">
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
