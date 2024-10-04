// app/page.tsx

import Link from 'next/link'
import { getAllPostsData } from '../lib/posts'
import { PostData } from '../types/posts'

export default async function Home() {
    const allPostsData = getAllPostsData()

    const groupedPosts = groupPostsByCategories(allPostsData)

    return (
        <main>
            <h1>All Posts</h1>
            {renderCategories(groupedPosts)}
        </main>
    )
}

function groupPostsByCategories(posts: PostData[]) {
    const grouped: any = {}

    posts.forEach((post) => {
        let currentLevel = grouped

        post.categories.forEach((category) => {
            if (!currentLevel[category]) {
                currentLevel[category] = {}
            }
            currentLevel = currentLevel[category]
        })

        if (!currentLevel.posts) {
            currentLevel.posts = []
        }
        currentLevel.posts.push(post)
    })

    return grouped
}

function renderCategories(categories: any, path: string[] = []) {
    return Object.keys(categories).map((key) => {
        if (key === 'posts') {
            return (
                <ul key={path.join('/')}>
                    {categories[key].map((post: PostData) => (
                        <li key={post.id}>
                            <Link href={`/posts/${post.filePath.replace('.md','')}`}>{post.title}</Link>
                        </li>
                    ))}
                </ul>
            )
        } else {
            return (
                <div key={key}>
                    <h2>{key}</h2>
                    {renderCategories(categories[key], [...path, key])}
                </div>
            )
        }
    })
}
