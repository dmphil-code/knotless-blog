import Link from 'next/link';
import Image from 'next/image';

export default function ArticleCard({ article }) {
  // Use ID as fallback if slug is not available
  const linkPath = article.slug ? `/articles/${article.slug}` : `/articles/${article.id}`;
  
  return (
    <Link href={linkPath} className="block article-card hover:shadow-lg transition-shadow">
      <div className="article-image">
        {article.image ? (
          // Use div with fixed position and size for Next Image component
          <div style={{ position: 'relative', width: '100%', height: '200px' }}>
            {/* Since we're keeping img for now with ESLint warning suppressed */}
            <img 
              src={article.image} 
              alt={article.title || 'Article thumbnail'}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        ) : (
          <div className="placeholder-image">
            <span>No image</span>
          </div>
        )}
      </div>
      <div className="article-content">
        <h2 className="article-title">
          {article.title}
        </h2>
        <p className="article-excerpt">
          {article.excerpt || (article.content && typeof article.content === 'string' ? article.content.substring(0, 150) + '...' : '')}
        </p>
        <span className="read-more">
          READ MORE
        </span>
      </div>
    </Link>
  );
}