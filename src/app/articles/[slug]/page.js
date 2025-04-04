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
      {/* Main container with side image */}
      <div style={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden' // Ensure the image doesn't cause horizontal scrolling
      }}>
        {/* CSS-based vertical lines - 4 colors repeated three times */}
        <div style={{
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: windowSize.width < 1450 ? '-9999px' : 'calc((100% - 1000px) / 2 * 0.25)',
          height: '100vh',
          width: '120px', // Adjusted width for the stripes
          pointerEvents: 'none',
          zIndex: 0,
          display: 'flex',
          flexDirection: 'row'
        }}>
          {/* Create array of colors and map to divs */}
          {[...Array(3)].map((_, groupIndex) => (
            ['#E9887E', '#F4B637', '#FFE8C9', '#773800'].map((color, colorIndex) => (
              <div 
                key={`stripe-${groupIndex}-${colorIndex}`}
                style={{ 
                  flex: '1',
                  height: '100%',
                  backgroundColor: color
                }}
              ></div>
            ))
          ))}
        </div>
        {/* Content with consistent padding */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          padding: '0 20px', // Consistent padding without extra for side image
          maxWidth: '1000px',
          margin: '0 auto',
        }}>
          {/* Redesigned Hero Section with consistent padding */}
          <div style={{
            width: '100%',
            backgroundColor: 'white',
            padding: '60px 0 60px', // Remove horizontal padding from container
            marginTop: '-20px'
          }}>
            {/* Hero Content Container with flex layout */}
            <div style={{
              maxWidth: '1000px',
              margin: '0 auto',
              display: 'flex',
              flexDirection: windowSize.width < 992 ? 'column' : 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '30px',
              paddingRight: '20px', // Add padding to match article content exactly
            }}>
              {/* Left column for all text content - aligned with content section */}
              <div style={{
                flex: '1',
                maxWidth: windowSize.width < 992 ? '100%' : '600px',
              }}>
                {/* Back link at top of text column */}
                <div style={{
                  marginBottom: '40px',
                }}>
                  <Link 
                    href="/" 
                    style={{ 
                      color: '#E9887E',
                      textDecoration: 'none', 
                      display: 'flex',
                      alignItems: 'center',
                      fontWeight: '500',
                      fontSize: '1rem'
                    }}
                  >
                    <span style={{ marginRight: '6px' }}>←</span> Back to all articles
                  </Link>
                </div>
                
                {/* Title */}
                <h1 style={{ 
                  color: '#773800',
                  fontFamily: 'Bauhaus Soft Display, sans-serif',
                  fontSize: windowSize.width < 768 ? '1.75rem' : windowSize.width < 992 ? '2.25rem' : '2.75rem',
                  fontWeight: '600',
                  marginTop: '0',
                  marginBottom: '1.5rem',
                  lineHeight: '1.2',
                  textAlign: 'left'
                }}>
                  {article.title}
                </h1>
                
                {/* Author and date */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  alignItems: 'flex-start'
                }}>
                  {article.author && article.author.name && (
                    <p style={{ 
                      color: '#773800',
                      fontFamily: 'Bauhaus Soft Display, sans-serif',
                      fontSize: windowSize.width < 768 ? '1rem' : '1.125rem',
                      fontWeight: '500',
                      margin: 0
                    }}>
                      {article.author.name}
                    </p>
                  )}
                  
                  <p style={{ 
                    color: '#773800',
                    fontFamily: 'Bauhaus Soft Display, sans-serif',
                    fontSize: windowSize.width < 768 ? '0.9rem' : '1rem',
                    margin: 0
                  }}>
                    {publishDate}
                  </p>
                </div>
              </div>
              
              {/* Right column for image - center aligned with entire text column */}
              <div style={{
                flex: '0 0 auto',
                width: windowSize.width < 768 ? '200px' : '280px',
                alignSelf: 'center',
                marginRight: windowSize.width < 992 ? 'auto' : '0',
                marginLeft: windowSize.width < 992 ? 'auto' : '0',
              }}>
                {getThumbnailUrl() ? (
                  <div style={{
                    width: '100%',
                    height: windowSize.width < 768 ? '200px' : '280px',
                    position: 'relative'
                  }}>
                    <div style={{
                      width: '100%',
                      height: '100%',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      mask: 'url(/images/image_mask3.png) center/contain no-repeat',
                      WebkitMask: 'url(/images/image_mask3.png) center/contain no-repeat',
                      zIndex: 2
                    }}>
                      <img
                        src={getThumbnailUrl()}
                        alt={article.title}
                        style={{ 
                          width: '100%', 
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div style={{
                    width: '100%',
                    height: windowSize.width < 768 ? '200px' : '280px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#666'
                  }}>
                    No image available
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Article Content Section with increased spacing */}
          <article style={{ 
            maxWidth: '1000px', 
            margin: '40px auto 0', // Increased top margin to 40px for more spacing
            padding: '0',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Article content with proper styling - Using content field */}
            <div style={{ 
              margin: '0',
              width: '100%',
              paddingRight: '20px', // Add explicit padding to match hero section
            }} className="markdown-content">
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
                borderTop: '1px solid #eee',
                paddingRight: '20px',
                maxWidth: '100%'
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
        </div>
      </div>
    </ArticleLayout>
  );
}