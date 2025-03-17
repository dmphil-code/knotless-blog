import Link from 'next/link';

// Array of placeholder gradient backgrounds for when we don't have images
const placeholderBackgrounds = [
  'linear-gradient(to right, #FFE8C9, #F4B637)',
  'linear-gradient(to right, #F4B637, #E9887E)',
  'linear-gradient(to right, #E9887E, #FFE8C9)'
];

export default function ArticleCard({ article }) {
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
  
  // Select a placeholder background if needed
  const placeholderBackground = placeholderBackgrounds[Math.floor(Math.random() * placeholderBackgrounds.length)];
  
  return (
    <div className="article-card" style={{
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      backgroundColor: 'white',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Article image */}
      <div style={{
        height: '200px',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <Link href={linkPath} style={{ display: 'block', height: '100%' }}>
          {article.image ? (
            <img 
              src={article.image} 
              alt={article.title || 'Article thumbnail'}
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                transition: 'transform 0.3s ease'
              }}
            />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              background: placeholderBackground,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#773800',
              fontWeight: '500'
            }}>
              <span>No image available</span>
            </div>
          )}
        </Link>
      </div>
      
      {/* Article content */}
      <div style={{
        padding: '25px',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1
      }}>
        {/* Category and date row */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '10px',
          fontSize: '0.85rem',
          color: '#666'
        }}>
          {article.categories && article.categories.length > 0 && (
            <span style={{ color: '#E9887E', fontWeight: '500' }}>
              {article.categories[0].name}
            </span>
          )}
          
          {formattedDate && (
            <span>{formattedDate}</span>
          )}
        </div>
        
        {/* Article title */}
        <h2 style={{
          fontSize: '1.25rem',
          fontWeight: 'bold',
          marginBottom: '12px',
          lineHeight: 1.3,
          color: '#333'
        }}>
          <Link href={linkPath} style={{ 
            color: 'inherit', 
            textDecoration: 'none',
            transition: 'color 0.2s ease'
          }}>
            {article.title}
          </Link>
        </h2>
        
        {/* Article excerpt */}
        {article.excerpt && (
          <p style={{
            fontSize: '0.95rem',
            marginBottom: '20px',
            color: '#555',
            lineHeight: 1.6,
            flexGrow: 1
          }}>
            {article.excerpt.length > 120
              ? `${article.excerpt.substring(0, 120)}...`
              : article.excerpt}
          </p>
        )}
        
        {/* Read more link */}
        <Link href={linkPath} style={{
          color: '#E9887E',
          textDecoration: 'none',
          fontWeight: '500',
          fontSize: '0.9rem',
          display: 'inline-flex',
          alignItems: 'center',
          marginTop: 'auto',
          borderBottom: '1px solid transparent',
          paddingBottom: '3px',
          transition: 'border-color 0.2s ease'
        }} className="read-more-link">
          READ MORE
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
            style={{ marginLeft: '6px' }}
          >
            <path d="M5 12h14"></path>
            <path d="M12 5l7 7-7 7"></path>
          </svg>
        </Link>
      </div>
    </div>
  );
}