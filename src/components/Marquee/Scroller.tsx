import scrollerIcon from "../../../public/images/scroller-icon.svg"
import Image from "next/image"

export default function Scroller() {
    return (
        <div className="header-scroller">
            <p>
                <Image src={scrollerIcon} className="icon" alt="" />
                <span>
                    Welcome to the Battle of Olympus. Join us for a fight to further Movement, the leading integrated,
                    modular blockchain network. This is your chance to win glory.
                </span>
            </p>
        </div>
    )
}
