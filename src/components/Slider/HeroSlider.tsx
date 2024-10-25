export default function HeroSlider(
    props: {
        children: React.ReactNode,
        secClass?: string
    }
) {
    return (
        <section className={`contain ${props.secClass ? props.secClass : 'landing-slider'}`}>
            <div className="slick-slider hero-slider">
                {props.children}
                <div className="controls">
                    <div className="slick-pager hero-slider-pager">
                        <span>1</span>
                        <span className="slick-active">2</span>
                        <span>3</span>
                        <span>4</span>
                    </div>
                    <div className="slick-arrows hero-slider-arrows">
                        <span className="slick-arrow slick-prev">
                            <svg
                                width="15"
                                height="8"
                                viewBox="0 0 15 8"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M0.646446 3.36959C0.451184 3.56485 0.451184 3.88143 0.646446 4.0767L3.82843 7.25868C4.02369 7.45394 4.34027 7.45394 4.53553 7.25868C4.7308 7.06342 4.7308 6.74683 4.53553 6.55157L1.70711 3.72314L4.53553 0.894717C4.7308 0.699454 4.7308 0.382872 4.53553 0.18761C4.34027 -0.0076525 4.02369 -0.00765253 3.82843 0.18761L0.646446 3.36959ZM15 3.22314L1 3.22314L1 4.22314L15 4.22314L15 3.22314Z"
                                    fill=""
                                />
                            </svg>
                        </span>
                        <span className="slick-arrow slick-next">
                            <svg
                                width="15"
                                height="8"
                                viewBox="0 0 15 8"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M14.3536 4.0767C14.5488 3.88144 14.5488 3.56485 14.3536 3.36959L11.1716 0.187611C10.9763 -0.00765157 10.6597 -0.00765157 10.4645 0.187611C10.2692 0.382873 10.2692 0.699455 10.4645 0.894717L13.2929 3.72314L10.4645 6.55157C10.2692 6.74683 10.2692 7.06342 10.4645 7.25868C10.6597 7.45394 10.9763 7.45394 11.1716 7.25868L14.3536 4.0767ZM0 4.22314H14V3.22314H0V4.22314Z"
                                    fill=""
                                />
                            </svg>
                        </span>
                    </div>
                </div>
            </div>
        </section>
    )
}
