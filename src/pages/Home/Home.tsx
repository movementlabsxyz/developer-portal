import Scroller from '@/components/Marquee/Scroller'
import HeroSlider from '@/components/Slider/HeroSlider'
import { getSubCategories } from '@/lib/posts'
import { PostData } from '@/types/posts'
import Link from 'next/link'

export default function Home(props: { postData: PostData[] }) {
    const allPostsData = props.postData
    const categories = getSubCategories('learning-paths')
    return (
        <div className="md:mt-40">
            <HeroSlider>
                <div className="slide has-video">
                    <div className="col-lt">
                        <picture>
                            <button className="play">
                                <svg
                                    width="38"
                                    height="44"
                                    viewBox="0 0 38 44"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M37.6506 22.0001L0.114485 43.9951L0.114487 0.00516918L37.6506 22.0001Z"
                                        fill=""
                                    />
                                </svg>
                            </button>
                        </picture>
                    </div>
                    <div className="col-rt">
                        <div className="inner">
                            <h1 className="title">Meet the Founders!</h1>
                            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                            <a href="#" className="btn btn-yellow">
                                Guide
                            </a>
                            <a href="#" className="btn btn-yellow">
                                Demo
                            </a>
                        </div>
                    </div>
                </div>
            </HeroSlider>

            <section className="contain learning-paths">
                <div className="section-head">
                    <h3>Movement Learning Paths</h3>
                    <a href="#" className="btn btn-12">
                        View All
                    </a>
                </div>
                <div className="path-link">
                    <div className="video-bg">
                        <video autoPlay loop muted playsInline preload="meta">
                            <source type="video/mp4" src="/video/video-bg-1.mp4" />
                        </video>
                    </div>
                    <Link href="#" className="learning-content">
                        <h4>Jump in and start learning</h4>
                        <p>
                            A curated list of resources for developers in specific verticals to learn how to build on
                            movement
                        </p>
                        <span className="ul-link body-12">View All Paths</span>
                        <button className="play">
                            <svg
                                width="38"
                                height="44"
                                viewBox="0 0 38 44"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M37.6506 22.0001L0.114485 43.9951L0.114487 0.00516918L37.6506 22.0001Z"
                                    fill=""
                                />
                            </svg>
                        </button>
                    </Link>
                </div>
            </section>

            <section className="contain path-cards">
                <div className="grid grid-3-column">
                    {categories.map((category, index) => (
                        <Link href={category.link} className="card card-type-1" key={category.name}>
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
                                <span className="title body-20">{category.name}</span>
                                <p className="body-16"></p>
                            </span>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="contain guides">
                <div className="section-head">
                    <h3>Guides and Tutorials</h3>
                    <a href="#" className="btn btn-12">
                        View All
                    </a>
                    <div className="slick-arrows section-arrows">
                        <a href="#" className="slick-arrow section-btn section-prev">
                            <svg
                                width="9"
                                height="12"
                                viewBox="0 0 9 12"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M7.86805e-07 6L9 0.803848L9 11.1962L7.86805e-07 6Z" fill="" />
                            </svg>
                        </a>
                        <a href="#" className="slick-arrow section-btn section-next">
                            <svg
                                width="9"
                                height="12"
                                viewBox="0 0 9 12"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M9 6L4.64275e-07 11.1962L9.18537e-07 0.803847L9 6Z" fill="" />
                            </svg>
                        </a>
                    </div>
                </div>
                <div className="grid grid-4-column guides-grid">
                    <a href="#" className="card card-type-play">
                        <span className="body-20">
                            Sharpen your skills and understand how to get the most out of Movement
                        </span>
                        <span className="play-wrap">
                            <button className="play">
                                <svg
                                    width="38"
                                    height="44"
                                    viewBox="0 0 38 44"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M37.6506 22.0001L0.114485 43.9951L0.114487 0.00516918L37.6506 22.0001Z"
                                        fill=""
                                    />
                                </svg>
                            </button>
                        </span>
                    </a>
                    <a href="#" className="card card-type-2">
                        <span className="meta">
                            <span>Advanced</span>
                            <span>25m</span>
                        </span>
                        <div className="card-content">
                            <span className="title">Title</span>
                            <p className="desc">
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                            </p>
                        </div>
                        <picture>
                            <img src="/images/tech-stack.png" alt="" />
                            <span className="tags">
                                <span className="tag">Tag</span>
                                <span className="tag">Tag</span>
                            </span>
                        </picture>
                    </a>
                    <a href="#" className="card card-type-2">
                        <span className="meta">
                            <span>Advanced</span>
                            <span>25m</span>
                        </span>
                        <div className="card-content">
                            <span className="title">Title</span>
                            <p className="desc">
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                            </p>
                        </div>
                        <picture>
                            <img src="/images/tech-stack.png" alt="" />
                            <span className="tags">
                                <span className="tag">Tag</span>
                                <span className="tag">Tag</span>
                            </span>
                        </picture>
                    </a>
                    <a href="#" className="card card-type-2">
                        <span className="meta">
                            <span>Advanced</span>
                            <span>25m</span>
                        </span>
                        <div className="card-content">
                            <span className="title">Title</span>
                            <p className="desc">
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
                                is simply dummy text of the printing and typesetting industry.
                            </p>
                        </div>
                        <picture>
                            <img src="/images/tech-stack.png" alt="" />
                            <span className="tags">
                                <span className="tag">Tag</span>
                                <span className="tag">Tag</span>
                            </span>
                        </picture>
                    </a>
                </div>
            </section>

            <section className="contain dev-tools">
                <div className="section-head">
                    <h3>Developer Tools</h3>
                    <a href="#" className="btn btn-12">
                        View All
                    </a>
                    <div className="slick-arrows section-arrows">
                        <a href="#" className="slick-arrow section-btn section-prev">
                            <svg
                                width="9"
                                height="12"
                                viewBox="0 0 9 12"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M7.86805e-07 6L9 0.803848L9 11.1962L7.86805e-07 6Z" fill="" />
                            </svg>
                        </a>
                        <a href="#" className="slick-arrow section-btn section-next">
                            <svg
                                width="9"
                                height="12"
                                viewBox="0 0 9 12"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M9 6L4.64275e-07 11.1962L9.18537e-07 0.803847L9 6Z" fill="" />
                            </svg>
                        </a>
                    </div>
                </div>
                <div className="grid grid-4-column guides-grid">
                    <a href="#" className="card card-type-play">
                        <span className="body-20">
                            Sharpen your skills and understand how to get the most out of Movement
                        </span>
                        <span className="play-wrap">
                            <button className="play">
                                <svg
                                    width="38"
                                    height="44"
                                    viewBox="0 0 38 44"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M37.6506 22.0001L0.114485 43.9951L0.114487 0.00516918L37.6506 22.0001Z"
                                        fill=""
                                    />
                                </svg>
                            </button>
                        </span>
                    </a>
                    <a href="#" className="card card-type-3">
                        <picture>
                            <img src="/images/dev-tools-img.jpg" alt="" />
                        </picture>
                        <div className="card-content">
                            <span className="title">Title</span>
                            <p className="desc">Description</p>
                            <span className="tags">
                                <span className="tag">Tag</span>
                                <span className="tag">Tag</span>
                            </span>
                        </div>
                    </a>
                    <a href="#" className="card card-type-3">
                        <picture>
                            <img src="/images/dev-tools-img.jpg" alt="" />
                        </picture>
                        <div className="card-content">
                            <span className="title">Title</span>
                            <p className="desc">
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                            </p>
                            <span className="tags">
                                <span className="tag">Tag</span>
                                <span className="tag">Tag</span>
                            </span>
                        </div>
                    </a>
                    <a href="#" className="card card-type-3">
                        <picture>
                            <img src="/images/dev-tools-img.jpg" alt="" />
                        </picture>
                        <div className="card-content">
                            <span className="title">Title</span>
                            <p className="desc">Description</p>
                            <span className="tags">
                                <span className="tag">Tag</span>
                                <span className="tag">Tag</span>
                            </span>
                        </div>
                    </a>
                </div>
            </section>
        </div>
    )
}
