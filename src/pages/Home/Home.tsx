'use client';

import Link from 'next/link';
import KitCard from '@/components/Cards/KitCard';
import { useKits } from '@/hooks/useKits';

export default function Home() {
    const { kits } = useKits();

    return (
        <div className="kits-page">
            {/* Hero Section */}
            <section className="kits-hero">
                <div className="kits-container">
                    <h1 className="kits-hero__title">
                        Everything you need to get started building. Free forever.
                    </h1>
                    <p className="kits-hero__subtitle">
                        Build on Move Language and ship your idea faster, with support from Movement and partners like Replit.
                    </p>
                    <Link href="#kits" className="btn btn-yellow kits-hero__cta">
                        Explore Kits
                    </Link>
                </div>
            </section>

            {/* Kits Grid Section */}
            <section id="kits" className="kits-section">
                <div className="kits-container">
                    <div className="kits-section__header">
                        <h2 className="kits-section__title">Movement Builder Kits</h2>
                        <p className="kits-section__description">
                            Pre-configured development environments with everything you need to build on Movement
                        </p>
                    </div>

                    <div className="kits-grid">
                        {kits.map((kit) => (
                            <KitCard
                                key={kit.id}
                                name={kit.name}
                                description={kit.description}
                                tags={kit.tags}
                                docsLink={kit.docsLink}
                                replitLink={kit.replitLink}
                                icon={kit.icon}
                                featured={kit.featured}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="kits-section">
                <div className="kits-container">
                    <div className="kits-cta">
                        <h2 className="kits-cta__title">Ready to start building?</h2>
                        <p className="kits-cta__description">
                            Check out our events and rewards program to get even more out of your Movement development experience.
                        </p>
                        <Link href="/events" className="btn btn-yellow">
                            View Events & Rewards
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}