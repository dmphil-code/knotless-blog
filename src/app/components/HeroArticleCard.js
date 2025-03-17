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

  // Get first category if available
  const firstCategory = article.categories && article.categories.length > 0
    ? article.categories[0]
    : null;
  
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
        
        {/* Title bar at bottom with semitransparent background */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          padding: '15px',
          backgroundColor: 'rgba(233, 136, 126, 0.8)',
          textAlign: 'center',
          zIndex: 2
        }}>
          <h3 style={{
            margin: 0,
            color: darkTheme ? 'white' : '#333',
            fontWeight: '500',
            fontSize: '1rem',
            letterSpacing: '1px'
          }}>
            {article.title}
          </h3>
        </div>
        
        {/* Optional: Category tag if available */}
        {firstCategory && (
          <div style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            backgroundColor: 'rgba(233, 136, 126, 0.8)',
            color: darkTheme ? 'white' : '#333',
            padding: '5px 10px',
            fontSize: '0.8rem',
            fontWeight: '500',
            zIndex: 2
          }}>
            {firstCategory.name}
          </div>
        )}
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