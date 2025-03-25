// src/app/components/AffLinkCard.js
import React from 'react';
import Link from 'next/link';
import styles from './AffLinkCard.module.css';

const AffLinkCard = ({ product }) => {
  const { 
    title, 
    link = '#', // Default link if none provided
  } = product;

  return (
    <div className={styles['aff-link-card']}>
      <Link href={link} target="_blank" rel="noopener noreferrer">
        <div className={styles['aff-link-card-inner']}>
          {/* Title only */}
          <div className={styles['aff-link-content']}>
            <h3 className={styles['aff-link-title']}>{title}</h3>
            
            {/* Shop Now Button (Visible on Hover) */}
            <div className={styles['aff-link-shop-now']}>
              View
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default AffLinkCard;