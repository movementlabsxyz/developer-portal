import { getAllPostsData, getCategoryBySlug, getPostData } from '@/lib/posts'
import Article from '@/pages/Tutorials/Article'
import { Metadata } from 'next'
import { DirectoryNode, PostPageProps } from '@/types/posts'
import LearningPathLandingPage from '../page'

export async function generateStaticParams() {
    const posts = getAllPostsData()
    return posts.map((post) => ({
        slug: post.link,
    }))
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
    const id = params.subCategory
    const { category: pageSlug, subCategory } = params
    const postData = await getPostData(id || '')

    if (!postData) {

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

    return {
        title: `${decodeURIComponent(postData.title.includes('-') ? postData.title.split('-').slice(1).join(' ').replace('.md', '') : postData.title || '')} - Movement Developer Portal`,
        description: postData.description || '',
    }
}

/**
 * Returns the post page
 * @param {PostPageProps} props - The page props
 * @returns {JSX.Element} The post page
 */
export default async function PostPage({ params }: PostPageProps) {
    const id = params.subCategory
    const postData = await getPostData(id || '')

    if (!postData) {
        return <LearningPathLandingPage params={{ category:  [params.category?.toString() || ''], subCategory: [id || ''] }} />
    }

    const pageCategory = getCategoryBySlug('learning-paths', params.category?.toString() || '') as DirectoryNode
    return <Article data={postData} category={pageCategory} />
}
