import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '../utils/helpers';
import styles from './ArticleCard.module.css';

const ArticleCard = ({ article }) => {
  const { title, publishDate, slug, thumbnail, author } = article;

  return (
    <div className={styles.articleCardContainer}>
      <Link href={`/article/${slug}`} style={{ textDecoration: 'none' }}>
        <div className={styles.articleCard}>
          {/* Background Image */}
          <div className={styles.articleCardImage}>
            {thumbnail ? (
              <Image 
                src={thumbnail.url} 
                alt={title}
                fill
                style={{ objectFit: 'cover' }}
                priority
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
            <h3 className={styles.articleTitle}>{title.toUpperCase()}</h3>
            
            {/* White line and author name - only if author exists */}
            {author && (
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