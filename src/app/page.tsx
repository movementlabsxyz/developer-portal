// app/page.tsx

import { getAllPostsData, getSubCategories } from '../lib/posts'
import HomePage from '@/pages/Home/Home'

export default async function Home() {
    const allPostsData = getAllPostsData()
    const categories = getSubCategories('learning-paths')
    
    return (
        <HomePage 
            postData={allPostsData}
        />
    )
}