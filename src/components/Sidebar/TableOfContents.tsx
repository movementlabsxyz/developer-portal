import React from 'react'

type TableOfContentsItem = {
    depth: number
    text: string
    children?: TableOfContentsItem[] // Nested headings
}

type Props = {
    tableOfContents: TableOfContentsItem[]
}

const TableOfContents: React.FC<Props> = ({ tableOfContents }) => {

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
            {items.map((item, index) => (
                <li key={index}>
                    <span>{item.text}</span>
                    {item.children && item.children.length > 0 && (
                        <ul className="nested">
                            {renderItems(item.children)}
                        </ul>
                    )}
                </li>
            ))}
        </>
    )

    return <ul id="scroll-index">{renderItems(nestedItems)}</ul>
}

export default TableOfContents