import React from 'react';
import Link from 'next/link';
import { formatDate } from '../utils/helpers';
import styles from './ArticleCard.module.css';

const ArticleCard = ({ article }) => {
  // Extract the necessary data from the article object
  const { id, title, publishDate, slug, image, author } = article;
  
  // Log for debugging
  console.log(`ArticleCard for ${title}:`, { image });
  
  return (
    <div className={styles.articleCardContainer}>
      <Link href={`/articles/${slug || id}`} style={{ textDecoration: 'none' }}>
        <div className={styles.articleCard}>
          {/* Background Image */}
          <div className={styles.articleCardImage}>
            {image ? (
              <img 
                src={image}
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