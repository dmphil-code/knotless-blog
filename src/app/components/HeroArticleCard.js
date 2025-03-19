// src/app/components/HeroArticleCard.js

import Link from 'next/link';

export default function HeroArticleCard({ article, darkTheme = false }) {
  // Use ID as fallback if slug is not available
  const linkPath = article.slug ? `/articles/${article.slug}` : `/articles/${article.id}`;
  
  return (
    <div className="hero-article-card">
      {/* Image background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0
      }}>
        {article.image ? (
          <img 
            src={article.image} 
            alt={article.title || 'Featured article'}
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              objectPosition: 'center'
            }}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            backgroundColor: darkTheme ? '#333' : '#E9887E',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            <span style={{ fontWeight: '500' }}>
              No image available
            </span>
          </div>
        )}
        
        {/* Dark overlay for better text visibility */}
        <div className="hero-overlay"></div>
        
        {/* Title box - centered on image */}
        <div className="hero-article-title-box">
          {/* Article Title */}
          <h3 className="hero-article-title">
            {article.title.toUpperCase()}
          </h3>
        </div>
        
        {/* READ MORE button at bottom */}
        <div className="hero-read-more">
          READ MORE
        </div>
      </div>
      
      {/* Clickable overlay */}
      <Link href={linkPath} style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 4,
        cursor: 'pointer',
        textDecoration: 'none'
      }} aria-label={`Read article: ${article.title}`}>
        <span style={{ display: 'none' }}>Read more</span>
      </Link>
    </div>
  );
}