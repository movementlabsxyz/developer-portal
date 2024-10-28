import Link from "next/link"
import slugify from "slugify"

export default function LearningPathCard(
    props: {
        cardKey: string
        data: {
            mainBlurb: string
            extendedBlurb: string
            learningPoints: string[]
        }
    }
) {

    return (        
        <Link href={`/learning-paths/${slugify(props.cardKey, {
            lower: true,
            strict: true
        })}`} target={"_self"} className="card card-type-1" key={props.cardKey}>
            <svg
                width="55"
                height="44"
                viewBox="0 0 55 44"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="icon"
            >
                <rect y="22" width="11" height="11" fill="" />
                <rect x="11" y="33" width="11" height="11" fill="" />
                <rect x="11" y="11" width="11" height="11" fill="" />
                <rect width="11" height="11" fill="#FFDA34" />
                <rect x="22" y="22" width="11" height="11" fill="" />
                <rect x="33" y="11" width="11" height="11" fill="" />
                <rect x="44" width="11" height="11" fill="" />
                <rect x="44" y="22" width="11" height="11" fill="" />
                <rect x="33" y="33" width="11" height="11" fill="" />
            </svg>
            <span className="content">
                <span className="title body-20">{props.cardKey}</span>
                <p className="body-16">{props.data.mainBlurb}</p>
            </span>
        </Link>
        
    )
}