import { getAllPostsData, getPostData } from '@/lib/posts'
import Article from '@/pages/Tutorials/Article'
import { Metadata } from 'next'
import { DirectoryNode, PostPageProps } from '@/types/posts'
import Link from 'next/link'
import BreadCrumbs from '@/components/Breadcrumbs/BreadCrumbs'

export async function generateStaticParams() {
    const posts = getAllPostsData()
    return posts.map((post) => ({
        tutorial: post.link,
    }))
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
    const id = params.tutorial
    const postData = await getPostData(id || '')

    if (!postData) {
        return {
            title: 'Tutorial Not Found - Movement Network',
            description: 'The requested tutorial could not be found.',
        }
    }

    return {
        title: `${decodeURIComponent(postData.title)} - Movement Developer Portal`,
        description: postData.description || '',
    }
}

export default async function TutorialPage({ params }: PostPageProps) {
    const id = params.tutorial
    const postData = await getPostData(id || '')

    if (!postData) {
        return (
            <div className="subpage-wrap">
                <div className="contain">
                    <BreadCrumbs contain={false}>
                        <Link href="/tutorials">Tutorials</Link>
                    </BreadCrumbs>
                    <h1>Tutorial Not Found</h1>
                    <p>The requested tutorial could not be found.</p>
                </div>
            </div>
        )
    }

    const category = {
        name: 'Tutorials',
        path: 'Tutorials',
        type: 'directory',
        children: [],
        link: 'tutorials'
    } as DirectoryNode

    return <Article data={postData} category={category} />
} 