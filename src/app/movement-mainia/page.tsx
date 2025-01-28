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
                    href="https://airtable.com/appMmudt1GU2UXhvV/pagJddwzqUl5IAg4b/form"
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

            <div id="sponsors" className="l-container">
                <h2>🤝 Sponsors</h2>
                <div className="sponsors-grid">
                    <div className="sponsor-tier gold">
                        <h3>Gold</h3>
                        <div className="sponsor-list">
                            <Link href="https://x.com/YuzuDEX" target="_blank" rel="noopener noreferrer" className="sponsor">Yuzu</Link>
                            <Link href="https://x.com/fleek" target="_blank" rel="noopener noreferrer" className="sponsor">Fleek</Link>
                        </div>
                    </div>

                    <div className="sponsor-tier silver">
                        <h3>Silver</h3>
                        <div className="sponsor-list">
                            <Link href="https://x.com/caesar_data" target="_blank" rel="noopener noreferrer" className="sponsor">Caesar</Link>
                            <Link href="https://twitter.com/root_mud" target="_blank" rel="noopener noreferrer" className="sponsor">RootMUD</Link>
                        </div>
                    </div>

                    <div className="sponsor-tier bronze">
                        <h3>Bronze</h3>
                        <div className="sponsor-list">
                            <Link href="https://buidlerboard.bewater.xyz" target="_blank" rel="noopener noreferrer" className="sponsor">BeWater</Link>
                            <Link href="https://x.com/PicWeGlobal" target="_blank" rel="noopener noreferrer" className="sponsor">PicWe</Link>
                            <Link href="https://x.com/codeandledger" target="_blank" rel="noopener noreferrer" className="sponsor">Code & Ledger</Link>
                            <Link href="https://x.com/j17crypto" target="_blank" rel="noopener noreferrer" className="sponsor">J17</Link>
                        </div>
                    </div>
                </div>
            </div>

            <div id="bounties" className="l-container">
                <h2>💰 Bounty Descriptions</h2>
                
                <div className="bounty-section">
                    <h3>Prizes from rootMUD DAO</h3>
                    <p>rootMUD DAO is a decentralized autonomous organization built on the Move Stack.</p>
                    <Link href="https://twitter.com/root_mud" target="_blank" rel="noopener noreferrer" className="bounty-link">Twitter Profile</Link>

                    <h4>Focus Areas</h4>
                    <div className="focus-area">
                        <h5>Scaffold-Move</h5>
                        <p>Scaffold has proven to be an essential public resource for blockchain ecosystems, enabling developers to concentrate on core functionality instead of basic features like wallet connections. Following the success of scaffold-eth, we&apos;re seeking applications built using scaffold-move!</p>
                        <Link href="https://github.com/NonceGeek/scaffold-move/" target="_blank" rel="noopener noreferrer" className="bounty-link">View on GitHub</Link>
                    </div>

                    <div className="focus-area">
                        <h5>MoveDID + AI Agent Integration</h5>
                        <p>MoveDID is a decentralized identity protocol developed by the rootMUD community. Following the W3C DID specification, it can represent various entities as on-chain objects.</p>
                        <Link href="https://www.w3.org/TR/did-core/" target="_blank" rel="noopener noreferrer" className="bounty-link">W3C Specification</Link>
                        <Link href="https://github.com/NonceGeek/MoveDID" target="_blank" rel="noopener noreferrer" className="bounty-link">MoveDID on GitHub</Link>
                    </div>

                    <div className="focus-area">
                        <h5>AI SaaS on Movement</h5>
                        <p>We&apos;re exploring new models for AI Services built on Movement. What opportunities emerge when users can generate images or videos by paying with Movement-based cryptocurrencies? Could this create a new paradigm for AI Software-as-a-Service?</p>
                    </div>

                    <div className="focus-area">
                        <h5>Innovation Track</h5>
                        <p>We welcome additional innovative projects! You&apos;re eligible for our bounties if you believe your project brings something unique and exciting to the ecosystem.</p>
                    </div>

                    <div className="prize-structure">
                        <h4>Prize Structure</h4>
                        <ul>
                            <li>Three (3) prizes of $1,000 each for exceptional projects</li>
                            <li>Four (4) prizes of $500 each for promising projects</li>
                        </ul>
                    </div>
                </div>

                <div className="bounty-section">
                    <h3>Prizes From BeWater</h3>
                    <p>BeWater is launching BuidlerBoard in 2025, a new platform aimed at creating a decentralized, algorithmically transparent leaderboard for open-source developers, repositories, and organizations.</p>
                    <Link href="https://buidlerboard.bewater.xyz" target="_blank" rel="noopener noreferrer" className="bounty-link">Visit BuidlerBoard</Link>
                    
                    <p>BuidlerBoard aspires to become the primary reference for developer-focused airdrops.</p>
                    <p>For this Hackathon, BeWater offers two $500 prizes for the following challenges:</p>

                    <div className="focus-area">
                        <h5>1. Onchain Decentralized BuidlerBoard Design</h5>
                        <p>Create a system where developers can submit their GitHub repositories, accounts, or organizations to BuidlerBoard. The leaderboard should evaluate and rank submissions based on one or more onchain functions.</p>
                    </div>

                    <div className="focus-area">
                        <h5>2. Movement Airdrop Tool Development</h5>
                        <p>Develop an onchain airdrop tool targeting developers, open-source projects, or GitHub organizations. The tool should support distribution of both cryptocurrencies and NFTs.</p>
                    </div>
                </div>

                <div className="bounty-section">
                    <h3>Fleek Bounty $10,000 Prize Pool: Deploy an AI Agent!</h3>
                    <p>Fleek is offering $10,000 in prizes to reward the overall most innovative AI agents deployed. Whether you are a first time builder or experienced developer this is your chance to redefine what&apos;s possible with AI agent while showcasing your creativity and skills!</p>

                    <h4>What is Fleek?</h4>
                    <p>Fleek is the Autonomous Cloud for building and deploying the next generation of apps and AI agents. We prioritize autonomy, scalability and simplicity empowering builders to bring their visions to life with tools designed for the future.</p>

                    <h4>Bounty Categories</h4>
                    
                    <div className="focus-area">
                        <h5>1. Best Overall AI Agent – $5,000</h5>
                        <p><strong>Objective:</strong> Reward the most innovative and comprehensive AI agent built with Fleek AI Agents using the Eliza Framework.</p>
                        <p><strong>Criteria:</strong></p>
                        <ul>
                            <li>Outstanding functionality and performance</li>
                            <li>Originality in the use case</li>
                            <li>High-quality character file (personality, behavior, and knowledge configuration)</li>
                            <li>Demonstration of real-world value or utility</li>
                            <li>Seamless integration with the plugin-movement framework</li>
                        </ul>
                    </div>

                    <div className="focus-area">
                        <h5>2. Most User-Friendly Agent – $3,000</h5>
                        <p><strong>Objective:</strong> Recognize an agent designed for accessibility and ease of use, ensuring even non-technical users can interact seamlessly.</p>
                        <p><strong>Criteria:</strong></p>
                        <ul>
                            <li>Simplicity in user interaction and intuitive functionality</li>
                            <li>Clear and easy-to-follow instructions</li>
                            <li>Visual/UI enhancements or user guides (if applicable)</li>
                        </ul>
                    </div>

                    <div className="focus-area">
                        <h5>3. Community Choice Award – $2,000</h5>
                        <p><strong>Objective:</strong> Celebrate the agent that wins the hearts of the Fleek and plugin-movement community.</p>
                        <p><strong>Criteria:</strong></p>
                        <ul>
                            <li>Total number of votes from community members</li>
                            <li>Projects must meet a minimum quality threshold to qualify</li>
                        </ul>
                    </div>

                    <div className="submission-requirements">
                        <h4>Submission Requirements</h4>
                        <ul>
                            <li><strong>Deployment:</strong> Your AI agent must be live and operational, built on Fleek using the Eliza Framework.</li>
                            <li><strong>Documentation:</strong> Provide a detailed write-up or video showcasing:
                                <ul>
                                    <li>The purpose and use case of the agent</li>
                                    <li>Configuration details of the character file</li>
                                    <li>Challenges faced and solutions implemented during development</li>
                                </ul>
                            </li>
                            <li><strong>Optional Resources:</strong> Link to a GitHub repository or any other supporting documentation.</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div id="judges" className="l-container">
                <h2>👩‍⚖️ Judges</h2>
                <div className="judges-grid">
                    <div className="judge-card">
                        <div className="judge-image">
                            <Image 
                                src="/images/mainia/soleng.jpg" 
                                alt="Soleng" 
                                width={200} 
                                height={200}
                            />
                        </div>
                        <div className="judge-info">
                            <div className="judge-header">
                                <h3>Soleng</h3>
                                <Link 
                                    href="https://x.com/soleng_agent" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="judge-social"
                                >
                                    @soleng_agent
                                </Link>
                            </div>
                            <p>Soleng is a DevRel AI Agent focusing on solutions engineering and software development. She&apos;ll be helping to asses the quality of code from all submissions and is the first AI agent to be actively judging hackathons in the crypto space.</p>
                        </div>
                    </div>
                    <div className="judge-card">
                        <div className="judge-image">
                            <Image 
                                src="/images/mainia/evan.jpg" 
                                alt="Evan" 
                                width={200} 
                                height={200}
                            />
                        </div>
                        <div className="judge-info">
                            <div className="judge-header">
                                <h3>Evan Desantola</h3>
                                <Link 
                                    href="https://www.linkedin.com/in/desantola/" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="judge-social"
                                >
                                    Evan Desantola
                                </Link>
                            </div>
                            <p>Evan DeSantola is an experienced AI entrepreneur and Web3 advisor/investor. He founded, scaled, and exited Agot AI, a transformer-architecture startup focused on the hospitality sector. With expertise in raising tens of millions in funding, securing blue-chip enterprise contracts and partnerships, building large AI teams, and establishing sales and marketing organizations, Evan now advises or serves on the board of several Web2 and Web3 AI companies. Currently focused on Web3 AI and decentralized tools, he is an active advocate to the growth of Movement's AI ecosystem.</p>
                        </div>
                    </div>
                    <div className="judge-card">
                        <div className="judge-image">
                            <Image 
                                src="/images/mainia/conan.jpg" 
                                alt="Conan" 
                                width={200} 
                                height={200}
                            />
                        </div>
                        <div className="judge-info">
                            <div className="judge-header">
                                <h3>Conan</h3>
                                <Link 
                                    href="https://x.com/conany08" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="judge-social"
                                >
                                    @conany08
                                </Link>
                            </div>
                            <p>Conan, the Founder of Rena Labs, has a research background in machine learning and system design, with relevant financial ML papers published in journals such as IEEE. He was also an early contributor to the Move community, focusing on building low-code stacks related to the Move SC and exploring various move-based crypto AI products.</p>
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
                    <li><strong>Registration Opens:</strong> January 21st 2025</li>
                    <li><strong>Hackathon Start:</strong> January 21st 2025</li>
                    <li><strong>Project Submissions Due:</strong> February 16th 2025</li>
                    <li><strong>Shortlisting period:</strong> February 16th - 24th 2025</li>
                    <li><strong>Winners Announced:</strong> February 26th 2025</li>
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
                        <p>You can register via the <Link href="https://airtable.com/appMmudt1GU2UXhvV/pagJddwzqUl5IAg4b/form" target="_blank" rel="noopener noreferrer">Airtable form</Link>, only one submission is needed per team.</p>
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
