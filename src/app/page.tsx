// app/page.tsx

import { getAllPostsData } from '../lib/posts'
import HomePage from '@/pages/Home/Home'

export default async function Home() {
    const allPostsData = getAllPostsData()
    

    return (
        <HomePage postData={allPostsData} />
    )
}