import Link from "next/link"

export default function ToolsCard(
    props: {
        data: {
            title: string
            description: string
            link: string
            tags: string[]
            image?: string
            linkTarget?: string
        }
    }
) {
    return (
        
        <Link href={props.data.link} target={props.data.linkTarget || "_blank"} className="card card-type-3" key={props.data.title}>
            <picture>
                <img src="/images/dev-tools-img.jpg" alt="" />
            </picture>
            <div className="card-content">
                <span className="title">{props.data.title}</span>
                <p className="desc">
                    {props.data.description}
                </p>
                <span className="tags">
                    {
                        props.data.tags.map((tag) => (
                            <span className="tag" key={`tag${tag}`}>{tag}</span>
                        ))
                    }
                </span>
            </div>
        </Link>
    )
}