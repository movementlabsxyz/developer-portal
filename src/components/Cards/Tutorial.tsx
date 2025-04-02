import Link from "next/link"

interface TutorialData {
    category: string
    title: string
    description: string
    amt: string
    type: 'written' | 'external'
    link?: string
    markdownFile?: string
    tags: string[]
    image?: string
    linkTarget?: string
}

export default function TutorialCard({ data }: { data: TutorialData }) {
    // For written tutorials, generate the URL based on the title
    const href = data.type === 'written' 
        ? `/tutorials/${data.markdownFile?.replace('.md', '').toLowerCase().replace(/\s+/g, '-')}`
        : data.link || '#'

    // External tutorials open in new tab, written tutorials don't
    const target = data.type === 'external' ? '_blank' : undefined

    return (
        <Link href={href} target={target} className="card card-type-2" key={data.title}>
            <span className="meta">
                <span>{data.category}</span>
                <span>{data.amt}</span>
            </span>
            <div className="card-content">
                <span className="title">{data.title}</span>
                <p className="desc">
                    {data.description}
                </p>
            </div>
            <picture>
                <img src="/images/tech-stack.png" alt="" />
                <span className="tags">
                    {data.tags.map((tag) => (
                        <span className="tag" key={`tag${tag}`}>{tag}</span>
                    ))}
                </span>
            </picture>
        </Link>
    )
}