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
                        <input type="text" placeholder="Search" className="search-field w-full p-2" />
                        <div className="grid grid-4-column guides-grid">
                            {Array.from({ length: 12 }).map((_, index) => (
                                <a href="#" className="card card-type-2" key={index}>
                                    <span className="meta">
                                        <span>Advanced</span>
                                        <span>25m</span>
                                    </span>
                                    <div className="card-content">
                                        <span className="title">Title</span>
                                        <p className="desc">
                                            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                        </p>
                                    </div>
                                    <picture>
                                        <img src="/images/tech-stack.png" alt="" />
                                        <span className="tags">
                                            <span className="tag">Tag</span>
                                            <span className="tag">Tag</span>
                                        </span>
                                    </picture>
                                </a>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}
