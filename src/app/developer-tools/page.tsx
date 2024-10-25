import HeroSlider from '@/components/Slider/HeroSlider'
import { getAllPostsData, getCategoryBySlug, getPostData, getSubCategories } from '@/lib/posts'
import Link from 'next/link'
import { Metadata } from 'next'
import Article from '@/pages/Tutorials/Article'
import BreadCrumbs from '@/components/Breadcrumbs/BreadCrumbs'

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

export default function TutorialsLandingPage() {
    return (
        <div id="learning-paths-wrap" className="subpage-wrap">
                <BreadCrumbs contain={true}>
                    <Link href="/developer-tools">Developer Tools</Link>
                </BreadCrumbs>

                <HeroSlider secClass="learning-paths-slider">
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
                                    Write your first smart contract and run it in your browser without any knowledge
                                    about Ethereum or blockchains.
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

                <section className="contain dev-tools">
                    <div className="flex flex-col gap-10 mt-40">
                        <input type="text" placeholder="Search" className="search-field w-full p-2" />
                        <div className="grid grid-4-column guides-grid">
                            {Array.from({ length: 12 }).map((_, index) => (
                                <a href="#" className="card card-type-3" key={index}>
                                    <picture>
                                        <img src="/images/dev-tools-img.jpg" alt="" />
                                    </picture>
                                    <div className="card-content">
                                        <span className="title">Title</span>
                                        <p className="desc">Description</p>
                                        <span className="tags">
                                            <span className="tag">Tag</span>
                                            <span className="tag">Tag</span>
                                        </span>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </section>
        </div>
    )
}
