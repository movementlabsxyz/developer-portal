import Link from "next/link"

export default function ToolsCard(
    props: {
        data: {
            category: string
            title: string
            description: string
            amt: string
            link: string
            tags: string[]
            image?: string
            linkTarget?: string
        }
    }
) {
    return (
        <Link href={props.data.link} target={props.data.linkTarget || "_blank"} className="card card-type-2" key={props.data.title}>
            <span className="meta">
                <span>{props.data.category}</span>
                <span>{props.data.amt}</span>
            </span>
            <div className="card-content">
                <span className="title">{props.data.title}</span>
                <p className="desc">
                    {props.data.description}
                </p>
            </div>
            <picture>
                <img src="/images/tech-stack.png" alt="" />
                <span className="tags">
                    {props.data.tags.map((tag) => (
                        <span className="tag" key={`tag${tag}`}>{tag}</span>
                    ))}
                </span>
            </picture>
        </Link>
    )
}