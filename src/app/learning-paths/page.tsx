import BreadCrumbs from '@/components/Breadcrumbs/BreadCrumbs'
import HeroSlider from '@/components/Slider/HeroSlider'
import { getSubCategories } from '@/lib/posts'
import Link from 'next/link'

export default function LearningPathLandingPage() {
    // get categories by slug
    const categories = getSubCategories('learning-paths')

    return (
        <div id="learning-paths-wrap" className="subpage-wrap">

            <BreadCrumbs contain={true}>
                <Link href="/learning-paths">Learning Paths</Link>
            </BreadCrumbs>

            <HeroSlider secClass="learning-paths-slider">
                <div className="slide">
                    <div className="col-lt">
                        <div className="hero-grid grid grid-3-column">
                            <Link href="#" className="card card-type-3">
                                <picture>
                                    <img src="/images/learning-paths-grid-thumb.jpg" alt="" />
                                </picture>
                                <div className="card-content">
                                    <span className="title">Guides</span>
                                </div>
                            </Link>
                            <Link href="#" className="card card-type-3">
                                <picture>
                                    <img src="/images/learning-paths-grid-thumb.jpg" alt="" />
                                </picture>
                                <div className="card-content">
                                    <span className="title">Blogs</span>
                                </div>
                            </Link>
                            <Link href="#" className="card card-type-3">
                                <picture>
                                    <img src="/images/learning-paths-grid-thumb.jpg" alt="" />
                                </picture>
                                <div className="card-content">
                                    <span className="title">Docs</span>
                                </div>
                            </Link>
                            <Link href="#" className="card card-type-3">
                                <picture>
                                    <img src="/images/learning-paths-grid-thumb.jpg" alt="" />
                                </picture>
                                <div className="card-content">
                                    <span className="title">Demos</span>
                                </div>
                            </Link>
                            <Link href="#" className="card card-type-3">
                                <picture>
                                    <img src="/images/learning-paths-grid-thumb.jpg" alt="" />
                                </picture>
                                <div className="card-content">
                                    <span className="title">Tutorials</span>
                                </div>
                            </Link>
                            <Link href="#" className="card card-type-3">
                                <picture>
                                    <img src="/images/learning-paths-grid-thumb.jpg" alt="" />
                                </picture>
                                <div className="card-content">
                                    <span className="title">Tools</span>
                                </div>
                            </Link>
                        </div>
                    </div>
                    <div className="col-rt">
                        <div className="inner">
                            <span className="subtitle">Featured</span>
                            <h1 className="title">DeFi</h1>
                            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                        </div>
                    </div>
                </div>
            </HeroSlider>

            <section className="paths-list contain">
                <div className="card path-card">
                    <div className="col col-lt">
                        <svg width="55" height="44" viewBox="0 0 55 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect y="22" width="11" height="11" fill="#FFDA34" />
                            <rect x="11" y="33" width="11" height="11" fill="#FFDA34" />
                            <rect x="11" y="11" width="11" height="11" fill="#FFDA34" />
                            <rect width="11" height="11" fill="#FFDA34" />
                            <rect x="22" y="22" width="11" height="11" fill="#FFDA34" />
                            <rect x="33" y="11" width="11" height="11" fill="#FFDA34" />
                            <rect x="44" width="11" height="11" fill="#FFDA34" />
                            <rect x="44" y="22" width="11" height="11" fill="#FFDA34" />
                            <rect x="33" y="33" width="11" height="11" fill="#FFDA34" />
                        </svg>
                        <div className="content">
                            <Link href="/learning-paths/basic-concepts" className="h2">
                                Basic Concepts
                            </Link>
                            <p>
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
                                Ipsum is simply dummy text of the printing and typesetting industry.
                            </p>
                        </div>
                    </div>
                    <div className="col col-rt">
                        <span>What you will learn:</span>
                        <ul className="body-16">
                            <li>Data Types</li>
                            <li>Functions view Functions & Visibility</li>
                            <li>Resources on Move & Ability of Resource</li>
                            <li>Conditionals & Loops</li>
                            <li>Constants & Error Handling</li>
                            <li>Generics Type & Phantom Type</li>
                            <li>Unit Test</li>
                        </ul>
                    </div>
                </div>
                <div className="card path-card">
                    <div className="col col-lt">
                        <svg width="55" height="44" viewBox="0 0 55 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect y="22" width="11" height="11" fill="#FFDA34" />
                            <rect x="11" y="33" width="11" height="11" fill="#FFDA34" />
                            <rect x="11" y="11" width="11" height="11" fill="#FFDA34" />
                            <rect width="11" height="11" fill="#FFDA34" />
                            <rect x="22" y="22" width="11" height="11" fill="#FFDA34" />
                            <rect x="33" y="11" width="11" height="11" fill="#FFDA34" />
                            <rect x="44" width="11" height="11" fill="#FFDA34" />
                            <rect x="44" y="22" width="11" height="11" fill="#FFDA34" />
                            <rect x="33" y="33" width="11" height="11" fill="#FFDA34" />
                        </svg>
                        <div className="content">
                            <Link href="/learning-paths/more-advanced-concepts" className="h2">
                                Move Advanced
                            </Link>
                            <p>
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
                                Ipsum is simply dummy text of the printing and typesetting industry.
                            </p>
                        </div>
                    </div>
                    <div className="col col-rt">
                        <span>What you will learn:</span>
                        <ul className="body-16">
                            <li>Data Types</li>
                            <li>Functions view Functions & Visibility</li>
                            <li>Resources on Move & Ability of Resource</li>
                            <li>Conditionals & Loops</li>
                            <li>Constants & Error Handling</li>
                            <li>Generics Type & Phantom Type</li>
                            <li>Unit Test</li>
                        </ul>
                    </div>
                </div>
                <div className="card path-card has-video">
                    <div className="col col-lt">
                        <svg width="55" height="44" viewBox="0 0 55 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect y="22" width="11" height="11" fill="#FFDA34" />
                            <rect x="11" y="33" width="11" height="11" fill="#FFDA34" />
                            <rect x="11" y="11" width="11" height="11" fill="#FFDA34" />
                            <rect width="11" height="11" fill="#FFDA34" />
                            <rect x="22" y="22" width="11" height="11" fill="#FFDA34" />
                            <rect x="33" y="11" width="11" height="11" fill="#FFDA34" />
                            <rect x="44" width="11" height="11" fill="#FFDA34" />
                            <rect x="44" y="22" width="11" height="11" fill="#FFDA34" />
                            <rect x="33" y="33" width="11" height="11" fill="#FFDA34" />
                        </svg>
                        <div className="content">
                            <Link href="/learning-paths/non-fungible-token" className="h2">
                                NFTs
                            </Link>
                            <p>
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
                                Ipsum is simply dummy text of the printing and typesetting industry.
                            </p>
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
                        </div>
                    </div>
                    <div className="col col-rt">
                        <span>What you will learn:</span>
                        <ul className="body-16">
                            <li>Data Types</li>
                            <li>Functions view Functions & Visibility</li>
                            <li>Resources on Move & Ability of Resource</li>
                            <li>Conditionals & Loops</li>
                            <li>Constants & Error Handling</li>
                            <li>Generics Type & Phantom Type</li>
                            <li>Unit Test</li>
                        </ul>
                    </div>
                </div>
                <div className="card path-card">
                    <div className="col col-lt">
                        <svg width="55" height="44" viewBox="0 0 55 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect y="22" width="11" height="11" fill="#FFDA34" />
                            <rect x="11" y="33" width="11" height="11" fill="#FFDA34" />
                            <rect x="11" y="11" width="11" height="11" fill="#FFDA34" />
                            <rect width="11" height="11" fill="#FFDA34" />
                            <rect x="22" y="22" width="11" height="11" fill="#FFDA34" />
                            <rect x="33" y="11" width="11" height="11" fill="#FFDA34" />
                            <rect x="44" width="11" height="11" fill="#FFDA34" />
                            <rect x="44" y="22" width="11" height="11" fill="#FFDA34" />
                            <rect x="33" y="33" width="11" height="11" fill="#FFDA34" />
                        </svg>
                        <div className="content">
                            <Link href="/learning-paths/digital-assets" className="h2">
                                Digital Assets
                            </Link>
                            <p>
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
                                Ipsum is simply dummy text of the printing and typesetting industry.
                            </p>
                        </div>
                    </div>
                    <div className="col col-rt">
                        <span>What you will learn:</span>
                        <ul className="body-16">
                            <li>Data Types</li>
                            <li>Functions view Functions & Visibility</li>
                            <li>Resources on Move & Ability of Resource</li>
                            <li>Conditionals & Loops</li>
                            <li>Constants & Error Handling</li>
                            <li>Generics Type & Phantom Type</li>
                            <li>Unit Test</li>
                        </ul>
                    </div>
                </div>
                <div className="nav-arrows">
                    <span className="btn btn-prev">Prev</span>
                    <ul className="nums">
                        <li className="active">
                            <a href="#">1</a>
                        </li>
                        <li>
                            <a href="#">2</a>
                        </li>
                        <li>
                            <a href="#">3</a>
                        </li>
                    </ul>
                    <span className="btn btn-next">Next</span>
                </div>
            </section>

            {/* <section className="contain learning-paths">
                {categories.map((category, index) => {
                    return (
                        <div className="path-link" key={index}>
                            <Link href={category.link} className="learning-content">
                                <h2>{category.name}</h2>
                                <p></p>
                            </Link>
                        </div>
                    )
                })}
            </section> */}
        </div>
    )
}
