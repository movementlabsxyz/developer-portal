// app/posts/[...slug]/page.tsx

import { getAllPostsData, getPostData } from '../../../lib/posts'
import { Metadata } from 'next'
import { PostData } from '@/types/posts'
import { Markdown } from '@/lib/markdown'

interface PostPageProps {
    params: {
        slug: string[]
    }
}

export async function generateStaticParams() {
    const posts = getAllPostsData()
    return posts.map((post) => ({
        slug: post.filePath.replace('.md', '').split('/'),
    }))
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
    const id = params.slug.join('_')
    const postData = await getPostData(id)

    if (!postData) {
        return {}
    }

    return {
        title: `${decodeURIComponent(postData.title || "")} - Movement Network`,
        description: postData.description || '',
    }
}

export default async function PostPage({ params }: PostPageProps) {
    const id = params.slug.join('_')
    const postData = await getPostData(id)

    if (!postData) {
       return;
    }

    return (
        <article className="page-content">
            {/* <h1>{decodeURIComponent(postData.title || "")}</h1> */}
            <Markdown content={postData.contentHtml || ''} />
        </article>
    )
}
