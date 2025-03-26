// src/app/components/AffLinkCard.js
import React from 'react';
import Link from 'next/link';
import styles from './AffLinkCard.module.css';

const AffLinkCard = ({ affiliate }) => {
  // Extract properties from affiliate object
  const { 
    name,        // Name field from Strapi
    url,         // URL field from Strapi 
    company      // Company field from Strapi
  } = affiliate;

  return (
    <div className={styles['aff-link-card']}>
      <Link 
        href={url || '#'} 
        target="_blank" 
        rel="noopener noreferrer"
        style={{ textDecoration: 'none' }} // Explicitly remove underline from Link
      >
        <div className={styles['aff-link-card-inner']}>
          <div className={styles['aff-link-content']}>
            {/* Name (in larger font) - with additional inline style to prevent underline */}
            <h3 className={styles['aff-link-name']} style={{ textDecoration: 'none' }}>
              {name}
            </h3>
            
            {/* Company (if it exists) - with additional inline style to prevent underline */}
            {company && (
              <p className={styles['aff-link-company']} style={{ textDecoration: 'none' }}>
                {company}
              </p>
            )}
            
            {/* Visit button (visible on hover) */}
            <div className={styles['aff-link-shop-now']}>
              Visit
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default AffLinkCard;