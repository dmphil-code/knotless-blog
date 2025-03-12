"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getArticleBySlug, getArticleById } from '../../services/api';
import Layout from '../../components/Layout';

export default function ArticleDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Check if slug is a number (ID) or string (slug)
  const isId = !isNaN(Number(slug));

  useEffect(() => {
    if (!slug) return;

    const fetchArticle = async () => {
      setLoading(true);
      try {
        console.log(`Fetching article by ${isId ? 'ID' : 'slug'}: ${slug}`);
        
        let articleData;
        if (isId) {
          // Fetch by ID if slug is a number
          articleData = await getArticleById(Number(slug));
        } else {
          // Fetch by slug
          articleData = await getArticleBySlug(slug);
        }
        
        console.log('Article data:', articleData);
        
        if (!articleData) {
          setError('Article not found');
        } else {
          setArticle(articleData);
        }
      } catch (err) {
        setError('Error loading article');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug, isId]);

  if (loading) {
    return (
      <Layout title="Loading...">
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '256px' }}>
            <p style={{ fontSize: '1.25rem' }}>Loading article...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !article) {
    return (
      <Layout title="Article Not Found">
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px' }}>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '16px' }}>Article Not Found</h1>
            <p style={{ fontSize: '1.25rem', marginBottom: '32px' }}>The article you're looking for doesn't exist or has been removed.</p>
            <Link href="/" style={{ color: '#2563eb', textDecoration: 'none' }}>
              Return to Homepage
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  // Parse the date
  const publishDate = article.publishDate 
    ? new Date(article.publishDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Unknown date';

  // Prepare content for rendering
  const renderContent = () => {
    if (!article.content) return null;
    
    // Check if content is an array (Strapi rich text format)
    if (Array.isArray(article.content)) {
      return (
        <div>
          {article.content.map((block, index) => {
            // Handle different block types
            switch (block.type) {
              case 'paragraph':
                return (
                  <p key={index} style={{ marginBottom: '16px' }}>
                    {block.children && block.children.map((child, childIndex) => {
                      if (child.type === 'link') {
                        return (
                          <a 
                            key={childIndex} 
                            href={child.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ color: '#2563eb', textDecoration: 'none' }}
                          >
                            {child.children && child.children[0] ? child.children[0].text : ''}
                          </a>
                        );
                      }
                      return child.text || '';
                    })}
                  </p>
                );
              
              case 'heading':
                const headingStyle = {
                  fontWeight: 'bold',
                  marginTop: '16px',
                  marginBottom: '16px'
                };
                
                switch (block.level) {
                  case 1:
                    return <h1 key={index} style={{ ...headingStyle, fontSize: '2.25rem' }}>{block.children[0]?.text || ''}</h1>;
                  case 2:
                    return <h2 key={index} style={{ ...headingStyle, fontSize: '1.875rem' }}>{block.children[0]?.text || ''}</h2>;
                  case 3:
                    return <h3 key={index} style={{ ...headingStyle, fontSize: '1.5rem' }}>{block.children[0]?.text || ''}</h3>;
                  case 4:
                    return <h4 key={index} style={{ ...headingStyle, fontSize: '1.25rem' }}>{block.children[0]?.text || ''}</h4>;
                  case 5:
                    return <h5 key={index} style={{ ...headingStyle, fontSize: '1.125rem' }}>{block.children[0]?.text || ''}</h5>;
                  case 6:
                    return <h6 key={index} style={{ ...headingStyle, fontSize: '1rem' }}>{block.children[0]?.text || ''}</h6>;
                  default:
                    return <h3 key={index} style={{ ...headingStyle, fontSize: '1.5rem' }}>{block.children[0]?.text || ''}</h3>;
                }
              
              case 'list':
                const listStyle = {
                  paddingLeft: '20px',
                  marginBottom: '16px',
                };
                
                if (block.format === 'ordered') {
                  return (
                    <ol key={index} style={{ ...listStyle, listStyleType: 'decimal' }}>
                      {block.children && block.children.map((item, itemIndex) => (
                        <li key={itemIndex} style={{ marginLeft: '0', paddingLeft: '0' }}>
                          {item.children && item.children[0] ? item.children[0].text : ''}
                        </li>
                      ))}
                    </ol>
                  );
                } else {
                  return (
                    <ul key={index} style={{ ...listStyle, listStyleType: 'disc' }}>
                      {block.children && block.children.map((item, itemIndex) => (
                        <li key={itemIndex} style={{ marginLeft: '0', paddingLeft: '0' }}>
                          {item.children && item.children[0] ? item.children[0].text : ''}
                        </li>
                      ))}
                    </ul>
                  );
                }
              
              default:
                if (block.text) {
                  return <p key={index} style={{ marginBottom: '16px' }}>{block.text}</p>;
                }
                return null;
            }
          })}
        </div>
      );
    }
    
    // Fallback for string content
    return <div dangerouslySetInnerHTML={{ __html: article.content }} />;
  };

  return (
    <Layout>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
        <article style={{ maxWidth: '768px', margin: '0 auto' }}>
          {/* Back link positioned above the main title */}
          <Link 
            href="/" 
            style={{ 
              color: '#2563eb', 
              textDecoration: 'none', 
              display: 'inline-block', 
              marginBottom: '24px' 
            }}
          >
            ← Back to all articles
          </Link>

          {/* Single main title */}
          <h1 style={{ 
            fontSize: '2.25rem', 
            fontWeight: 'bold', 
            marginBottom: '24px', 
            textAlign: 'center' 
          }}>
            {article.title}
          </h1>

          {/* Author and date stacked vertically */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            textAlign: 'center', 
            marginBottom: '32px' 
          }}>
            {article.author && (
              <div style={{ marginBottom: '8px' }}>
                <span style={{ color: '#374151', fontWeight: '500' }}>{article.author.name}</span>
              </div>
            )}
            <span style={{ color: '#6b7280' }}>{publishDate}</span>
          </div>

          {/* Centered thumbnail image */}
          {article.thumbnail && article.thumbnail.url && (
            <div style={{ 
              marginBottom: '40px', 
              display: 'flex', 
              justifyContent: 'center' 
            }}>
              <img
                src={`${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${article.thumbnail.url}`}
                alt={article.title}
                style={{ 
                  borderRadius: '8px', 
                  maxHeight: '384px', 
                  objectFit: 'cover' 
                }}
              />
            </div>
          )}

          {/* Article content with proper margins */}
          <div style={{ margin: '0 auto' }}>
            {renderContent()}
          </div>

          {/* Categories */}
          {article.categories && article.categories.length > 0 && (
            <div style={{ 
              marginTop: '48px', 
              paddingTop: '24px', 
              borderTop: '1px solid #e5e7eb' 
            }}>
              <h2 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '600', 
                marginBottom: '16px' 
              }}>Categories</h2>
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '8px' 
              }}>
                {article.categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/categories/${category.slug || category.id}`}
                    style={{ 
                      backgroundColor: '#f3f4f6', 
                      padding: '4px 12px', 
                      borderRadius: '9999px', 
                      fontSize: '0.875rem',
                      textDecoration: 'none',
                      color: 'inherit'
                    }}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    </Layout>
  );
}