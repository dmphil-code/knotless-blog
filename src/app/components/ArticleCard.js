import Link from 'next/link';

export default function ArticleCard({ article }) {
  return (
    <div className="article-card">
      <div className="article-image">
        {article.image ? (
          <img 
            src={article.image} 
            alt={article.title} 
          />
        ) : (
          <div className="placeholder-image">
            <span>No image</span>
          </div>
        )}
      </div>
      <div className="article-content">
        <h2 className="article-title">
          <Link href={`/articles/${article.slug}`}>
            {article.title}
          </Link>
        </h2>
        <p className="article-excerpt">
          {article.excerpt || article.content?.substring(0, 150) + '...'}
        </p>
        <Link href={`/articles/${article.slug}`} className="read-more">
          READ MORE
        </Link>
      </div>
    </div>
  );
}