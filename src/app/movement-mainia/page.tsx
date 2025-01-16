'use client'
import { FAQElement } from '@/components/FAQ/FAQElement'
import Image from 'next/image'
import Link from 'next/link'

export default function MovementMainiaPage() {

    return (
        <div className="movedropWrapper">
            <div className="video-bg">
                <video autoPlay loop muted playsInline preload="meta">
                    <source type="video/mp4" src="/images/mainia/learn-hero.mp4" />
                </video>
            </div>
            <div className="hero l-container">
                <div className="hero_intro">
                    <h1>
                        Movement mAInia
                    </h1>
                    <p>An AI focused hackathon on the Movement Network</p>
                </div>
                <p className="cta">
                    We&apos;re calling on developers, researchers, and innovators to build the next generation of AI-powered applications on the Movement Network.
                </p>
                <Link
                    href="https://forms.movement.xyz/hackathon-signup"
                    className="start-button"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    SIGN UP
                </Link>
            </div>
            <div id="prizes">
                <div className="l-container">
                    <div className="prize-pool">
                        <h2>🏆 Prize Pool: $555,555</h2>
                        <div className="prize-categories">
                            <div className="prize-section">
                                <h3>Cash Prizes</h3>
                                <p className="subtitle">Paid in USDC</p>
                                <div className="prize-list">
                                    <p>Each track offers:</p>
                                    <ul>
                                        <li><span className="medal">🥇</span> First Place: $5,000</li>
                                        <li><span className="medal">🥈</span> Second Place: $3,000</li>
                                        <li><span className="medal">🥉</span> Third Place: $2,000</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="prize-section">
                                <h3>Special Awards</h3>
                                <p className="subtitle">Paid in USDC</p>
                                <div className="prize-list">
                                    <ul>
                                        <li><span className="icon">🧪</span> Research Innovation Award: $2,500</li>
                                        <li><span className="icon">💡</span> Most Creative Idea Award: $2,500</li>
                                        <li><span className="icon">🗿</span> Most [redacted] Idea Award: $555</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="prize-section">
                                <h3>Grant Funding</h3>
                                <p className="subtitle">Paid in MOVE tokens</p>
                                <div className="prize-list">
                                    <p>Each track has up to $100,000 in additional grant funding available, subject to:</p>
                                    <ul>
                                        <li>Project milestones</li>
                                        <li>Token lockup periods</li>
                                        <li>Ongoing development requirements</li>
                                        <li>Movement Labs team assessment</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="movedrop-wrap">
                <div className="l-container">
                    <div className="movedrop">
                        <h2>🎯 Tracks</h2>
                    </div>
                    <div className="cards movedrop_cards">
                        <div className="card">
                            <span className="meta meta_pink">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="39"
                                    height="39"
                                    viewBox="0 0 39 39"
                                    fill="none"
                                >
                                    <path
                                        d="M25.3819 0H12.691V12.691H0V38.0729H12.691H25.3819V25.3819H38.0729V0H25.3819Z"
                                        fill="#F068D4"
                                    />
                                </svg>
                            </span>
                            <span className="title">1️⃣ DeFAI (Decentralized Finance + AI)</span>
                            <ul>
                                <li>AI Investment DAOs</li>
                                <li>ML-powered DEX optimization</li>
                                <li>Intelligent risk management systems</li>
                                <li>Smart lending protocols</li>
                            </ul>
                        </div>
                        <div className="card">
                            <span className="meta meta_green">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="38"
                                    height="38"
                                    viewBox="0 0 38 38"
                                    fill="none"
                                >
                                    <path
                                        d="M24.8843 12.4421V24.8843H12.4421V12.4421H24.8843V0H12.4421H0V37.3264H12.4421H24.8843H37.3264V24.8843V12.4421H24.8843Z"
                                        fill="#29CF96"
                                    />
                                </svg>
                            </span>
                            <span className="title">2️⃣ Consumer AI dApps</span>
                            <ul>
                                <li>Decentralized service platforms</li>
                                <li>AI-powered sharing economy solutions</li>
                                <li>Personal finance assistants</li>
                                <li>Community marketplaces</li>
                            </ul>
                        </div>
                        <div className="card">
                            <span className="meta meta_blue">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="38"
                                    height="38"
                                    viewBox="0 0 38 38"
                                    fill="none"
                                >
                                    <path
                                        d="M37.3264 12.4421V0H24.8843H12.4421H0V12.4421V24.8843H12.4421V37.3264H24.8843H37.3264V24.8843H24.8843V12.4421H37.3264Z"
                                        fill="#0337FF"
                                    />
                                </svg>
                            </span>
                            <span className="title">3️⃣ GAIming</span>
                            <ul>
                                <li>AI-driven game mechanics</li>
                                <li>Dynamic NFT systems</li>
                                <li>Intelligent matchmaking</li>
                                <li>Economic balancing tools</li>
                            </ul>
                        </div>
                        <div className="card">
                            <span className="meta meta_pink">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="39"
                                    height="39"
                                    viewBox="0 0 39 39"
                                    fill="none"
                                >
                                    <path
                                        d="M25.3819 0H12.691V12.691H0V38.0729H12.691H25.3819V25.3819H38.0729V0H25.3819Z"
                                        fill="#F068D4"
                                    />
                                </svg>
                            </span>
                            <span className="title">4️⃣ Social Intelligence</span>
                            <ul>
                                <li>Sentiment analysis</li>
                                <li>Community management</li>
                                <li>Market intelligence</li>
                                <li>Automated engagement</li>
                            </ul>
                        </div>
                        <div className="card">
                            <span className="meta meta_green">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="38"
                                    height="38"
                                    viewBox="0 0 38 38"
                                    fill="none"
                                >
                                    <path
                                        d="M24.8843 12.4421V24.8843H12.4421V12.4421H24.8843V0H12.4421H0V37.3264H12.4421H24.8843H37.3264V24.8843V12.4421H24.8843Z"
                                        fill="#29CF96"
                                    />
                                </svg>
                            </span>
                            <span className="title">5️⃣ Smart Contract Security</span>
                            <ul>
                                <li>AI code analysis</li>
                                <li>Vulnerability detection</li>
                                <li>Security automation</li>
                                <li>Development tools</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div id="timeline" className="l-container">
                <h2>🗓️ Timeline</h2>
                <ul className="timeline-list">
                    <li><strong>Registration Opens:</strong> January 20th 2025</li>
                    <li><strong>Hackathon Start:</strong> January 20th 2025</li>
                    <li><strong>Project Submissions Due:</strong> February 16th 2025</li>
                    <li><strong>Shortlisting period:</strong> February 16th - 24th 2025</li>
                    <li><strong>Winners Announced:</strong> February 27th 2025</li>
                </ul>
            </div>

            <div id="workshops" className="l-container">
                <h2>🎓 Workshop Schedule</h2>
                <p className="workshop-note">All workshops will be recorded and made available to registered participants.</p>

                <div className="workshop-weeks">
                    <div className="workshop-week">
                        <h3>Week 1: Foundations</h3>
                        <div className="workshop-sessions">
                            <div className="session">
                                <h4>Intro to Movement & AI Integration</h4>
                                <ul>
                                    <li>Overview of Movement&apos;s architecture</li>
                                    <li>AI integration possibilities</li>
                                    <li>Setting up your development environment</li>
                                </ul>
                            </div>
                            <div className="session">
                                <h4>Building with Move Lang</h4>
                                <ul>
                                    <li>Move language fundamentals</li>
                                    <li>Smart contract development</li>
                                    <li>Best practices and common patterns</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="workshop-week">
                        <h3>Week 2: Track-Specific Deep Dives</h3>
                        <div className="workshop-sessions">
                            <div className="session">
                                <h4>DeFAI Workshop</h4>
                                <ul>
                                    <li>AI in financial protocols</li>
                                    <li>Building autonomous investment systems</li>
                                    <li>Integration with existing DeFi protocols</li>
                                </ul>
                            </div>
                            <div className="session">
                                <h4>Consumer AI dApps</h4>
                                <ul>
                                    <li>User experience design</li>
                                    <li>AI service integration</li>
                                    <li>Building for mainstream adoption</li>
                                </ul>
                            </div>
                            <div className="session">
                                <h4>GAIming Development</h4>
                                <ul>
                                    <li>Game mechanics and AI</li>
                                    <li>NFT integration</li>
                                    <li>Economic design patterns</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="workshop-week">
                        <h3>Week 3: Advanced Topics</h3>
                        <div className="workshop-sessions">
                            <div className="session">
                                <h4>Security & Best Practices</h4>
                                <ul>
                                    <li>Smart contract security</li>
                                    <li>AI model security</li>
                                    <li>Testing and auditing</li>
                                </ul>
                            </div>
                            <div className="session">
                                <h4>Integration Workshop</h4>
                                <ul>
                                    <li>API integration</li>
                                    <li>Frontend development</li>
                                    <li>Testing and deployment</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="workshop-week">
                        <h3>Week 4: Special Topics</h3>
                        <div className="workshop-sessions">
                            <div className="session">
                                <h4>Research & Innovation</h4>
                                <ul>
                                    <li>Academic perspectives</li>
                                    <li>Novel applications</li>
                                    <li>Future directions</li>
                                </ul>
                            </div>
                            <div className="session">
                                <h4>Grant Funding Preparation</h4>
                                <ul>
                                    <li>Project pitching</li>
                                    <li>Documentation best practices</li>
                                    <li>Post-hackathon opportunities</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <p className="schedule-note">*All dates and times TBA. Schedule subject to change.</p>
            </div>

            <div id="support" className="l-container">
                <h2>👥 Support</h2>
                <ul>
                    <li>Live Technical Support</li>
                    <li>Office Hours with Movement Labs Team</li>
                    <li>Community Discord Channel</li>
                    <li>Documentation Repository</li>
                </ul>
            </div>

            <div id="submission" className="l-container">
                <h2>📋 Submission Requirements</h2>
                <ol>
                    <li>Working Prototype</li>
                    <li>Source Code</li>
                    <li>Documentation</li>
                    <li>Video Demo</li>
                    <li>Presentation Deck</li>
                </ol>
            </div>

            <div id="judging" className="l-container">
                <h2>⚖️ Judging Process</h2>
                <p>In a first-of-its-kind approach, all project evaluations will be conducted by humans and AI agents. These agents will assess submissions based on:</p>
                <ul>
                    <li>Technical Innovation</li>
                    <li>Practical Utility</li>
                    <li>Integration Quality</li>
                    <li>User Experience</li>
                    <li>Documentation</li>
                    <li>Presentation</li>
                </ul>
            </div>

            <div id="eligibility" className="l-container">
                <h2>🎓 Eligibility</h2>
                <ul>
                    <li>Open to individuals and teams worldwide</li>
                    <li>Must be 18 or older</li>
                    <li>Submissions must be deployed on Movement testnet/mainnet</li>
                </ul>
            </div>

            <div id="contact" className="l-container">
                <h2>📬 Contact</h2>
                <p>For questions and support:</p>
                <ul>
                    <li>
                        <Link href="https://t.me/+BKg0ywBpta82NWE5" target="_blank" rel="noopener noreferrer">
                            Movement MAInia dedicated Telegram channel
                        </Link>
                    </li>
                    <li>
                        <Link href="https://t.me/+430YefZ9s65iODQx" target="_blank" rel="noopener noreferrer">
                            General Move Builders Telegram channel
                        </Link>
                    </li>
                </ul>
            </div>

            <div id="faqs" className="l-container">
                <h2>🔍 FAQ</h2>
                <div className="faqs__list">
                    <FAQElement title="How do I register?">
                        <p>You can register via the Airtable form, only one submission is needed per team.</p>
                    </FAQElement>
                    <FAQElement title="Can I work as a team?">
                        <p>Yes! Teams of up to 4 people are welcome.</p>
                    </FAQElement>
                    <FAQElement title="How does the grant funding work?">
                        <p>Up to $100,000 in MOVE tokens is available per track for promising projects. Funding is subject to milestones, lockup periods, and ongoing development requirements set by the Movement Labs team.</p>
                    </FAQElement>
                    <FAQElement title="Can I submit to multiple tracks?">
                        <p>No, pick which track your project falls in most closely if its classification is hazy.</p>
                    </FAQElement>
                    <FAQElement title="What happens after the hackathon?">
                        <p>Outstanding projects may be eligible for:</p>
                        <ul>
                            <li>Grant funding</li>
                            <li>Technical support</li>
                            <li>Integration assistance</li>
                            <li>Marketing support</li>
                            <li>Community exposure</li>
                        </ul>
                    </FAQElement>
                </div>
                <p className="disclaimer">*All prizes and grant funding are subject to terms and conditions. Movement Labs reserves the right to modify the prize structure and requirements.</p>
            </div>
        </div>
    )
}