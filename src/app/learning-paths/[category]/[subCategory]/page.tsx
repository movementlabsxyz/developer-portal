import { getAllPostsData, getCategoryBySlug, getPostData } from '@/lib/posts'
import Article from '@/pages/Tutorials/Article'
import { Metadata } from 'next'
import { DirectoryNode, PostPageProps } from '@/types/posts'

export async function generateStaticParams() {
    const posts = getAllPostsData()
    return posts.map((post) => ({
        slug: post.link,
    }))
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
    const id = params.subCategory
    const postData = await getPostData(id)

    if (!postData) {
        return {}
    }

    return {
        title: `${decodeURIComponent(postData.title || '')} - Movement Developer Portal`,
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
    const postData = await getPostData(id)

    const pageCategory = getCategoryBySlug('learning-paths', params.category.toString()) as DirectoryNode

    if (!postData) {
        return
    }

    return <Article data={postData} category={pageCategory} />
}
