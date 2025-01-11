// lib/posts.ts

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import remarkPrism from 'remark-prism'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import slugify from 'slugify'

interface PostData {
    id: string
    title: string
    date: string
    link?: string
    categories: string[]
    contentHtml?: string
    filePath: string
    prevPage?: string
    nextPage?: string
    tableOfContents?: Heading[]
    [key: string]: any // For additional front matter properties
}

interface PostCategory {
    name: string
    link: string
}

interface DirectoryNode {
    name: string
    path: string
    type: 'directory'
    children: PostNode[]
    link: string
}

interface FileNode {
    name: string
    path: string
    type: 'file'
    postData: PostData
    link?: string
}
interface Heading {
    depth: number
    text: string
    id: string
}

type PostNode = DirectoryNode | FileNode

const contentDirectory = path.join(process.cwd(), 'content')

/**
 * Recursively build a tree of directories and files in the content directory
 * @param dir The directory to build the tree from
 * @param baseDir The base directory to calculate relative paths from
 * @returns The tree of directories and files
 * @example
 * const postTree = buildPostTree('content')
 */
function buildPostTree(dir: string, baseDir: string = contentDirectory): PostNode[] {
    const entries = fs.readdirSync(dir, { withFileTypes: true })

    const nodes: PostNode[] = entries
        .map((entry): PostNode | null => {
            const fullPath = path.join(dir, entry.name)
            const relativePath = path.relative(baseDir, fullPath)

            if (entry.isDirectory()) {
                const children = buildPostTree(fullPath, baseDir)
                const directoryNode: DirectoryNode = {
                    name: entry.name,
                    path: relativePath,
                    type: 'directory',
                    children,
                    link: slugify(entry.name, {
                            lower: true,
                            strict: true,
                        }),
                }
                return directoryNode
            } else if (entry.isFile() && fullPath.endsWith('.md')) {
                const fileContents = fs.readFileSync(fullPath, 'utf8')
                const matterResult = matter(fileContents)

                const id = slugify(relativePath.replace(/\.md$/, '').replace(/[\\/]/g, '_'), {
                    lower: true,
                    strict: true,
                })

                const data = matterResult.data as {
                    title?: string
                    date?: string
                    [key: string]: any
                }

                const fileNode: FileNode = {
                    name: entry.name,
                    path: relativePath,
                    link: slugify(data.title || entry.name.replace(/\.md$/, ''), {
                        lower: true,
                        strict: true,
                    }),
                    postData: {
                        id,
                        filePath: relativePath,
                        title: data.title || entry.name.replace(/\.md$/, ''),
                        date: data.date || '',
                        categories: [], // Will be set during traversal
                        ...data,
                    },
                    type: 'file',
                }
                return fileNode
            } else {
                return null // Ignore non-markdown files
            }
        })
        .filter((node): node is PostNode => node !== null)

    return nodes
}

/**
 * Get the tree of directories and files in the content directory
 * @returns The tree of directories and files
 * @example
 * const postTree = getPostTree()
 */
export function getPostTree(): PostNode[] {
    return buildPostTree(contentDirectory)
}

/**
 * Get all post data from the content directory
 * @returns All post data
 * @example
 * const allPostsData = getAllPostsData()
 */
export function getAllPostsData(): PostData[] {
    const postTree = getPostTree()

    const posts: PostData[] = []

    function traverse(node: PostNode, categories: PostCategory[] = []) {
        if (node.type === 'directory') {
            const newCategories = [...categories, { name: node.name, link: node.link }]
            node.children.forEach((child) => traverse(child, newCategories))
        } else if (node.type === 'file') {
            const postData = node.postData
            postData.categories = categories.map((category) => category.name)
            postData.link = node.link
            posts.push(postData)
        }
    }

    postTree.forEach((node) => traverse(node))

    return posts
}

/**
 * Get all post IDs from the content directory
 * @returns All post IDs
 * @example
 * const allPostIds = getAllPostIds()
 */
export function getAllPostIds(): { params: { id: string } }[] {
    const posts = getAllPostsData()
    return posts.map((post) => ({
        params: {
            id: post.id,
        },
    }))
}

/**
 * Get post data by ID
 * @param id The ID of the post
 * @returns The post data
 * @example
 * const postData = getPostData('path/to/post')
 */
export async function getPostData(id: string): Promise<PostData | null> {
    const allPosts = getAllPostsData()
    
    // Define the correct order of main categories
    const CATEGORY_ORDER = ['Basic Concepts', 'Advanced Move', 'NFT', 'DeFi'];

    // Sort posts based on category order and then by their natural order within categories
    const sortedPosts = [...allPosts].sort((a, b) => {
        const aCats = path.dirname(a.filePath).split(path.sep).filter(Boolean);
        const bCats = path.dirname(b.filePath).split(path.sep).filter(Boolean);
        
        // Get main category (removing 'Learning-Paths')
        const aMainCat = aCats.find(cat => CATEGORY_ORDER.includes(cat)) || '';
        const bMainCat = bCats.find(cat => CATEGORY_ORDER.includes(cat)) || '';
        
        // Compare main categories first
        const aIndex = CATEGORY_ORDER.indexOf(aMainCat);
        const bIndex = CATEGORY_ORDER.indexOf(bMainCat);
        if (aIndex !== bIndex) {
            return aIndex - bIndex;
        }
        
        // If in same category, compare by file path
        return a.filePath.localeCompare(b.filePath);
    });

    const currentIndex = sortedPosts.findIndex((post) => post.link === id)

    if (currentIndex === -1) {
        return null
    }

    const post = sortedPosts[currentIndex]
    const prevPost = currentIndex > 0 ? sortedPosts[currentIndex - 1] : null
    const nextPost = currentIndex < sortedPosts.length - 1 ? sortedPosts[currentIndex + 1] : null

    const fullPath = 'content/' + post.filePath
    const decodeFullPath = decodeURIComponent(fullPath)
    const fileContents = fs.readFileSync(decodeFullPath, 'utf8')
    const noTitleFileContents = fileContents.split('\n').slice(1).join('\n')
    const matterResult = matter(noTitleFileContents)

    // Process headings
    const tableOfContents: Heading[] = []
    const processedContent = await remark()
        .use(remarkParse)
        .use(remarkGfm)
        .use(() => (tree) => {
            function visitor(node: any) {
                if (node.type === 'heading') {
                    const headingText = node.children
                        .filter((child: any) => child.type === 'text')
                        .map((child: any) => child.value)
                        .join('')

                    const slug = slugify(headingText, { lower: true, strict: true })

                    tableOfContents.push({
                        depth: node.depth,
                        text: headingText,
                        id: slug,
                    })

                    node.data = node.data || {}
                    node.data.hProperties = node.data.hProperties || {}
                    node.data.hProperties.id = slug
                }
            }

            function visit(parent: any, nodeVisitor: (node: any) => void) {
                for (const node of parent.children) {
                    nodeVisitor(node)
                    if (node.children) {
                        visit(node, nodeVisitor)
                    }
                }
            }

            visit(tree, visitor)
        })
        .use(html)
        .process(matterResult.content)

    const contentHtml = processedContent.toString()

    const categories = path.dirname(post.filePath).split(path.sep).filter(Boolean)
    const prevCategories = prevPost ? path.dirname(prevPost.filePath).split(path.sep).filter(Boolean) : []
    const nextCategories = nextPost ? path.dirname(nextPost.filePath).split(path.sep).filter(Boolean) : []

    const data = matterResult.data as {
        title?: string
        date?: string
        [key: string]: any
    }

    // Build the URL paths preserving the full category structure
    const buildPagePath = (postLink: string | null, postCategories: string[]) => {
        if (!postLink) return null
        // Remove 'Learning-Paths' from categories
        const relevantCategories = postCategories.filter(cat => cat !== 'Learning-Paths');
        const formattedCategories = relevantCategories.map(category => 
            slugify(category, {
                lower: true,
                strict: true
            })
        );
        return `/learning-paths/${formattedCategories.join('/')}/${postLink}`
    }

    const postData: PostData = {
        id,
        contentHtml,
        filePath: post.filePath,
        title: data.title || path.basename(fullPath, '.md'),
        date: data.date || '',
        categories,
        tableOfContents,
        prevPage: buildPagePath(prevPost?.link || null, prevCategories),
        nextPage: buildPagePath(nextPost?.link || null, nextCategories),
        ...data,
    }

    return postData
}

/**
 * Group posts by categories
 * @param posts The posts to group
 * @returns The grouped posts
 * @example
 * const allPostsData = getAllPostsData()
 */
export function groupPostsByCategories(posts: PostData[]): any {
    // const allPostsData = getAllPostsData()
    // const groupedPosts = groupPostsByCategories(allPostsData)

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

/**
 * Get subfolders in a category
 * @param category The high level category
 * @returns The subfolders in the category
 * @example
 * const subfolders = getSubfolders('learning-paths')
 */
export function getSubCategories(category: string, subcategory?: string, subSubCategory?: string): PostCategory[] {
    const postTree = getPostTree()
    const categoryNode = postTree.find(
        (node) => node.name.toLowerCase() === category.toLowerCase() && node.type === 'directory',
    ) as DirectoryNode

    if (!categoryNode) {
        return []
    }

    let nodes = categoryNode.children.map((child) => ({
        name: child.name,
        link: child.link || '',
    }))

    if (subcategory) {
        const subcategoryNode = categoryNode.children.find(
            (child) => child.link?.includes(subcategory.toLowerCase()) && child.type === 'directory',
        ) as DirectoryNode

        if (!subcategoryNode) {
            return []
        }
        nodes = subcategoryNode?.children.map((child) => ({
            name: child.name.includes('.md') ? child.name.split('-').slice(1).join(' ').replace('.md', '') : child.name,
            link: child.link || '',
        }))
    }

    if (subcategory && subSubCategory) {
        const subcategoryNode = categoryNode.children.find(
            (child) => child.link?.includes(subcategory.toLowerCase()) && child.type === 'directory',
        ) as DirectoryNode

        if (!subcategoryNode) {
            return []
        }

        const subSubCategoryNode = subcategoryNode.children.find(
            (child) => child.link?.includes(subSubCategory.toLowerCase()) && child.type === 'directory',
        ) as DirectoryNode

        if (!subSubCategoryNode) {
            return []
        }

        nodes = subSubCategoryNode?.children.map((child) => ({
            name: child.name.split('-').slice(1).join(' ').replace('.md', ''),
            link: child.link || '',
        }))
    }

    return nodes
}

/**
 * Build breadcrumbs for a post
 * @param category The category of the post
 * @param subcategory The subcategory of the post
 * @param post The post
 * @returns The breadcrumbs
 */
export function buildBreadCrumbs(
    category: string,
    subcategory: string,
    post: string,
): { name: string; link: string }[] {
    const postTree = getPostTree()
    const categoryNode = postTree.find(
        (node) => node.name.toLowerCase() === category.toLowerCase() && node.type === 'directory',
    ) as DirectoryNode

    if (!categoryNode) {
        return []
    }

    const categoryLink = categoryNode.link

    const subcategoryNode = categoryNode.children.find(
        (child) => child.link?.includes(subcategory?.toLowerCase()) && child.type === 'directory',
    ) as DirectoryNode

    if (!subcategoryNode) {
        return []
    }

    const subcategoryLink = subcategoryNode.link

    const postNode = subcategoryNode.children.find(
        (child) => child.link?.includes(post.toLowerCase()) && child.type === 'file',
    ) as FileNode

    if (!postNode) {
        return []
    }

    return [
        { name: category, link: categoryLink },
        { name: subcategory, link: subcategoryLink },
        { name: postNode.postData.title, link: postNode.link || '' },
    ]
}

export function getCategoryBySlug(category: string, slug: string, subCategory?: string): DirectoryNode | undefined {
    const postTree = getPostTree()
    const categoryNode = postTree.find(
        (node) => node.name.toLowerCase() === category.toLowerCase() && node.type === 'directory',
    ) as DirectoryNode

    if (!categoryNode) {
        return undefined
    }

    const subcategoryNode = categoryNode.children.find(
        (child) => child.link?.includes(slug.toLowerCase()) && child.type === 'directory',
    ) as DirectoryNode

    if (!subcategoryNode) {
        return undefined
    }

    if (subCategory) {
        const postNode = subcategoryNode.children.find(
            (child) => child.link?.includes(subCategory.toLowerCase()) && child.type === 'directory',
        ) as DirectoryNode

        if (!postNode) {
            return undefined
        }

        return postNode

    }

    return subcategoryNode
}

// export function renderCategories(categories: any, path: string[] = []) {
//     return Object.keys(categories).map((key) => {
//         if (key === 'posts') {
//             return (
//                 <ul key={path.join('/')}>
//                     {categories[key].map((post: PostData) => (
//                         <li key={post.id}>
//                             <Link href={`/posts/${post.filePath.replace('.md','')}`}>{post.title}</Link>
//                         </li>
//                     ))}
//                 </ul>
//             )
//         } else {
//             return (
//                 <div key={key}>
//                     <h2>{key}</h2>
//                     {renderCategories(categories[key], [...path, key])}
//                 </div>
//             )
//         }
//     })
// }
