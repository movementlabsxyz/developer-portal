// lib/posts.ts

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import remarkPrism from 'remark-prism'
import slugify from 'slugify'

interface PostData {
    id: string
    title: string
    date: string
    categories: string[]
    contentHtml?: string
    filePath: string
    [key: string]: any // For additional front matter properties
}

interface DirectoryNode {
    name: string
    path: string
    type: 'directory'
    children: PostNode[]
}

interface FileNode {
    name: string
    path: string
    type: 'file'
    postData: PostData
}

type PostNode = DirectoryNode | FileNode

const contentDirectory = path.join(process.cwd(), 'content')

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
                    type: 'file',
                    postData: {
                        id,
                        filePath: relativePath,
                        title: data.title || entry.name.replace(/\.md$/, ''),
                        date: data.date || '',
                        categories: [], // Will be set during traversal
                        ...data,
                    },
                }
                return fileNode
            } else {
                return null // Ignore non-markdown files
            }
        })
        .filter((node): node is PostNode => node !== null)

    return nodes
}

export function getPostTree(): PostNode[] {
    return buildPostTree(contentDirectory)
}

export function getAllPostsData(): PostData[] {
    const postTree = getPostTree()

    const posts: PostData[] = []

    function traverse(node: PostNode, categories: string[] = []) {
        if (node.type === 'directory') {
            const newCategories = [...categories, node.name]
            node.children.forEach((child) => traverse(child, newCategories))
        } else if (node.type === 'file') {
            const postData = node.postData
            postData.categories = categories
            posts.push(postData)
        }
    }

    postTree.forEach((node) => traverse(node))

    return posts
}

export function getAllPostIds(): { params: { id: string } }[] {
    const posts = getAllPostsData()
    return posts.map((post) => ({
        params: {
            id: post.id,
        },
    }))
}

export async function getPostData(id: string): Promise<PostData> {
    const relativeFilePath = id.replace(/_/g, path.sep) + '.md'
    const fullPath = path.join(contentDirectory, relativeFilePath)
    const decodeFullPath = decodeURIComponent(fullPath)
    const fileContents = fs.readFileSync(decodeFullPath, 'utf8')
    const matterResult = matter(fileContents)

    const processedContent = await remark()
        .use(html)
        .use(remarkPrism, {
            plugins: [
                'autolinker',
                'command-line',
                'data-uri-highlight',
                'diff-highlight',
                'inline-color',
                'keep-markup',
                'line-numbers',
                'show-invisibles',
                'treeview',
            ],
        })
        .process(matterResult.content)
    const contentHtml = processedContent.toString()

    const categories = path.dirname(relativeFilePath).split(path.sep).filter(Boolean)

    const data = matterResult.data as {
        title?: string
        date?: string
        [key: string]: any
    }

    const postData: PostData = {
        id,
        contentHtml,
        filePath: relativeFilePath,
        title: data.title || path.basename(fullPath, '.md'),
        date: data.date || '',
        categories,
        ...data,
    }

    return postData
}
