import HeroSlider from '@/components/Slider/HeroSlider'
import { getAllPostsData, getCategoryBySlug, getPostData, getSubCategories } from '@/lib/posts'
import Link from 'next/link'
import { Metadata } from 'next'
import Article from '@/pages/Tutorials/Article'
import BreadCrumbs from '@/components/Breadcrumbs/BreadCrumbs'
import useLearningPaths from '@/hooks/useLearningPaths'
import slugify from 'slugify'

interface PostPageProps {
    params: {
        category: string[]
        subCategory?: string[] | undefined
    }
}

// export async function generateStaticParams() {
//     const posts = getAllPostsData()
//     return posts.map((post) => ({
//         slug: post.filePath.replace('.md', '').split('/'),
//     }))
// }

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
    const { category: pageSlug, subCategory } = params

    if (!pageSlug) {
        return {}
    }

    const pageCategory = getCategoryBySlug('learning-paths', pageSlug.toString())
    const pageSubCategory = getCategoryBySlug('learning-paths', pageSlug.toString(), subCategory ? subCategory.toString() : undefined)

    return {
        title: `${params.subCategory ? pageSubCategory?.name.includes('-') ? pageSubCategory?.name.split('-')[1] : pageSubCategory?.name : pageCategory?.name} - Movement Network`,
        description: 'Learning Paths for the Movement Network',
    }
}

export default async function LearningPathLandingPage({ params }: PostPageProps) {
    const { category: pageSlug, subCategory } = params
    const LearningPathsData = useLearningPaths()

    if (!pageSlug) {
        return
    }

    const pageCategory = getCategoryBySlug('learning-paths', pageSlug.toString())
    const pageSubCategory = getCategoryBySlug('learning-paths', pageSlug.toString(), subCategory ? subCategory.toString() : undefined)
    const categories = getSubCategories('learning-paths', pageSlug.toString(), subCategory ? subCategory.toString() : undefined)

    const pageData = Object.keys(LearningPathsData).
    filter((key) => slugify(key, {
        lower: true,
        strict: true,
    }) === pageSlug.toString()).
    map((key) => LearningPathsData[key])

    let pathUrl = `/learning-paths/${pageCategory?.link}`
    if (subCategory) {
        pathUrl += `/${subCategory}`
    }

    return (
        <div id="learning-paths-inner-wrap" className="subpage-wrap">
            <div className="contain">
                <BreadCrumbs contain={false}>
                    <Link href="/learning-paths">Learning Paths</Link>
                    { pageCategory && <Link href={`/learning-paths/${pageCategory.link}`}>{pageCategory.name}</Link> }
                </BreadCrumbs>

                <div className="page-intro">
                    {/* <span className="subtitle body-12">
                        6 Tutorials | 2 Demos | 3 Tools
                    </span> */}
                    <h1 className="title">{params.subCategory ? pageSubCategory?.name.includes('-') ? pageSubCategory?.name.split('-')[1] : pageSubCategory?.name : pageCategory?.name}</h1>
                    <p className="body-24">
                        {params.subCategory ? '' : pageData[0]?.extendedBlurb}
                    </p>
                    <Link href={`${pathUrl}/${categories[0]?.link}`} className="btn">
                        Start
                    </Link>
                </div>

                <div className="grid grid-4-column path-types-grid">
                    {categories.map((category, index) => {
                        if (!category.name || category.name === 'images') return
                        return (
                            <Link 
                            href={`${pathUrl}/${category.link}`}
                            prefetch={false} className="card card-type-4" key={index}>
                                <span className="inner">
                                    <picture>
                                        <img src="/images/icon-bg-transparent.png" alt="" />
                                    </picture>
                                    <span className="title body-24">{category.name.split('-')[1] || category.name}</span>
                                    <span className="btn">Start</span>
                                </span>
                                {/* <span className="brief">
                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                </span> */}
                            </Link>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
