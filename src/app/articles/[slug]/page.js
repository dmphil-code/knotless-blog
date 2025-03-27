"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getArticleBySlug, getArticleById } from '../../services/api';
import ArticleLayout from '../../components/ArticleLayout';
import ReactMarkdown from 'react-markdown';
import useWindowSize from '../../hooks/useWindowSize';

export default function ArticleDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const windowSize = useWindowSize();
  
  // Check if slug is a number (ID) or string (slug)
  const isId = !isNaN(Number(slug));

  useEffect(() => {
    if (!slug) return;

    const fetchArticle = async () => {
      setLoading(true);
      try {
        let articleData;
        if (isId) {
          // Fetch by ID if slug is a number
          articleData = await getArticleById(Number(slug));
        } else {
          // Fetch by slug
          articleData = await getArticleBySlug(slug);
        }
        
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
      <ArticleLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
          <p style={{ fontSize: '1.25rem', color: '#666' }}>Loading article...</p>
        </div>
      </ArticleLayout>
    );
  }

  if (error || !article) {
    return (
      <ArticleLayout>
        <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#E9887E' }}>
            Article Not Found
          </h1>
          <p style={{ fontSize: '1.125rem', marginBottom: '2rem', color: '#666' }}>
            The article you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link href="/" style={{ 
            backgroundColor: '#E9887E', 
            color: 'white', 
            padding: '0.75rem 1.5rem', 
            borderRadius: '2rem', 
            textDecoration: 'none',
            display: 'inline-block'
          }}>
            Return to Homepage
          </Link>
        </div>
      </ArticleLayout>
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

  // Image URL handling
  const getThumbnailUrl = () => {
    if (!article.thumbnail || !article.thumbnail.url) return null;
    
    return article.thumbnail.url.startsWith('http') 
      ? article.thumbnail.url 
      : `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${article.thumbnail.url}`;
  };

  // Custom component mapping for ReactMarkdown
  const components = {
    img: ({ src, alt, ...props }) => {
      // Handle internal image URLs
      if (src && !src.startsWith('http')) {
        src = `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${src}`;
      }
      return (
        <div style={{display: 'flex', justifyContent: 'center', margin: '2rem 0'}}>
          <img 
            src={src} 
            alt={alt || ''} 
            style={{
              maxWidth: '100%', 
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
            }} 
            {...props} 
          />
        </div>
      );
    },
    h1: ({ children }) => <h1 style={{fontSize: '2.25rem', fontWeight: 'bold', margin: '2rem 0 1rem', color: '#444'}}>{children}</h1>,
    h2: ({ children }) => <h2 style={{fontSize: '1.875rem', fontWeight: 'bold', margin: '1.75rem 0 1rem', color: '#444'}}>{children}</h2>,
    h3: ({ children }) => <h3 style={{fontSize: '1.5rem', fontWeight: 'bold', margin: '1.5rem 0 0.75rem', color: '#444'}}>{children}</h3>,
    p: ({ children }) => <p style={{margin: '1.25rem 0', lineHeight: '1.7', color: '#444', fontSize: '1.125rem'}}>{children}</p>,
    ul: ({ children }) => <ul style={{marginLeft: '1.5rem', marginBottom: '1.25rem', listStyleType: 'disc'}}>{children}</ul>,
    ol: ({ children }) => <ol style={{marginLeft: '1.5rem', marginBottom: '1.25rem', listStyleType: 'decimal'}}>{children}</ol>,
    li: ({ children }) => <li style={{marginBottom: '0.75rem', lineHeight: '1.6', color: '#444'}}>{children}</li>,
    a: ({ children, href }) => <a href={href} style={{color: '#E9887E', textDecoration: 'underline'}}>{children}</a>,
    strong: ({ children }) => <strong style={{fontWeight: 'bold', color: '#333'}}>{children}</strong>,
    blockquote: ({ children }) => <blockquote style={{
      borderLeft: '4px solid #E9887E',
      paddingLeft: '1.5rem',
      marginLeft: '0',
      marginRight: '0',
      marginTop: '1.5rem',
      marginBottom: '1.5rem',
      fontStyle: 'italic',
      color: '#555'
    }}>{children}</blockquote>
  };

  return (
    <ArticleLayout>
      {/* Hero Section - Full width */}
      <div style={{
        width: '100%',
        backgroundImage: 'url("/images/hero-background2.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'soft-light',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: windowSize.width < 768 ? '80px 20px 60px' : '100px 40px 80px',
        marginTop: '-80px' // This removes the gap between header and hero
      }}>
        {/* Hero Content Container - For centering and max-width */}
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: windowSize.width < 992 ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: windowSize.width < 992 ? '30px' : '60px'
        }}>
          {/* Thumbnail Image - Left side on desktop, top on mobile */}
          <div style={{
            width: windowSize.width < 992 ? '100%' : '40%',
            display: 'flex',
            justifyContent: windowSize.width < 992 ? 'center' : 'flex-end'
          }}>
            {getThumbnailUrl() ? (
              <img
                src={getThumbnailUrl()}
                alt={article.title}
                style={{ 
                  width: windowSize.width < 992 ? '100%' : 'auto', 
                  maxWidth: '100%',
                  height: windowSize.width < 992 ? 'auto' : '400px',
                  maxHeight: windowSize.width < 768 ? '250px' : '400px',
                  objectFit: 'cover',
                  borderRadius: '12px',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
                }}
              />
            ) : (
              <div style={{
                width: windowSize.width < 992 ? '100%' : '400px',
                height: windowSize.width < 992 ? '250px' : '400px',
                backgroundColor: '#333',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#666'
              }}>
                No image available
              </div>
            )}
          </div>
          
          {/* Text Content - Right side on desktop, bottom on mobile */}
          <div style={{
            width: windowSize.width < 992 ? '100%' : '60%',
            textAlign: windowSize.width < 992 ? 'center' : 'left',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Back link positioned at top of text column */}
            <div style={{
              marginBottom: '20px',
              alignSelf: windowSize.width < 992 ? 'center' : 'flex-start'
            }}>
              <Link 
                href="/" 
                style={{ 
                  color: 'white',
                  textDecoration: 'none', 
                  display: 'flex',
                  alignItems: 'center',
                  fontWeight: '500',
                  fontSize: windowSize.width < 768 ? '0.9rem' : '1rem'
                }}
              >
                <span style={{ marginRight: '6px' }}>←</span> Back to all articles
              </Link>
            </div>
            
            {/* Title */}
            <h1 style={{ 
              color: 'white',
              fontSize: windowSize.width < 768 ? '1.75rem' : windowSize.width < 992 ? '2.25rem' : '2.75rem',
              fontWeight: 'bold',
              marginBottom: '1.5rem',
              lineHeight: '1.2',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
            }}>
              {article.title}
            </h1>
            
            {/* Author and Date info */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              alignItems: windowSize.width < 992 ? 'center' : 'flex-start'
            }}>
              {article.author && article.author.name && (
                <p style={{ 
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: windowSize.width < 768 ? '1rem' : '1.125rem',
                  fontWeight: '500',
                  margin: 0,
                  textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)'
                }}>
                  {article.author.name}
                </p>
              )}
              
              <p style={{ 
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: windowSize.width < 768 ? '0.9rem' : '1rem',
                margin: 0,
                textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)'
              }}>
                {publishDate}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Article Content Section */}
      <article style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        padding: '40px 20px 60px'
      }}>
        {/* Article content with proper styling - Using content field */}
        <div style={{ margin: '0 auto' }} className="markdown-content">
          {article.content ? (
            <ReactMarkdown components={{
              ...components,
              // Override some components for responsive design
              h1: ({ children }) => (
                <h1 style={{
                  fontSize: windowSize.width < 768 ? '1.75rem' : '2.25rem', 
                  fontWeight: 'bold', 
                  margin: '2rem 0 1rem', 
                  color: '#444'
                }}>
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 style={{
                  fontSize: windowSize.width < 768 ? '1.5rem' : '1.875rem', 
                  fontWeight: 'bold', 
                  margin: '1.75rem 0 1rem', 
                  color: '#444'
                }}>
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 style={{
                  fontSize: windowSize.width < 768 ? '1.25rem' : '1.5rem', 
                  fontWeight: 'bold', 
                  margin: '1.5rem 0 0.75rem', 
                  color: '#444'
                }}>
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p style={{
                  margin: '1.25rem 0', 
                  lineHeight: '1.7', 
                  color: '#444', 
                  fontSize: windowSize.width < 768 ? '1rem' : '1.125rem'
                }}>
                  {children}
                </p>
              ),
            }}>
              {article.content}
            </ReactMarkdown>
          ) : (
            <p>No content available for this article.</p>
          )}
        </div>
  
        {/* Categories */}
        {article.categories && article.categories.length > 0 && (
          <div style={{ 
            marginTop: '3rem', 
            paddingTop: '1.5rem', 
            borderTop: '1px solid #eee' 
          }}>
            <h2 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              marginBottom: '1rem',
              color: '#444'
            }}>Categories</h2>
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '0.5rem' 
            }}>
              {article.categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug || category.id}`}
                  style={{ 
                    backgroundColor: '#FFE8C9', 
                    color: '#773800',
                    padding: windowSize.width < 480 ? '0.4rem 0.8rem' : '0.5rem 1rem', 
                    borderRadius: '2rem', 
                    fontSize: windowSize.width < 480 ? '0.8rem' : '0.875rem',
                    textDecoration: 'none',
                    fontWeight: '500'
                  }}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </ArticleLayout>
  );
}