import Link from 'next/link';

export default function HeroArticleCard({ article, darkTheme = false }) {
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
    <div style={{
      position: 'relative',
      height: '100%',
      width: '100%',
      overflow: 'hidden',
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
              objectPosition: 'center',
              transition: 'transform 0.5s ease'
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
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.4)', // Dark overlay
          zIndex: 1
        }}></div>
        
        {/* Title box - centered on image */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          backgroundColor: 'white', // Fully opaque
          padding: '25px',
          borderRadius: '6px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
          zIndex: 2,
          textAlign: 'center'
        }}>
          {/* Article Title */}
          <h3 style={{
            margin: 0,
            marginBottom: '10px',
            color: '#333',
            fontWeight: 'bold',
            fontSize: '1.4rem',
            lineHeight: 1.3
          }}>
            {article.title}
          </h3>
          
          {/* Date if available */}
          {formattedDate && (
            <p style={{
              fontSize: '0.9rem',
              color: '#666',
              margin: 0
            }}>
              {formattedDate}
            </p>
          )}
        </div>
      </div>
      
      {/* Clickable overlay */}
      <Link href={linkPath} style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 3,
        cursor: 'pointer',
        textDecoration: 'none'
      }} aria-label={`Read article: ${article.title}`}>
        <span style={{ display: 'none' }}>Read more</span>
      </Link>
    </div>
  );
}