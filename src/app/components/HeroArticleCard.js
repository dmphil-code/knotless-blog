import Link from 'next/link';

export default function HeroArticleCard({ article }) {
  // Use ID as fallback if slug is not available
  const linkPath = article.slug ? `/articles/${article.slug}` : `/articles/${article.id}`;
  
  // Format date if available
  const formattedDate = article.publishDate 
    ? new Date(article.publishDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : '';
  
  return (
    <div className="hero-article-card" style={{
      borderRadius: '10px',
      overflow: 'hidden',
      position: 'relative',
      boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
      height: '400px',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      cursor: 'pointer'
    }}>
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
              transition: 'transform 0.5s ease'
            }}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#E9887E',
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
        
        {/* Dark overlay gradient */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0.2) 100%)',
          zIndex: 1
        }}></div>
      </div>
      
      {/* Content container */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        padding: '30px 25px',
        zIndex: 2,
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
      }}>
        {/* Category tag if available */}
        {article.categories && article.categories.length > 0 && (
          <span style={{
            backgroundColor: 'rgba(233, 136, 126, 0.9)',
            color: 'white',
            padding: '0.3rem 1rem',
            borderRadius: '2rem',
            fontSize: '0.8rem',
            fontWeight: '500',
            marginBottom: '1rem',
            display: 'inline-block'
          }}>
            {article.categories[0].name}
          </span>
        )}
        
        {/* Article metadata */}
        {formattedDate && (
          <div style={{
            marginBottom: '0.75rem',
            fontSize: '0.9rem',
            opacity: 0.9
          }}>
            {formattedDate}
          </div>
        )}
        
        {/* Article title */}
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          marginBottom: '1.5rem',
          lineHeight: 1.3,
          padding: '0 10px'
        }}>
          {article.title}
        </h2>
        
        {/* Read more button */}
        <Link href={linkPath} style={{
          backgroundColor: 'transparent',
          color: 'white',
          padding: '0.7rem 1.5rem',
          borderRadius: '30px',
          textDecoration: 'none',
          fontWeight: '500',
          fontSize: '0.9rem',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          display: 'inline-flex',
          alignItems: 'center',
          border: '2px solid white',
          transition: 'all 0.3s ease'
        }}>
          Read More
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            style={{ marginLeft: '8px' }}
          >
            <path d="M5 12h14"></path>
            <path d="M12 5l7 7-7 7"></path>
          </svg>
        </Link>
      </div>
      
      {/* Hover effect overlay - entire card is clickable */}
      <Link href={linkPath} style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 3,
        cursor: 'pointer',
        textDecoration: 'none',
        background: 'transparent',
        transition: 'background-color 0.3s ease'
      }} aria-label={`Read article: ${article.title}`}>
        <span style={{ display: 'none' }}>Read more</span>
      </Link>
    </div>
  );
}