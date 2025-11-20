import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface KitCardProps {
  name: string;
  description: string;
  tags: string[];
  docsLink: string;
  replitLink: string;
  icon: string;
  featured?: boolean;
}

const KitCard: React.FC<KitCardProps> = ({
  name,
  description,
  tags,
  docsLink,
  replitLink,
  icon,
  featured = false,
}) => {
  return (
    <div className={`kit-card ${featured ? 'kit-card--featured' : ''}`}>
      <div className="kit-card__icon">
        <div className="kit-card__icon-placeholder">
          {/* Placeholder for icon - using first letter until icons are added */}
          <span>{name.charAt(0)}</span>
        </div>
      </div>

      <div className="kit-card__content">
        <h3 className="kit-card__title">{name}</h3>
        <p className="kit-card__description">{description}</p>

        <div className="kit-card__tags">
          {tags.map((tag, index) => (
            <span key={index} className="kit-card__tag">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="kit-card__actions">
        <Link href={docsLink} className="btn btn-secondary" target="_blank" rel="noopener noreferrer">
          View Docs
        </Link>
        <Link href={replitLink} className="btn btn-yellow" target="_blank" rel="noopener noreferrer">
          Open in Replit
        </Link>
      </div>
    </div>
  );
};

export default KitCard;
