'use client'
import Slider from 'react-slick'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import next from 'next'
import { equal } from 'assert'

interface CarouselProps {
    children: React.ReactNode
}

interface ArrowProps {
    className?: string
    style?: React.CSSProperties
    onClick?: () => void
}

function NextArrow(props: ArrowProps) {
    const { className, style, onClick } = props
    return (
        <button className="slick-arrow section-btn section-next" id="tools-slider-next" onClick={onClick}>
            <svg width="9" height="12" viewBox="0 0 9 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 6L4.64275e-07 11.1962L9.18537e-07 0.803847L9 6Z" fill="" />
            </svg>
        </button>
    )
}

function PrevArrow(props: ArrowProps) {
    const { className, style, onClick } = props
    return (
        <button className="slick-arrow section-btn section-prev" id="tools-slider-prev" onClick={onClick}>
            <svg width="9" height="12" viewBox="0 0 9 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.86805e-07 6L9 0.803848L9 11.1962L7.86805e-07 6Z" fill="" />
            </svg>
        </button>
    )
}
export default function Carousel({ children }: CarouselProps) {
    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        adaptiveHeight: false,
        prevArrow: <PrevArrow/>,
        nextArrow: <NextArrow/>,
        appendArrows: '.section-arrows',
        breakpoints: [
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    initialSlide: 2,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    }

    return <Slider {...settings}>{children}</Slider>
}
