'use client';

import Link from 'next/link';
import { useEvents } from '@/hooks/useEvents';

export default function Events() {
    const { rewards, hackathons, communityEvents, activeHackathons, recurringEvents } = useEvents();

    return (
        <div className="events-page">
            {/* Hero Section */}
            <section className="events-hero">
                <div className="events-container">
                    <h1 className="events-hero__title">Events & Rewards</h1>
                    <p className="events-hero__subtitle">
                        Build, contribute, and get rewarded for your work in the Movement ecosystem
                    </p>
                </div>
            </section>

            {/* Rewards Section */}
            <section className="rewards-section">
                <div className="events-container">
                    <div className="rewards-card">
                        <h2 className="rewards-card__title">{rewards.title}</h2>
                        <p className="rewards-card__description">{rewards.description}</p>

                        <div className="rewards-card__benefits">
                            <h3 className="rewards-card__benefits-title">What You Get:</h3>
                            <ul className="rewards-card__benefits-list">
                                {rewards.benefits.map((benefit, index) => (
                                    <li key={index}>{benefit}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="rewards-card__eligibility">
                            <strong>Eligibility:</strong> {rewards.eligibility}
                        </div>

                        <Link href={rewards.ctaLink} className="btn btn-yellow">
                            {rewards.ctaText}
                        </Link>
                    </div>
                </div>
            </section>

            {/* Hackathons Section */}
            <section className="hackathons-section">
                <div className="events-container">
                    <div className="section-header">
                        <h2 className="section-header__title">Active Hackathons</h2>
                        <p className="section-header__description">
                            Join our hackathons and compete for prizes
                        </p>
                    </div>

                    <div className="hackathons-grid">
                        {hackathons.map((hackathon) => (
                            <div
                                key={hackathon.id}
                                className={`hackathon-card ${hackathon.status === 'active' ? 'hackathon-card--active' : ''}`}
                            >
                                <div className="hackathon-card__status">
                                    <span className={`status-badge status-badge--${hackathon.status}`}>
                                        {hackathon.status}
                                    </span>
                                </div>

                                <h3 className="hackathon-card__title">{hackathon.title}</h3>
                                <p className="hackathon-card__description">{hackathon.description}</p>

                                <div className="hackathon-card__info">
                                    <div className="info-item">
                                        <span className="info-item__label">Dates</span>
                                        <span className="info-item__value">{hackathon.dates}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-item__label">Total Prizes</span>
                                        <span className="info-item__value info-item__value--highlight">
                                            {hackathon.prizes}
                                        </span>
                                    </div>
                                </div>

                                <div className="hackathon-card__prizes">
                                    <h4 className="hackathon-card__prizes-title">Prize Breakdown:</h4>
                                    <ul className="hackathon-card__prizes-list">
                                        {hackathon.prizeBreakdown.map((prize, index) => (
                                            <li key={index}>{prize}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="hackathon-card__categories">
                                    <span className="categories-label">Categories:</span>
                                    <div className="categories-tags">
                                        {hackathon.categories.map((category, index) => (
                                            <span key={index} className="category-tag">
                                                {category}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="hackathon-card__actions">
                                    <Link
                                        href={hackathon.registrationLink}
                                        className="btn btn-yellow"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Register Now
                                    </Link>
                                    <Link
                                        href={hackathon.learnMoreLink}
                                        className="btn btn-secondary"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Learn More
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Community Events Section */}
            <section className="community-events-section">
                <div className="events-container">
                    <div className="section-header">
                        <h2 className="section-header__title">Community Events</h2>
                        <p className="section-header__description">
                            Join our workshops, office hours, and community gatherings
                        </p>
                    </div>

                    <div className="community-events-grid">
                        {communityEvents.map((event) => (
                            <div key={event.id} className="community-event-card">
                                <div className="community-event-card__header">
                                    <span className="community-event-card__type">{event.type}</span>
                                    {event.recurring && (
                                        <span className="community-event-card__recurring-badge">
                                            Recurring
                                        </span>
                                    )}
                                </div>

                                <h3 className="community-event-card__title">{event.title}</h3>
                                <p className="community-event-card__description">{event.description}</p>

                                <div className="community-event-card__schedule">
                                    <svg className="schedule-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M8 0C3.58 0 0 3.58 0 8C0 12.42 3.58 16 8 16C12.42 16 16 12.42 16 8C16 3.58 12.42 0 8 0ZM8 14C4.69 14 2 11.31 2 8C2 4.69 4.69 2 8 2C11.31 2 14 4.69 14 8C14 11.31 11.31 14 8 14ZM8.5 4H7V9L11.25 11.52L12 10.27L8.5 8.25V4Z" fill="currentColor"/>
                                    </svg>
                                    <span>{event.schedule || event.date}</span>
                                </div>

                                <Link
                                    href={event.registrationLink}
                                    className="btn btn-secondary"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Register
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
