import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '../utils/helpers';
import styles from './ArticleCard.module.css';

const ArticleCard = ({ article }) => {
  // Extract the necessary data from the article object
  const { title, publishDate, slug, thumbnail, author } = article;
  
  // Determine thumbnail URL based on Strapi's response structure
  const thumbnailUrl = thumbnail?.url || thumbnail?.formats?.medium?.url || thumbnail?.formats?.small?.url || '';
  
  // Handle case where thumbnail might be nested differently in Strapi response
  const getThumbnailUrl = () => {
    if (thumbnailUrl) return thumbnailUrl;
    
    // Check if thumbnail is nested as it sometimes is in Strapi responses
    if (typeof thumbnail === 'object' && thumbnail !== null) {
      // Look for common Strapi image URL patterns
      return thumbnail.url || 
        (thumbnail.data && thumbnail.data.attributes && 
          (thumbnail.data.attributes.url || 
           thumbnail.data.attributes.formats?.medium?.url || 
           thumbnail.data.attributes.formats?.small?.url));
    }
    
    return '';
  };
  
  const imageUrl = getThumbnailUrl();

  return (
    <div className={styles.articleCardContainer}>
      <Link href={`/article/${slug}`} style={{ textDecoration: 'none' }}>
        <div className={styles.articleCard}>
          {/* Background Image */}
          <div className={styles.articleCardImage}>
            {imageUrl ? (
              // Use a regular img tag as a fallback if Next.js Image component causes issues
              <img 
                src={imageUrl.startsWith('/') ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${imageUrl}` : imageUrl}
                alt={title || 'Article thumbnail'}
                className={styles.articleThumbnail}
              />
            ) : (
              <div className={styles.articlePlaceholder}></div>
            )}
          </div>
          
          {/* Dark Overlay */}
          <div className={styles.articleOverlay}></div>
          
          {/* Date in top left */}
          <div className={styles.articleDate}>
            {formatDate(publishDate)}
          </div>
          
          {/* Title area at bottom */}
          <div className={styles.articleTitleArea}>
            <h3 className={styles.articleTitle}>{title ? title.toUpperCase() : 'UNTITLED ARTICLE'}</h3>
            
            {/* White line and author name - only if author exists */}
            {author && author.name && (
              <>
                <div className={styles.articleDivider}></div>
                <p className={styles.articleAuthor}>{author.name}</p>
              </>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ArticleCard;