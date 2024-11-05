'use client'

import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import lottiebkg from '../../../public/json/home-circles.json'

export default function LottiePlayer(
    props: {
        data: string
    }
) {
    return (
        <DotLottieReact
            data={lottiebkg}
            loop
            autoplay
        />
    )
}