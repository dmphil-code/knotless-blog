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
    
    // Strapi Cloud serves media directly, so URLs will be complete
  return article.thumbnail.url;
  };

  // Custom component mapping for ReactMarkdown
  const components = {
    img: ({ src, alt, ...props }) => {
      // Handle internal image URLs
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
    h1: ({ children }) => <h1 style={{fontSize: '2.25rem', fontWeight: 'bold', margin: '2rem 0 1rem', color: '#444', fontFamily: "'Bauhaus Soft Display', sans-serif" }}>{children}</h1>,
    h2: ({ children }) => <h2 style={{fontSize: '1.875rem', fontWeight: 'bold', margin: '1.75rem 0 1rem', color: '#444', fontFamily: "'Bauhaus Soft Display', sans-serif" }}>{children}</h2>,
    h3: ({ children }) => <h3 style={{fontSize: '1.5rem', fontWeight: 'bold', margin: '1.5rem 0 0.75rem', color: '#444', fontFamily: "'Bauhaus Soft Display', sans-serif" }}>{children}</h3>,
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
      <div style={{ position: 'relative', width: '100%' }}>
        {/* Hero section with background */}
        <div style={{ 
          width: '100%',
          marginTop: '-80px', // Negative margin to remove the gap from the header
          paddingTop: '80px',  // Add back padding to maintain content position
          position: 'relative',
          background: 'url("/images/hero_section.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 1,
        }}>
          {/* Hero content container */}
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '30px 20px 60px',
            display: 'flex',
            flexDirection: windowSize.width < 992 ? 'column' : 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '40px',
          }}>
            {/* Content column */}
            <div style={{
              flex: windowSize.width < 992 ? '1 1 100%' : '1 1 60%',
              maxWidth: windowSize.width < 992 ? '100%' : '600px',
              order: windowSize.width < 992 ? 2 : 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: windowSize.width < 992 ? 'center' : 'flex-start',
            }}>
              {/* Back link */}
              <Link 
                href="/" 
                style={{ 
                  color: '#E9887E',
                  textDecoration: 'none', 
                  display: 'flex',
                  alignItems: 'center',
                  fontWeight: '500',
                  fontSize: '1rem',
                  marginBottom: '25px',
                  textShadow: '0 1px 2px rgba(255,255,255,0.8)',
                  background: 'rgba(255, 255, 255, 0.5)',
                  padding: '6px 12px',
                  borderRadius: '20px',
                }}
              >
                <span style={{ marginRight: '6px' }}>←</span> Back to all articles
              </Link>
              
              {/* Title */}
              <h1 style={{ 
                color: '#773800',
                fontFamily: 'Bauhaus Soft Display, sans-serif',
                fontSize: windowSize.width < 768 ? '1.75rem' : windowSize.width < 992 ? '2.25rem' : '2.75rem',
                fontWeight: '600',
                marginTop: '0',
                marginBottom: '1.5rem',
                lineHeight: '1.2',
                textAlign: windowSize.width < 992 ? 'center' : 'left',
                textShadow: '0 1px 3px rgba(255,255,255,0.8)',
              }}>
                {article.title}
              </h1>
              
              {/* Author and date */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                alignItems: windowSize.width < 992 ? 'center' : 'flex-start',
                marginBottom: '20px',
              }}>
                {article.author && article.author.name && (
                  <p style={{ 
                    color: '#773800',
                    fontFamily: 'Bauhaus Soft Display, sans-serif',
                    fontSize: windowSize.width < 768 ? '1rem' : '1.125rem',
                    fontWeight: '500',
                    margin: 0,
                    textShadow: '0 1px 2px rgba(255,255,255,0.8)'
                  }}>
                    {article.author.name}
                  </p>
                )}
                
                <p style={{ 
                  color: '#773800',
                  fontFamily: 'Bauhaus Soft Display, sans-serif',
                  fontSize: windowSize.width < 768 ? '0.9rem' : '1rem',
                  margin: 0,
                  textShadow: '0 1px 2px rgba(255,255,255,0.8)'
                }}>
                  {publishDate}
                </p>
              </div>
            </div>
            
            {/* Image column */}
            <div style={{
              flex: windowSize.width < 992 ? '1 1 100%' : '0 0 auto',
              order: windowSize.width < 992 ? 1 : 2,
              display: 'flex',
              justifyContent: 'center',
            }}>
              {getThumbnailUrl() ? (
                <div style={{
                  width: windowSize.width < 768 ? '200px' : '280px',
                  height: windowSize.width < 768 ? '200px' : '280px',
                  position: 'relative',
                }}>
                  <div style={{
                    width: '100%',
                    height: '100%',
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
                    border: '5px solid rgba(255, 255, 255, 0.9)',
                    borderRadius: '50%',
                  }}>
                    <img
                      src={getThumbnailUrl()}
                      alt={article.title}
                      style={{ 
                        width: '100%', 
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '50%'
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div style={{
                  width: windowSize.width < 768 ? '200px' : '280px',
                  height: windowSize.width < 768 ? '200px' : '280px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#666',
                  border: '5px solid rgba(255, 255, 255, 0.9)',
                }}>
                  No image available
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Article content section with decorative lines */}
        <div style={{ 
          position: 'relative', 
          backgroundColor: 'white',
          boxShadow: '0 -10px 20px rgba(0,0,0,0.05)',
          zIndex: 2,
          padding: '40px 0 60px',
        }}>
          {/* Decorative lines - ONLY in content section */}
          <div style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: windowSize.width < 1440 ? '-9999px' : 'calc((100% - 1000px) / 2 * 0.25)',
            height: 'calc(100% + 2rem)', // Add the footer's top padding to perfectly align
            minHeight: '100%',
            width: '108px',
            pointerEvents: 'none',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'row'
          }}>
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

          { /* Stars in the right column */}          
          <div style={{
            position: 'absolute',
            top: '48px',
            right: windowSize.width < 1450 ? '-9999px' : 'calc((100% - 1000px) / 2 * 0.25)',
            height: '100%',
            width: '120px',
            pointerEvents: 'none',
            zIndex: 1,
          }}>
            {/* First star - top of container, center */}
            <img 
              src="/images/stars.png"
              alt="Decorative star"
              style={{
                position: 'absolute',
                top: '0',
                left: '40%', // Center of column
                transform: 'translateX(-50%)',
                width: '80px',
                height: 'auto',
              }}
            />
            
            {/* Second star - 1/3 of container height + 2rem, 10% right of center */}
            <img 
              src="/images/stars.png"
              alt="Decorative star"
              style={{
                position: 'absolute',
                top: 'calc(33.3% + 2rem)',
                left: '70%', // 10% to the right of center
                transform: 'translateX(-50%)',
                width: '80px',
                height: 'auto',
              }}
            />
            
            {/* Third star - 2/3 of container height + 2rem, 10% left of center */}
            <img 
              src="/images/stars.png"
              alt="Decorative star"
              style={{
                position: 'absolute',
                top: 'calc(66.6% + 2rem)',
                left: '35%', // 10% to the left of center
                transform: 'translateX(-50%)',
                width: '80px',
                height: 'auto',
              }}
            />
          </div>

          {/* Content container */}
          <article style={{ 
            maxWidth: '1000px',
            margin: '0 auto',
            padding: '0 20px',
            position: 'relative',
            zIndex: 2, // Above the decorative lines
          }}>
            {/* Article content */}
            <div className="markdown-content">
              {article.content ? (
                <ReactMarkdown components={{
                  ...components,
                  h1: ({ children }) => (
                    <h1 style={{
                      fontSize: windowSize.width < 768 ? '1.75rem' : '2.25rem', 
                      fontWeight: 'bold', 
                      margin: '2rem 0 1rem', 
                      color: '#444',
                      fontFamily: "'Bauhaus Soft Display', sans-serif" 
                    }}>
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 style={{
                      fontSize: windowSize.width < 768 ? '1.5rem' : '1.875rem', 
                      fontWeight: 'bold', 
                      margin: '1.75rem 0 1rem', 
                      color: '#444',
                      fontFamily: "'Bauhaus Soft Display', sans-serif" 
                    }}>
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 style={{
                      fontSize: windowSize.width < 768 ? '1.25rem' : '1.5rem', 
                      fontWeight: 'bold', 
                      margin: '1.5rem 0 0.75rem', 
                      color: '#444',
                      fontFamily: "'Bauhaus Soft Display', sans-serif" 
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
              }}>
                <h2 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: '600', 
                  marginBottom: '1rem',
                  marginTop:'1rem',
                  color: '#444',
                  fontFamily: "'Bauhaus Soft Display', sans-serif"
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

              {/* Affiliates */}
              {article.affiliates && article.affiliates.length > 0 && (
              <div style={{ 
                marginTop: '1.5rem', 
                paddingTop: '1.5rem'
              }}>
                <h2 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: '600', 
                  marginBottom: '1rem',
                  color: '#444',
                  fontFamily: "'Bauhaus Soft Display', sans-serif"
                }}>Recommended Products</h2>
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '0.5rem' 
                }}>
                  {article.affiliates.map((affiliate) => (
                    <a
                      key={affiliate.id}
                      href={affiliate.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ 
                        backgroundColor: '#F4B637', // Using secondary yellow color
                        color: '#773800',
                        padding: windowSize.width < 480 ? '0.4rem 0.8rem' : '0.5rem 1rem', 
                        borderRadius: '2rem', 
                        fontSize: windowSize.width < 480 ? '0.8rem' : '0.875rem',
                        textDecoration: 'none',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      {affiliate.name}
                      {affiliate.company && (
                        <span style={{
                          marginLeft: '0.25rem',
                          opacity: 0.8,
                          fontSize: windowSize.width < 480 ? '0.7rem' : '0.75rem'
                        }}>
                          by {affiliate.company}
                        </span>
                      )}
                    </a>
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