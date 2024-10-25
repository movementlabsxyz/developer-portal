'use client'

import React, { useEffect, useState } from 'react'
import slugify from 'slugify'

interface TableOfContentsItem {
    depth: number
    text: string
    id: string
    children?: TableOfContentsItem[] // Nested headings
}

interface Props {
    tableOfContents: TableOfContentsItem[]
}

const TableOfContents: React.FC<Props> = ({ tableOfContents }) => {
    const [activeId, setActiveId] = useState<string>('')

    useEffect(() => {
        const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6')

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id)
                    }
                })
            },
            { rootMargin: '0% 0% -80% 0%' }, // Adjust based on when you'd like to trigger active link
        )

        headingElements.forEach((element) => observer.observe(element))

        return () => {
            headingElements.forEach((element) => observer.unobserve(element))
        }
    }, [])


    // Helper function to create a nested array structure based on depth
    const createNestedStructure = (
        items: TableOfContentsItem[]
    ): TableOfContentsItem[] => {
        const nested: TableOfContentsItem[] = []
        let currentDepth = 1
        let currentList: TableOfContentsItem[] = nested

        items.forEach((item) => {
            // If item is deeper, we need to nest it
            if (item.depth > currentDepth) {
                const lastItem = currentList[currentList.length - 1]
                if (lastItem) {
                    lastItem.children = lastItem.children || []
                    currentList = lastItem.children
                }
            } else if (item.depth < currentDepth) {
                // If item is less deep, we backtrack
                currentList = nested
            }

            // Add item to the current list
            currentList.push({ ...item, children: [] })
            currentDepth = item.depth
        })

        return nested
    }

    const nestedItems = createNestedStructure(tableOfContents)

    const renderItems = (items: TableOfContentsItem[]) => (
        <>
            {items.map((item, index) => {
                const slug = slugify(item.text, { lower: true, strict: true })
                return (
                    <li key={index}>
                        <span><a href={`#user-content-${slug}`} className={activeId === `#user-content-${slug}` ? 'active' : ''}>
                            {item.text}
                        </a></span>
                        {item.children && item.children.length > 0 && (
                            <ul className="nested">{renderItems(item.children)}</ul>
                        )}
                    </li>
                )
            })}
        </>
    )

    return <ul id="scroll-index">{renderItems(nestedItems)}</ul>
}

export default TableOfContents
