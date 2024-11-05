'use client'

import gsap from 'gsap'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import logo from '../../../public/images/movement-logo-white.svg'
import { usePathname } from 'next/navigation'

export default function Nav() {
    const [mobileNavOpen, setMobileNavOpen] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        const header = document.getElementById('site-header')
        let lastScroll = 0
        let isScrollingDown = false
        let isScrollingUp = false
        let isHeaderVisible = true
        let isScrolling = false
        let scrollTimeout: any
        window.addEventListener('scroll', () => {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout)
            }

            if (!isScrolling) {
                isScrolling = true
                setTimeout(() => {
                    isScrolling = false
                }, 66)
            }

            if (window.scrollY > lastScroll) {
                isScrollingDown = true
                isScrollingUp = false
            } else {
                isScrollingUp = true
                isScrollingDown = false
            }

            if (isScrollingDown && isHeaderVisible && isScrolling && window.scrollY > 100) {
                if (header) {
                    gsap.to(header, {
                        y: '-100%',
                        duration: 0.5,
                        ease: 'power1.inOut',
                    })
                }
                isHeaderVisible = false
            } else if ((isScrollingUp && !isHeaderVisible && isScrolling) || window.scrollY < 100) {
                if (header) {
                    gsap.to(header, {
                        y: '0',
                        duration: 0.5,
                        ease: 'power1.inOut',
                    })
                }
                isHeaderVisible = true
            }

            lastScroll = window.scrollY
        })
    }, [pathname])

    const navItems = [
        {
            name: 'Learning Paths',
            link: '/learning-paths',
        },
        {
            name: 'Tutorials',
            link: '/tutorials',
        },
        {
            name: 'DevTools',
            link: '/developer-tools',
        },
        {
            name: 'Docs',
            link: 'https://docs.movementnetwork.xyz/',
            target: '_blank',
        },
    ]

    return (
        <header id="site-header">
            <div className="inner-wrap">
                <Link href={'/'} className="logo">
                    <Image src={logo} alt="Movement Developer Portal" />
                </Link>
                <nav id="main-nav" role="navigation" className={mobileNavOpen ? 'active' : ''}>
                    <ul>
                        <li>
                            <Link href={'/'} onClick={() => setMobileNavOpen(false)} className={pathname === '/' ? 'active' : ''}>Home</Link>
                        </li>
                        {navItems.map((item, index) => (
                            <li key={index}>
                                <Link
                                    href={item.link}
                                    target={item.target}
                                    onClick={() => setMobileNavOpen(false)}
                                    className={pathname?.toLowerCase().includes(item.link.toLowerCase()) ? 'active' : ''}
                                >
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="lang-selector"></div>
                <button
                    id="nav-btn"
                    aria-label="Open Mobile Nav"
                    className={mobileNavOpen ? 'active' : ''}
                    onClick={() => setMobileNavOpen(!mobileNavOpen)}
                >
                    <span>Menu</span>
                </button>
            </div>
        </header>
    )
}
